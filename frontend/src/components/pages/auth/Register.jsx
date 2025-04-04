import { useState } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaArrowCircleLeft, FaRegUser, FaRegEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import axiosInstance from "../../../lib/api";

// Validation functions
const validateEmail = (email) => {
  const endingDomains = ['@research.iiit.ac.in', '@students.iiit.ac.in', '@iiit.ac.in'];
  return endingDomains.some(domain => email.endsWith(domain));
};

const validatePhone = (phone) => {
  return phone.length === 10 && /^\d+$/.test(phone);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    age: "",
    contact_no: "",
    password: "",
    confirmPassword: ""
  });
  const [touched, setTouched] = useState({});
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getInputClass = (field, validationFunc = null) => {
    const baseClass = "w-full px-3 py-3 rounded-lg border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 transition-all";
    
    if (!touched[field]) return `${baseClass} border-zinc-300 dark:border-zinc-700 focus:ring-zinc-500 dark:focus:ring-zinc-400`;
    
    if (!formData[field]) return `${baseClass} border-red-300 dark:border-red-700 focus:ring-red-500 dark:focus:ring-red-400`;
    
    if (validationFunc && !validationFunc(formData[field])) {
      return `${baseClass} border-red-300 dark:border-red-700 focus:ring-red-500 dark:focus:ring-red-400`;
    }

    return `${baseClass} border-green-300 dark:border-green-700 focus:ring-green-500 dark:focus:ring-green-400`;
  };

  const getPasswordMatchClass = () => {
    const baseClass = "w-full px-3 py-3 pl-10 rounded-lg border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 transition-all";
    
    if (!touched.confirmPassword) return `${baseClass} border-zinc-300 dark:border-zinc-700 focus:ring-zinc-500 dark:focus:ring-zinc-400`;
    
    if (!formData.confirmPassword) return `${baseClass} border-red-300 dark:border-red-700 focus:ring-red-500 dark:focus:ring-red-400`;
    
    if (formData.password !== formData.confirmPassword) {
      return `${baseClass} border-red-300 dark:border-red-700 focus:ring-red-500 dark:focus:ring-red-400`;
    }

    return `${baseClass} border-green-300 dark:border-green-700 focus:ring-green-500 dark:focus:ring-green-400`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Set all fields as touched for validation
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (!validateEmail(formData.email)) {
      toast.error("Invalid email domain");
      return;
    }

    if (!validatePhone(formData.contact_no)) {
      toast.error("Phone number must be 10 digits long");
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(`/api/auth/register`, formData);
      if (response.data.success) {
        toast.success("Registration successful");
        navigate('/auth/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    } 
  };

  return (
    <motion.div 
      className="flex flex-col justify-center items-center w-full space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Register | TradeHub</title>
      </Helmet>
      
      <div className="mb-2 w-full">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            <FaArrowCircleLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <Link to="/auth/login" className="text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            Already have an account?
          </Link>
        </div>
      </div>

      <div className="w-full text-center space-y-3">
        <motion.h1 
          className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Create your account
        </motion.h1>
        <motion.p 
          className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Join the IIIT-H campus marketplace to buy and sell items
        </motion.p>
      </div>

      <form id="register-form" className="w-full space-y-5" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
              <FaRegUser className="w-4 h-4" />
            </span>
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              onBlur={() => handleBlur('fname')}
              placeholder="First Name"
              className={`${getInputClass('fname')} pl-10`}
              required
            />
            {touched.fname && !formData.fname && (
              <p className="mt-1 text-xs text-red-500">First name is required</p>
            )}
          </div>
          
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
              <FaRegUser className="w-4 h-4" />
            </span>
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              onBlur={() => handleBlur('lname')}
              placeholder="Last Name"
              className={`${getInputClass('lname')} pl-10`}
              required
            />
            {touched.lname && !formData.lname && (
              <p className="mt-1 text-xs text-red-500">Last name is required</p>
            )}
          </div>
        </div>
        
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
            <FaRegEnvelope className="w-4 h-4" />
          </span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            placeholder="Email (@iiit.ac.in domain)"
            className={`${getInputClass('email', validateEmail)} pl-10`}
            required
          />
          {touched.email && formData.email && !validateEmail(formData.email) && (
            <p className="mt-1 text-xs text-red-500">Email must be from IIIT domain</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="relative">
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              onBlur={() => handleBlur('age')}
              placeholder="Age"
              min="0"
              className={getInputClass('age')}
              required
            />
            {touched.age && !formData.age && (
              <p className="mt-1 text-xs text-red-500">Age is required</p>
            )}
          </div>
          
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
              <FaPhone className="w-4 h-4" />
            </span>
            <input
              type="tel"
              name="contact_no"
              value={formData.contact_no}
              onChange={handleChange}
              onBlur={() => handleBlur('contact_no')}
              placeholder="Phone Number (10 digits)"
              className={`${getInputClass('contact_no', validatePhone)} pl-10`}
              required
            />
            {touched.contact_no && formData.contact_no && !validatePhone(formData.contact_no) && (
              <p className="mt-1 text-xs text-red-500">Phone number must be 10 digits</p>
            )}
          </div>
        </div>
        
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
            <FaLock className="w-4 h-4" />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur('password')}
            placeholder="Password (min 6 characters)"
            className={`${getInputClass('password', validatePassword)} pl-10`}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
          {touched.password && formData.password && !validatePassword(formData.password) && (
            <p className="mt-1 text-xs text-red-500">Password must be at least 6 characters</p>
          )}
        </div>
        
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
            <FaLock className="w-4 h-4" />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={() => handleBlur('confirmPassword')}
            placeholder="Confirm Password"
            className={getPasswordMatchClass()}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
          {touched.confirmPassword && formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
          )}
        </div>
        
        <div className="pt-3">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 px-4 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : "Create Account"}
          </motion.button>
        </div>
        
        <div className="text-center">
          <Link 
            to="/auth/login" 
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
          >
            Already have an account? <span className="font-semibold">Sign in</span>
          </Link>
        </div>
      </form>
    </motion.div>
  );
};

export default Register;