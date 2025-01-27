import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import useUserStore from "../../../hooks/UserStore";

import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { Outlet } from "react-router";
import { Link, useNavigate } from "react-router";

import { FaRegCheckCircle, FaArrowCircleLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import axios from "axios";
import { backendUrl } from "../../../main";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const form = document.getElementById('register-form');
    const formData = new FormData(form);

    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    console.log(data);

    if (data.contact_no.length !== 10) {
      toast.error("Phone number must be 10 digits long");
      return;
    }

    const endingDomains = ['@research.iiit.ac.in', '@students.iiit.ac.in', '@iiit.ac.in'];
    if (!endingDomains.some(domain => data.email.endsWith(domain))) {
      toast.error("Invalid email domain");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } 

    await axios.post(`${backendUrl}/api/auth/register`, data)
      .then(res => {
        if(res.data.success) {
          toast.success("Registration successful");
          navigate('/auth/login');
        }
      })
      .catch(err => {
        toast.error("Something went wrong");
        console.error(err);
      });
  }

  return (
    <motion.div 
      className="flex flex-col justify-center items-center text-center w-full h-full p-8 gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Register | TradeHub</title>
      </Helmet>
      <h1 className="text-4xl font-bold flex flex-row justify-start items-center gap-3 w-full">
        <Link to="/" className="text-3xl text-zinc-900 hover:text-zinc-800">
          <FaArrowCircleLeft />
        </Link>
        Register
      </h1>
      <form id="register-form" className="w-full space-y-4" onSubmit={onSubmit}>
        <div className="flex space-x-4">
          <input
            type="text"
            name="fname"
            placeholder="First Name"
            className="p-2 border-b border-zinc-600 w-1/2 active:outline-none focus:outline-none"
            required
          />
          <input
            type="text"
            name="lname"
            placeholder="Last Name"
            className="p-2 border-b border-zinc-600 w-1/2 active:outline-none focus:outline-none"
            required
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-2 border-b border-zinc-600 w-full active:outline-none focus:outline-none"
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          className="p-2 border-b border-zinc-600 w-full active:outline-none focus:outline-none"
          required
        />
        <input
          type="tel"
          name="contact_no"
          placeholder="Phone Number"
          className="p-2 border-b border-zinc-600 w-full active:outline-none focus:outline-none"
          required
        />
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="p-2 border-b border-zinc-600 w-full active:outline-none focus:outline-none"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
            onClick={togglePasswordVisibility}
          >
            <AnimatePresence>
              {showPassword ? (
                <motion.div
                  key="eye-slash"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <FaEyeSlash />
                </motion.div>
              ) : (
                <motion.div
                  key="eye"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <FaEye />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            className="p-2 border-b border-zinc-600 w-full active:outline-none focus:outline-none"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
            onClick={togglePasswordVisibility}
          >
            <AnimatePresence>
              {showPassword ? (
                <motion.div
                  key="eye-slash"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <FaEyeSlash />
                </motion.div>
              ) : (
                <motion.div
                  key="eye"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <FaEye />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-zinc-900 text-zinc-100 rounded-md hover:bg-zinc-800 transition-colors"
        >
          Register
        </button>
      </form>
      <Link to="/auth/login" className="hover:underline">Already have an account? Login</Link>
    </motion.div>
  );
}

const Login = () => {
  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const form = document.getElementById('login-form');
    const formData = new FormData(form);

    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    await axios.post(`${backendUrl}/api/auth/login`, data)
      .then(res => {
        if (res.data.success) {
          toast.success("Login successful");
          const token = res.data.token;
          localStorage.setItem('jwtToken', token);
          navigate('/item/all');
        } else {
          toast.error("Invalid email or password");
        }
      })
      .catch(err => {
        toast.error(err.response.data.message);
      });
  }

  return (
    <motion.div 
      className="flex flex-col justify-center items-center text-center w-full h-full p-8 gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Login | TradeHub</title>
      </Helmet>
      <h1 className="text-4xl font-bold flex flex-row justify-start items-center gap-3 w-full">
        <Link to="/" className="text-3xl text-zinc-900 hover:text-zinc-800">
          <FaArrowCircleLeft />
        </Link>
        Login
      </h1>
      <form className="w-full space-y-4" id="login-form" onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="p-2 border-b border-zinc-600 w-full active:outline-none focus:outline-none"
          required
        />
        <div className="relative w-full">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="p-2 border-b border-zinc-600 w-full active:outline-none focus:outline-none"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
            onClick={togglePasswordVisibility}
          >
            <AnimatePresence>
              {showPassword ? (
                <motion.div
                  key="eye-slash"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <FaEyeSlash />
                </motion.div>
              ) : (
                <motion.div
                  key="eye"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <FaEye />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-zinc-900 text-zinc-100 rounded-md hover:bg-zinc-800 transition-colors"
        >
          Login
        </button>
      </form>
      <Link to="/auth/register" className="hover:underline">Don&apos;t have an account? Register</Link>
    </motion.div>
  );
}

const Logout = () => {
  const { logout } = useUserStore();
  console.log('Logging out');
  useEffect(() => {
    localStorage.removeItem('jwtToken');
    logout();
    console.log('jwtToken:', localStorage.getItem('jwtToken'));
  }, [logout]);

  return (
    <motion.div 
      className="flex flex-col justify-center items-center text-center w-full h-full p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Logout | TradeHub</title>
      </Helmet>
      <h1 className="text-4xl font-bold mb-5">Logout <FaRegCheckCircle className="inline-block text-green-500" /></h1>
      <p className="text-lg text-zinc-800">You have been successfully logged out.</p>
      <p className="text-lg text-zinc-800">
        To go to home page, click <Link to="/" className="text-blue-700 hover:underline">here</Link>. Or to login again, click <Link to="/auth/login" className="text-blue-700 hover:underline">here</Link>. 
      </p>
    </motion.div>
  );
}

const AuthLayout = () => {
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await axios.get(
            `${backendUrl}/api/auth/verifyjwt`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            navigate('/user/profile');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
        }
      }

      verifyToken();
    }
  }, [token, navigate]);

  return (
    <motion.main 
      className="auth-background h-screen relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    > 
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="flex justify-center items-center p-8 h-full relative">
        <div className="bg-white p-2 rounded-lg shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/3">
          <Outlet />
        </div>
      </div>
    </motion.main>
  );
}

export {
  Login,
  Register,
  Logout,
  AuthLayout
};