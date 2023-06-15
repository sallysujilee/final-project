/* eslint-disable no-unused-vars -- Remove me */
/* eslint-disable no-undef -- Remove me */
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../components/AppContext';
import './HomePage.css';
import homepageimg from '../images/homepageimg.jpg';

export default function Home() {
  const navigate = useNavigate();
  const user = useContext(AppContext);

  useEffect(() => {
    if (!user) navigate('/sign-in');
  }, [user, navigate]);

  return (
    <div className="gif-container">
      <img className="homepageimg" src={homepageimg} alt="homepageimg" />
      <div className="text-container">
        <div className="homepage-welcome-title">Welcome to Senior Project!</div>
        <div className="homepage-welcome-text">
          Where all your project needs can be found. From photography, to
          graphic design, and web development, these services are guaranteed
          quality for your vision.
        </div>
      </div>
    </div>
  );
}
