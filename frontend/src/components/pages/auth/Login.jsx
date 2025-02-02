import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import ReCAPTCHA from "react-google-recaptcha";

import { FaArrowCircleLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'motion/react';

import axiosInstance from '../../../lib/api';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet';

const Login = () => {
  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef(null);
  const siteKey = import.meta.env.VITE_CAPTCHA_SITE_KEY;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const form = document.getElementById('login-form');
      const formData = new FormData(form);
      const recaptchaValue = recaptchaRef.current?.getValue();

      if (!recaptchaValue) {
        toast.error("Please complete the reCAPTCHA");
        return;
      }

      const data = {
        ...Object.fromEntries(formData.entries()),
        recaptchaToken: recaptchaValue
      };

      const res = await axiosInstance.post(`/api/auth/login`, data);
      
      if (res.data.success) {
        toast.success("Login successful");
        localStorage.setItem('jwtToken', res.data.token);
        navigate('/user/profile');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      recaptchaRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCASLogin = () => {
    const service = encodeURIComponent(window.location.origin + "/auth/cas");
    window.location.href = `https://login.iiit.ac.in/cas/login?service=${service}`;
  };

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

      <button
        onClick={handleCASLogin}
        className="w-full px-4 py-2.5 text-sm font-medium text-zinc-900 bg-white border border-zinc-300 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-700 rounded-md transition-all flex items-center justify-center gap-2"
      >
        <img src="/iiith.png" alt="IIIT Hyderabad" className="w-5 h-5" />
        Login with IIITH CAS
      </button>

      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-300 dark:border-zinc-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-zinc-100 dark:bg-zinc-900 px-2 text-zinc-500 dark:text-zinc-400">
            Or continue with
          </span>
        </div>
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
          <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={siteKey}
          className="flex justify-center my-4"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2.5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Logging in..." : "Login"}
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

export default Login;