import { useEffect } from 'react';
import useUserStore from '../../../hooks/UserStore';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet';
import { motion } from 'motion/react';
import { FaRegCheckCircle } from 'react-icons/fa';

const Logout = () => {
    const { logout } = useUserStore();
    
    useEffect(() => {
      localStorage.removeItem('jwtToken');
      logout();
    }, [logout]);
  
    return (
      <motion.div 
        className="flex flex-col justify-center items-center text-center w-full space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Helmet>
          <title>Logout | TradeHub</title>
        </Helmet>
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
          className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2"
        >
          <FaRegCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </motion.div>
        
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Logout Successful
          </h1>      
          <p className="text-zinc-500 dark:text-zinc-400">
            You have been successfully signed out of your account
          </p>
        </div>
        
        <div className="space-y-4 pt-4 w-full">
          <Link 
            to="/auth/login"
            className="block w-full py-3 px-4 text-center text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-all"
          >
            Sign In Again
          </Link>
          
          <Link 
            to="/"
            className="block w-full py-3 px-4 text-center text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-all"
          >
            Return to Home
          </Link>
        </div>
      </motion.div>
    );
  }

export default Logout;