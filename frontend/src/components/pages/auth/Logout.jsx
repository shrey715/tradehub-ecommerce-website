import { useEffect } from 'react';
import useUserStore from '../../../hooks/UserStore';

import { Link } from 'react-router';

import { Helmet } from 'react-helmet';
import { motion } from 'motion/react';
import { FaRegCheckCircle } from 'react-icons/fa';

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

export default Logout;