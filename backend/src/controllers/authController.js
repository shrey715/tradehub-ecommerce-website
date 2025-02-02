import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js'; 
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

// helper to verify recaptcha
const verifyRecaptcha = async (token) => {
  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${token}`
  );
  return response.data.success;
};

// helper to verify CAS
const verifyCAS = async (serviceUrl, ticket) => {
  const casUrl = "https://login.iiit.ac.in/cas";
  const casValidateUrl = `${casUrl}/serviceValidate?ticket=${encodeURIComponent(ticket)}&service=${serviceUrl}`;

  const response = await axios.get(casValidateUrl);
  const data = response.data;
  const parser = new XMLParser();
  const jsonData = parser.parse(data);

  const casResponse = jsonData['cas:serviceResponse'];
  if (casResponse['cas:authenticationFailure']) {
    return {
      success: false,
      message: 'CAS authentication failed',
    };
  }

  return {
    success: true,
    message: 'CAS authentication successful',
    user: casResponse['cas:authenticationSuccess']
  }
};

// route for user registration
const register = async (req, res) => {
  console.log('Request for user registration received');
  try {
    const { fname, lname, age, email, contact_no, password, recaptchaToken } = req.body;

    // validating captcha token
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
    }

    console.log('reCAPTCHA verification successful: ', isRecaptchaValid);

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
    const { email, password, recaptchaToken } = req.body;

    // validating captcha token
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
    }

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

// route for CAS callback
const casCallback = async (req, res) => {
  console.log('Request for CAS callback received');
  try {
    const ticket = req.query.ticket;
    if (!ticket) {
      return res.status(400).json({ 
        success: false, 
        message: 'No ticket provided' 
      });
    }

    const serviceUrl = encodeURIComponent(`${process.env.FRONTEND_URL}/auth/cas`);
    const response = await verifyCAS(serviceUrl, ticket);

    if (!response.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'CAS authentication failed' 
      });
    }

    const casResponse = response.user;

    const user = casResponse['cas:attributes'];
    const email = user['cas:E-Mail'];
    const fname = user['cas:FirstName'];
    const lname = user['cas:LastName'];
    
    const exists = await User.findOne({ email });

    if (!exists) {
      const newUser = new User({
        fname: fname,
        lname: lname,
        email: email,
        age: 18,
        contact_no: '0000000000',
        password: 'CAS'
      });
    
      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      res.status(200).json({ 
        success: true, 
        message: 'CAS authentication successful',
        isNewUser: true,
        token
      });
    } else {
      const token = jwt.sign({ id: exists._id }, process.env.JWT_SECRET);

      res.status(200).json({ 
        success: true, 
        message: 'CAS authentication successful',
        isNewUser: false,
        token
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'CAS authentication failed',
      error: error.message
    });
  }
};

export {
  register,
  login,
  verifyjwt,
  casCallback
};