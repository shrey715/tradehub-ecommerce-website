import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FaArrowCircleLeft, FaEye, FaEyeSlash, FaRegEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'motion/react';
import axiosInstance from '../../../lib/api';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet';

const Login = () => {
  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  
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

  const getInputClass = (field) => {
    const baseClass = "w-full px-3 py-3 rounded-lg border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 transition-all";
    if (!touched[field]) return `${baseClass} border-zinc-300 dark:border-zinc-700 focus:ring-zinc-500 dark:focus:ring-zinc-400`;
    if (!formData[field]) return `${baseClass} border-red-300 dark:border-red-700 focus:ring-red-500 dark:focus:ring-red-400`;
    return `${baseClass} border-zinc-300 dark:border-zinc-700 focus:ring-zinc-500 dark:focus:ring-zinc-400`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Set all fields as touched for validation
    setTouched({ email: true, password: true });

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(`/api/auth/login`, formData);
      
      if (response.data.success) {
        toast.success("Login successful");
        localStorage.setItem('jwtToken', response.data.token);
        navigate('/user/profile');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
      className="flex flex-col justify-center items-center w-full space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Login | TradeHub</title>
      </Helmet>
      
      <div className="mb-2 w-full">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            <FaArrowCircleLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <Link to="/auth/register" className="text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            Need an account?
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
          Welcome back
        </motion.h1>
        <motion.p 
          className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Sign in to continue to TradeHub
        </motion.p>
      </div>

      <motion.button
        onClick={handleCASLogin}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 rounded-lg font-medium text-zinc-900 dark:text-zinc-50 shadow-sm transition-all"
      >
        <img src="/iiith.png" alt="IIIT Hyderabad" className="w-6 h-6" />
        Sign in with IIITH CAS
      </motion.button>

      <div className="flex items-center w-full gap-3 text-sm text-zinc-400">
        <div className="h-px bg-zinc-200 dark:bg-zinc-700 flex-1"></div>
        <span className="uppercase font-medium text-xs tracking-wider">Or continue with</span>
        <div className="h-px bg-zinc-200 dark:bg-zinc-700 flex-1"></div>
      </div>

      <form className="w-full space-y-5" id="login-form" onSubmit={onSubmit}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
            <FaRegEnvelope className="w-4 h-4" />
          </span>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            placeholder="Email"
            className={`${getInputClass('email')} pl-10`}
            required
          />
          {touched.email && !formData.email && (
            <p className="mt-1 text-xs text-red-500">Email is required</p>
          )}
        </div>
        
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
            <FaLock className="w-4 h-4" />
          </span>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur('password')}
            placeholder="Password"
            className={`${getInputClass('password')} pl-10`}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
          {touched.password && !formData.password && (
            <p className="mt-1 text-xs text-red-500">Password is required</p>
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
                Signing in...
              </>
            ) : "Sign in with Email"}
          </motion.button>
        </div>
        
        <div className="text-center">
          <Link 
            to="/auth/register" 
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
          >
            Don&apos;t have an account? <span className="font-semibold">Create one</span>
          </Link>
        </div>
      </form>
    </motion.div>
  );
};

export default Login;