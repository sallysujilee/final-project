import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../components/AppContext';
import './ServicesPage.css';
import cameraIcon from '../images/cameraIcon.png';
import graphicDesignIcon from '../images/graphicDesignIcon.png';
import webDevIcon from '../images/webDevIcon.png';

export default function Services() {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (!user) navigate('/sign-in');
  }, [user, navigate]);

  return (
    <div className="services-container">
      <div className="photography-container">
        <img
          className="camera-icon-img"
          src={cameraIcon}
          alt="camera icon img"
        />
        <div className="photography-title">Photography</div>
      </div>
      <div className="gd-container">
        <img
          className="gd-icon-img"
          src={graphicDesignIcon}
          alt="graphic design icon img"
        />
        <div className="gd-title">Graphic Design</div>
      </div>
      <div className="webdev-container">
        <img className="web-dev-img" src={webDevIcon} alt="web dev icon img" />
        <div className="web-dev-title">Web Development</div>
      </div>
    </div>
  );
}
