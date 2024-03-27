import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

import styles from './AuthForm.module.css';

async function createUser(email, password) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST', 
    body: JSON.stringify({ email, password }), 
    headers: {
      'Content-type': 'application/json'
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!')
  }

  return data;
}

function AuthForm() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function formSubmitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // Optional: add validation here

    if (isLogin) {
      // First argument describes a proveder(-s), second - is configuration object, 
      // where we describe how signin-proccess should work. In this case prevent the 
      // default redirection to error-page when [...nextauth].js throws an Error. 
      // The result is always an object, if user pass the signin-check or not.
      const result = await signIn('credentials', { 
        redirect: false, 
        email: enteredEmail, 
        password: enteredPassword
      });

      if (!result.error) {
        // Redirect out of auth-form
        // Redirect like as in UserProfile.js using window.location.href is not good 
        // idea here, because it resets entire SPA and all needed states will gone.
        router.replace('/profile');
      }
    } else {
      try {
        const result = await createUser(enteredEmail, enteredPassword);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <section className={styles.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={formSubmitHandler}>
        <div className={styles.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={styles.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required  ref={passwordInputRef}/>
        </div>
        <div className={styles.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={styles.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
