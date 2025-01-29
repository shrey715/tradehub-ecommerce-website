import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import axios from 'axios';
import { backendUrl } from '../main';
import PropTypes from 'prop-types';

import Loading from '../components/pages/common/Loading';

const Protected = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        navigate('/auth/login');
        return;
      }

      try {
        const response = await axios.get(
          `${backendUrl}/api/auth/verifyjwt`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (response.data.success) {
          setAuthenticated(true);
        } else {
          navigate('/auth/login');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        navigate('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [navigate]);

  if (loading) {
    return <Loading />;
  }

  if (!authenticated) {
    return null;
  }

  return children;
}

Protected.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Protected;