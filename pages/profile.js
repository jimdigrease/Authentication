import { unstable_getServerSession } from 'next-auth/next';
import  { authOptions }  from './api/auth/[...nextauth]';

import UserProfile from '../components/profile/UserProfile';

function ProfilePage() {
  return <UserProfile />;
}

export default ProfilePage;

// getSession() don't work for protecting server-side routes in Next-Auth-v4. 
// To redirect on login-page if there is no session use unstable_getServerSession()
// It's a Server-Side Page Protection. Also see Client-Side Page Protection in 
// components/profile/UserProfile.js

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth', 
        permanent: false
      }
    };
  }

  return {
    props: {  }
  }
}


// In Next-Auth-v3 could and should use this variant with getSession()
// import { getSession } from 'next-auth/react';

// export async function getServerSideProps(context) {
//   const session = await getSession({ req: context.req });

//   if (!session) {
//     return {
//       redirect: {
//         destination: '/auth',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: { session },
//   };
// }
