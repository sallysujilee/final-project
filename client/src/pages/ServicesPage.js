import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../components/AppContext';
import './ServicesPage.css';
import cameraIcon from '../images/cameraIcon.png';
import graphicDesignIcon from '../images/graphicDesignIcon.png';
import webDevIcon from '../images/webDevIcon.png';
import circle from '../images/circle.png';
import { Link } from 'react-router-dom';

export default function Services() {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (!user) navigate('/sign-in');
  }, [user, navigate]);

  return (
    <div className="services-container">
      <div className="photography-container">
        <div className="icon-container">
          <img className="circle c1" src={circle} alt="circle background" />
          <img
            className="camera-icon-img"
            src={cameraIcon}
            alt="camera icon img"
          />
        </div>
        <div className="photography-title">Photography</div>
      </div>
      <div className="gd-container">
        <div className="icon-container">
          <img className="circle c2" src={circle} alt="circle background" />
          <img
            className="gd-icon-img"
            src={graphicDesignIcon}
            alt="graphic design icon img"
          />
        </div>
        <div className="gd-title">Graphic Design</div>
      </div>
      <div className="webdev-container">
        <div className="icon-container">
          <img className="circle c3" src={circle} alt="circle background" />
          <img
            className="web-dev-img"
            src={webDevIcon}
            alt="web dev icon img"
          />
        </div>
        <div className="web-dev-title">Web Development</div>
      </div>
      <div>
        <Link to="/servicesform">
          <button className="get-started-button">Get Started</button>
        </Link>
      </div>
    </div>
  );
}
