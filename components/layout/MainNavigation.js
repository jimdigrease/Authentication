import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

import styles from './MainNavigation.module.css';

function MainNavigation() {
  const { data: session, status } = useSession();

  function logoutHandler() {
    signOut();
  }

  return (
    <header className={styles.header}>
      <Link href='/'>
        <a>
          <div className={styles.logo}>Next Auth</div>
        </a>
      </Link>
      <nav>
        <ul>
          {!session && (
            <li>
              <Link href="/auth">Login</Link>
            </li>
          )}
          {session && status === 'authenticated' && (
          <li>
            <Link href="/profile">Profile</Link>
          </li>
          )}
          {session && status === 'authenticated' && (
          <li>
            <button onClick={logoutHandler}>Logout</button>
          </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
