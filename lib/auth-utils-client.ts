import { createClient } from '@/utils/supabase/client';

export type infoUser = {
  full_name: string,
  first_name: string,
  last_name: string,
  email: string,
  username: string,

}

// To fetech the data for the Home page.
export async function dataForHomePage(): Promise<infoUser | null>{
  try{
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
      if (user) {

        // Fetch profile from database 
        const { data: profileData, error:  profileError} = await supabase
          .from('profiles')
          .select('first_name, last_name, username')
          .eq('id', user.id)
          .single();

          const finalData: infoUser = {
            full_name: user?.user_metadata.full_name || '',
            first_name: profileData?.first_name || '',
            last_name: profileData?.last_name || '',
            email: user?.email || '',
            username: profileData?.username || ''
          };

          if ( profileError){
            return null;
          }else {
            return finalData ;
          }

      }
  }catch (error){
    return null;
  }
  return null;
}

