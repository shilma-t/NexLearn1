import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveSession } from '../utils/SessionManager';

const OAuth2Redirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get("email");
    const name = params.get("name");
    const picture = params.get("picture");

    if (email && name) {
      saveSession({ email, name, picture });
      navigate("/home");
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  return <p>Logging you in...</p>;
};

export default OAuth2Redirect;
