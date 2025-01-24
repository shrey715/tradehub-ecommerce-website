import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js'; 

// route for user registration
const register = async (req, res) => {
  console.log('Request for user registration received');
  try {
    const { fname, lname, age, email, contact_no, password } = req.body;

    // check if user already exists
    const existsUser = await User.findOne({ email });

    if (existsUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // create new user
    const newUser = new User({
      fname,
      lname,
      age,
      email,
      contact_no,
      password
    });

    const user = await newUser.save();

    res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// route for user login
const login = async (req, res) => {
  console.log('Request for user login received');
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    res.status(200).json({ success: true, message: 'User logged in successfully', token });
} catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// route for verifying jwt
const verifyjwt = async (req, res) => {
  console.log('Request for verifying jwt received');

  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied due to missing token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Access denied due to invalid token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Access granted' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }  
}

export {
  register,
  login,
  verifyjwt
};