import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LOCAL_STORAGE_KEYS } from '../constants/api';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [navigate, searchParams]);

  return null; // This component doesn't render anything
};

export default OAuthSuccess; 