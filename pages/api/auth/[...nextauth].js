// [...nextauth].js
// Special file for catch-all dynamic API-route (which must be named exactly), 
// that catches all unknown routes which start with api/auth and some 'login',  
// 'logout' and some other routes that next-auth produces, and all those special
// requests will be automatically handled by next-auth. We can create our own 
// routes (as 'signup') as long as we don't overwrite all those special routes.
// https://next-auth.js.org/getting-started/rest-api - list of special routes.

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { connectDB } from '../../../helpers/db-util';
import { verifyPassword } from '../../../helpers/auth-util';

// Variant for NextAuth-v4
export const authOptions = {
  session: {
    strategy: 'jwt'
  }, 
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials', 
      credentials: {
        email: {label: "Email", type: "email"},
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const client = await connectDB();

        const usersCollection = client.db().collection('users');
        const user = await usersCollection.findOne({ email: credentials.email });

        if (!user) {
          client.close();
          throw new Error('No user found for this email-address!')
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          client.close();
          throw new Error('Could not log you in! The password is not valid.')
        }

        client.close();

        // If returning an object inside an authorize, NextAuth will know that 
        // authorization succeeded. And this object will be encoded in the JWT.
        return { email: user.email, name: null, image: null };

      }
    })
  ]
};

export default NextAuth(authOptions);


// Variant for NextAuth-v3
// export default NextAuth({
//   session: {
//     jwt: true
//   }, 
//   providers: [
//     CredentialsProvider({
//       async authorize(credentials) {
//         const client = await connectDB();

//         const usersCollection = client.db().collection('users');
//         const user = await usersCollection.findOne({ email: credentials.email });

//         if (!user) {
//           client.close();
//           throw new Error('No user found for this email-address!')
//         }

//         const isValid = await verifyPassword(credentials.password, user.password);

//         if (!isValid) {
//           client.close();
//           throw new Error('Could not log you in! The password is not valid.')
//         }

//         client.close();

//         // If returning an object inside an authorize, NextAuth will know that 
//         // authorization succeeded. And this object will be encoded in the JWT.
//         return { email: user.email };

//       }
//     })
//   ]
// });

//export default NextAuth(authOptions);
