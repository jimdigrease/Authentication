// import { getSession } from 'next-auth/react';
// import { useEffect, useState } from 'react';

import ProfileForm from './ProfileForm';
import styles from './UserProfile.module.css';

function UserProfile() {
  //const [isLoading, setIsLoading] = useState(true);

  // Client-Side Page Guard (Route Protection):
  // Use getSession() here to redirect if there's got no session instead of 
  // useSession() because the status === 'loading' will be initially even if we 
  // got no any session and it's not the goal here. So redirect if it's no session 
  // to the auth-page. It allows also prevent visiting profile-page if typing 
  // href directly in address line of the browser.
  // It's a Client-Side Route Protection. Also there is another way to protect 
  // pages - Server-Side Page Protection - see it in pages/profile.js, that 
  // allows to redirect instantly, to avoid any loading flashing.
  // useEffect(() => {
  //   getSession().then(session => {
  //     if (!session) {
  //       window.location.href = '/auth';
  //     } else {
  //       setIsLoading(false);
  //     }
  //   });
  // }, []);

  // if (isLoading) {
  //   return <p className={styles.profile}>Loading...</p>;
  // }

  async function changePassword(passwordData) {
    const response = await fetch('/api/user/change-password', {
      method: 'PATCH', 
      body: JSON.stringify(passwordData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log(data);
  }

  return (
    <section className={styles.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={changePassword} />
    </section>
  );
}

export default UserProfile;
