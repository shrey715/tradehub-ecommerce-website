import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import axiosInstance from '../../../lib/api';

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
          localStorage.removeItem('jwtToken');
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="flex justify-center items-center p-4 sm:p-8 min-h-screen relative">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-sm border border-white/10 dark:border-zinc-800/50">
          <div className="">
            <Outlet />
          </div>
        </div>
      </div>
    </motion.main>
  );
}

export default AuthLayout;