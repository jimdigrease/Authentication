import { hashPassword } from '../../../helpers/auth-util';
import { connectDB } from '../../../helpers/db-util';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const data = req.body;
  const { email, password } = data;

  if (
    !email ||
    email.trim() === '' ||
    !email.includes('@')
  ) {
    res
      .status(422)
      .json({ message: 'Invalid email address!' });
    return;
  }
  if (
    !password ||
    password.trim().length < 7 
  ) {
    res
      .status(422)
      .json({ message: 'Invalid input - password should be at least 7 characters long.' });
    return;
  }

  const client = await connectDB();
  const db = client.db();

  const existingUser = await db.collection('users').findOne({ email: email });

  if (existingUser) {
    res
      .status(422)
      .json({ message: 'User with such email already exists!' });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);

  const result = await db.collection('users').insertOne({
    email: email, 
    password: hashedPassword
  });

  // Error handling omited here, look in another projects, e.g. "Events"

  res
    .status(201)
    .json({ message: 'Successfully signed up!' });
    
  client.close();
}

export default handler;
