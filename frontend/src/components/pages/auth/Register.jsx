import { useState, useRef } from "react";
import { Helmet } from "react-helmet";

import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { Link, useNavigate } from "react-router";

import { FaArrowCircleLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";

import axiosInstance from "../../../lib/api";
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
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

    const form = document.getElementById('register-form');
    const formData = new FormData(form);
    const recaptchaValue = recaptchaRef.current.getValue();

    if (!recaptchaValue) {
      toast.error("Please complete the reCAPTCHA");
      return;
    }

    const data = {
      ...Object.fromEntries(formData.entries()),
      recaptchaToken: recaptchaValue
    };

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

    try {
      setIsSubmitting(true);
      await axiosInstance.post(`/api/auth/register`, data)
        .then(res => {
          if(res.data.success) {
            toast.success("Registration successful");
            navigate('/auth/login');
          }
        })
        .catch(err => {
          toast.error(err.response?.data?.message || "Something went wrong");
          console.error(err);
        });
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    } 
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
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={siteKey}
          className="flex justify-center my-4"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2.5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-md transition-all"
        >
          {isSubmitting ? "Registering..." : "Register"}
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

export default Register;