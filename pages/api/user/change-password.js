import { getServerSession } from 'next-auth/next';
import { authOptions }  from '../auth/[...nextauth]';

import { hashPassword, verifyPassword } from '../../../helpers/auth-util';
import { connectDB } from '../../../helpers/db-util';

async function handler(req, res) {

  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getServerSession(
    req,
    res,
    authOptions
  );

  if (!session) {
    res
      .status(401)
      .json({ message: 'Not authenticated!' });
    return;
  }

  const userEmail = session.user.email;
  const data = req.body;
  const { oldPassword, newPassword } = data;

  if (
    !newPassword ||
    newPassword.trim().length < 7 
  ) {
    res
      .status(422)
      .json({ message: 'Invalid input - password should be at least 7 characters long.' });
    return;
  }

  const client = await connectDB();
  const usersCollection = client.db().collection('users');

  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    res
      .status(404)
      .json({ message: 'User not found!' });
    client.close();
    return;
  }

  const currentPassword = user.password;
  const isVerifiedPassword = await verifyPassword(oldPassword, currentPassword);

  if (!isVerifiedPassword) {
    res
      .status(422)
      .json({ message: 'Invalid old password!' });
    client.close();
  }

  const hashedNewPassword = await hashPassword(newPassword);

  const result = await usersCollection.updateOne(
    { email: userEmail }, 
    { $set: { password: hashedNewPassword } }
  );
  //console.log(result);

  // Error handling omited here, look in another projects, e.g. "Events"

  res
    .status(201)
    .json({ message: 'Password updated successfully!' });
    
  client.close();
}

export default handler;
