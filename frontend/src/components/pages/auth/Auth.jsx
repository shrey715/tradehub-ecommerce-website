import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import useUserStore from "../../../hooks/UserStore";

import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { Outlet } from "react-router";
import { Link, useNavigate } from "react-router";

import { FaRegCheckCircle, FaArrowCircleLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";

import axiosInstance from "../../../lib/api";

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

    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    await axiosInstance.post(`/api/auth/register`, data)
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
      className="flex flex-col justify-center items-center w-full space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Register | TradeHub</title>
      </Helmet>
      <div className="flex items-center justify-between w-full mb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <FaArrowCircleLeft className="w-5 h-5" />
          </Link>
          Register
        </h1>
      </div>
      <form id="register-form" className="w-full space-y-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="fname"
            placeholder="First Name"
            className="px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
            required
          />
          <input
            type="text"
            name="lname"
            placeholder="Last Name"
            className="px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
            required
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="age"
            placeholder="Age"
            className="px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
            required
          />
          <input
            type="tel"
            name="contact_no"
            placeholder="Phone Number"
            className="px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
            required
          />
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            onClick={togglePasswordVisibility}
          >
            <AnimatePresence>
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </AnimatePresence>
          </button>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            onClick={togglePasswordVisibility}
          >
            <AnimatePresence>
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </AnimatePresence>
          </button>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2.5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-md transition-all"
        >
          Register
        </button>
      </form>
      <Link 
        to="/auth/login" 
        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
      >
        Already have an account? <span className="underline">Login</span>
      </Link>
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

    await axiosInstance.post(`/api/auth/login`, data)
      .then(res => {
        if (res.data.success) {
          toast.success("Login successful");
          const token = res.data.token;
          localStorage.setItem('jwtToken', token);
          navigate('/user/profile');
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
      className="flex flex-col justify-center items-center w-full space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Login | TradeHub</title>
      </Helmet>
      <div className="flex items-center justify-between w-full mb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <FaArrowCircleLeft className="w-5 h-5" />
          </Link>
          Login
        </h1>
      </div>
      <form className="w-full space-y-4" id="login-form" onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
          required
        />
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            onClick={togglePasswordVisibility}
          >
            <AnimatePresence>
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </AnimatePresence>
          </button>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2.5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-md transition-all"
        >
          Login
        </button>
      </form>
      <Link 
        to="/auth/register" 
        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
      >
        Don&apos;t have an account? <span className="underline">Register</span>
      </Link>
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
      className="flex flex-col justify-center items-center text-center w-full space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Logout | TradeHub</title>
      </Helmet>
      <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
        Logout <FaRegCheckCircle className="text-green-500" />
      </h1>      
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
          const response = await axiosInstance.get(`/api/auth/verifyjwt`);

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
      className="min-h-screen auth-background bg-cover bg-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    > 
      <div className="absolute inset-0 bg-black/80 backdrop-blur-none"></div>
      <div className="flex justify-center items-center p-4 sm:p-8 min-h-screen relative">
        <div className="bg-white/95 dark:bg-zinc-900/95 p-6 rounded-xl shadow-2xl w-full max-w-md backdrop-blur-sm border border-zinc-200/20 dark:border-zinc-700/20">
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