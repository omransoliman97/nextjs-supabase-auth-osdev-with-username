-- Create or Replace handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_first_name TEXT;
  v_last_name TEXT;
  v_username TEXT;
  v_email TEXT;
  v_full_name TEXT;
  v_base_username TEXT;
  v_unique_username TEXT;
  name_parts TEXT[];
  random_suffix TEXT;
  username_exists BOOLEAN;
  max_attempts INTEGER := 100;
  attempt_count INTEGER := 0;
BEGIN
  -- Extract metadata
  v_first_name := COALESCE(TRIM(new.raw_user_meta_data ->> 'first_name'), '');
  v_last_name := COALESCE(TRIM(new.raw_user_meta_data ->> 'last_name'), '');
  v_username := COALESCE(TRIM(new.raw_user_meta_data ->> 'username'), '');
  v_email := COALESCE(new.email, '');
  v_full_name := COALESCE(TRIM(new.raw_user_meta_data ->> 'full_name'), '');

  -- Handle first name: if empty, use 'new'
  IF LENGTH(v_first_name) = 0 THEN
    -- Try to extract from full_name
    IF LENGTH(v_full_name) > 0 THEN
      name_parts := STRING_TO_ARRAY(v_full_name, ' ');
      v_first_name := COALESCE(name_parts[1], 'new');
    ELSE
      v_first_name := 'new';
    END IF;
  END IF;

  -- Handle last name: if empty, use 'user'
  IF LENGTH(v_last_name) = 0 THEN
    -- Try to extract from full_name
    IF LENGTH(v_full_name) > 0 THEN
      name_parts := STRING_TO_ARRAY(v_full_name, ' ');
      IF ARRAY_LENGTH(name_parts, 1) > 1 THEN
        v_last_name := ARRAY_TO_STRING(name_parts[2:ARRAY_LENGTH(name_parts, 1)], ' ');
      END IF;
    END IF;
    
    -- If still empty, use 'user'
    IF LENGTH(v_last_name) = 0 THEN
      v_last_name := 'user';
    END IF;
  END IF;

  -- Handle username
  v_base_username := v_username;
  
  -- If username is empty or less than 5 characters
  IF LENGTH(v_base_username) < 5 THEN
    -- Try preferred_username, then email prefix, then 'user'
    v_base_username := COALESCE(
      new.raw_user_meta_data ->> 'preferred_username',
      SPLIT_PART(v_email, '@', 1),
      'user'
    );
    
    -- Clean the base username (remove spaces, lowercase)
    v_base_username := LOWER(REPLACE(v_base_username, ' ', ''));
    
    -- Append 5 random numbers
    random_suffix := LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
    v_base_username := v_base_username || random_suffix;
  ELSE
    -- Clean the username
    v_base_username := LOWER(REPLACE(v_base_username, ' ', ''));
  END IF;

  -- Check if username exists and make it unique
  v_unique_username := v_base_username;
  
  SELECT EXISTS(
    SELECT 1 FROM public.profiles WHERE username = v_unique_username
  ) INTO username_exists;
  
  -- Keep adding 2 random numbers until username is available
  WHILE username_exists AND attempt_count < max_attempts LOOP
    random_suffix := LPAD(FLOOR(RANDOM() * 100)::TEXT, 2, '0');
    v_unique_username := v_unique_username || random_suffix;
    
    SELECT EXISTS(
      SELECT 1 FROM public.profiles WHERE username = v_unique_username
    ) INTO username_exists;
    
    attempt_count := attempt_count + 1;
  END LOOP;

  -- Insert the profile (no exceptions raised)
  INSERT INTO public.profiles (id, first_name, last_name, username)
  VALUES (
    new.id,
    v_first_name,
    v_last_name,
    v_unique_username
  );

  RETURN new;
END;
$$;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();