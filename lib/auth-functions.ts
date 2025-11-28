"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";


export async function login(prevState: any , loginData: FormData) {
  const supabase = await createClient();

  const data = {
    // the values from the form (html).
    email: loginData.get("email") as string,
    password: loginData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
   return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signup(prevState: any, signupData: FormData) {
  const supabase = await createClient();

   // the values from the form (html).
  const firstName = signupData.get("first_name") as string;
  const lastName = signupData.get("last_name") as string;
  const userName = signupData.get("username") as string;
  const email = signupData.get("email") as string;
  const password = signupData.get("password") as string;


  // Preserve the user's input values so the form doesn't reset after an error.
  // These values will be returned the fields.
  const rawData = {
    first_name: firstName,
    last_name: lastName,
    email: email,

  };


  // Check first the validation of submit.
  if (firstName.length < 1 ){
    return{ error: 'First name must be at least 5 characters', input: rawData};
  }
  if (lastName.length < 1){
       return{ error:'Last name must be at least 5 characters', input: rawData};
  }
  if ( userName.length < 5 ){
      return{ error:'Please choose an available username', input: rawData};
  }
  if (email.length === 0 || ( !email.includes('@') || !email.includes('.') ) ){
      return{ error:'Email is required and valid', input: rawData};
  }
  if ( password.length < 8 ){
      return { error: 'Password must be at least 8 characters', input: rawData};
  }


  // Create a new user and save additional user_metadata fields 
  // (first_name, last_name, username, full_name) during the sign-up process.
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name : `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        username: userName.toLowerCase(), // to lower case 
      },
    },
  });
  if (signUpError) {
    return { error: signUpError.message, input: rawData };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
  }

  // redirect the user to the main page.
  redirect("/");
}


export async function checkAvailabilityUsername(username: string) {

  const supabase = await createClient();
  const { data, error } = await supabase
      .from('profiles') // This is the name of the table in the database.
      .select('username')
      .eq('username', username)
      .maybeSingle();
  if (data) {
    return false;
  }else {
    return true;
  }
}

export async function sendResetEmail(prevState: any, emailData: FormData) {
    const supabase = await createClient();
    const email = emailData.get('email') as string;
    
    // Check first the validation of the email.
    if (email.length === 0 || ( !email.includes('@') || !email.includes('.') ) ){
      return{ error:'Email is required and valid'};
    }


    const redirectUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${redirectUrl}/auth/callback?next=/reset-password`,
    });
    if (error) {
      return { error: error.message };
    }
  
    // for better security, we do not reveal whether the email exists or not
    return { success: true };
  }


  export async function updateNewPassword(prevState: any, passwordData: FormData){

    const supabase = await createClient();
    const password = passwordData.get('password') as string;
    const confirmPassword = passwordData.get('confirm_password') as string;

    // Check first the validation of the password.
    if ( !password || !confirmPassword ){
      return { error: 'All fields are required'};
    }
    if ( password !== confirmPassword ){
      return { error: 'Passwords do not match'};
    }
    if ( password.length < 8){
      return { error: 'Password must be at least 8 characters'};
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error){
      return { error:'Failed to update password'};
    }
      
    return { success: true};
  }

 

// The authentication flow for all providers.


export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}


export async function signInWithFacebook() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}

export async function signInWithGithub() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}

export async function signInWithApple() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}

export async function signInWithTwitter() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "twitter",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}

export async function signInWithLinkedIn() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "linkedin",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}

export async function signInWithDiscord() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}

export async function signInWithSpotify() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "spotify",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}

export async function signInWithTwitch() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "twitch",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}

export async function signInWithSlack() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "slack",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}
export async function signInWithAzure() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "azure",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}
export async function signInWithBitbucket() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "bitbucket",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}