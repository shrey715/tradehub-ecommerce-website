import { useEffect } from 'react';
import useUserStore from '../../../hooks/UserStore';

import Loading from '../common/Loading';
import Navbar from '../../ui/navbar';

import toast from 'react-hot-toast';

import axiosInstance from '../../../lib/api';
import { Outlet } from 'react-router';

const User = () => {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    console.log('User component mounted');
    const getUser = async () => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        try {
          const res = await axiosInstance.get(`/api/user`);
          setUser(res.data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Failed to fetch user data.');
        }
      } else {
        toast.error('Token missing. Clear your browser cache and login again.');
      }
    };

    getUser();
  }, [setUser]);

  if (!user) {
    return <Loading />;
  }

  return (
    <main className='flex flex-col justify-start w-full h-screen'>      
      <Navbar />
      <div className="w-full h-full flex-1">
        <Outlet />
      </div>
    </main>
  );
};

export default User;