import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import axiosInstance from '../../../lib/api';

import { motion } from 'motion/react';
import { Helmet } from 'react-helmet';
import toast from 'react-hot-toast';
import { FaRegCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { CgSpinnerTwoAlt } from "react-icons/cg";

import PropTypes from 'prop-types';

const toastyToast = (id, message) => {
  return (
    <span>
      {message}
      <button
        className="text-zinc-800 hover:underline"
        onClick={() => toast.dismiss(id)}
      >
        Okay
      </button>
    </span>
  );
}

toastyToast.PropTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

const CASHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('loading'); 
  const [requestProcessed, setRequestProcessed] = useState(false);

  useEffect(() => {
    const validateTicket = async () => {
      if (requestProcessed) return;
      setRequestProcessed(true);
      const params = new URLSearchParams(location.search);
      const ticket = params.get('ticket');

      if (!ticket) {
        setStatus('error');
        toast.error('No ticket provided');
        return;
      }

      try {
        const response = await axiosInstance.get(`/api/auth/cas?ticket=${ticket}`);
        if (response.data.success) {
          localStorage.setItem('jwtToken', response.data.token);
          setStatus('success');
          toast.success('Successfully logged in');
          if(response.data.isNewUser) {
            toast.error('Default attributes are set, kindly update your profile.');
            toast.error('Temporary password is "CAS". Please change it immediately.');
          }
          setTimeout(() => navigate('/user/profile'), 3000);
        }
      } catch (error) {
        console.error(error);
        if (status === 'loading') {
          setStatus('error');
          toast.error('Error: Retrying...');
        }
      }
    };

    validateTicket();
  }, [location, navigate, requestProcessed, status]);

  return (
    <motion.div 
      className="flex flex-col justify-center items-center text-center w-full space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>CAS Authentication | TradeHub</title>
      </Helmet>

      {status === 'loading' && (
        <>
          <CgSpinnerTwoAlt className="animate-spin text-4xl text-zinc-600" />
          <h2 className="text-2xl font-semibold">Processing CAS Login...</h2>
          <p className="text-zinc-600">Please wait while we authenticate you.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <FaRegCheckCircle className="text-4xl text-green-500" />
          <h2 className="text-2xl font-semibold">Authentication Successful</h2>
          <p className="text-zinc-600">Redirecting you to your profile...</p>
        </>
      )}

      {status === 'error' && (
        <>
          <FaExclamationCircle className="text-4xl text-red-500" />
          <h2 className="text-2xl font-semibold">Authentication Failed</h2>
          <p className="text-zinc-600">
            Please try again or return to{' '}
            <Link to="/auth/login" className="text-blue-600 hover:underline">
              login page
            </Link>
          </p>
        </>
      )}
    </motion.div>
  );
};

export default CASHandler;