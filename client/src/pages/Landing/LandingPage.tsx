import { useNavigate } from 'react-router-dom';
import Header from '../../components/Landing/Header/Header';
import Hero from '../../components/Landing/Hero/Hero';
import AboutSection from '../../components/Landing/AboutSection/AboutSection';
import Footer from '../../components/Landing/Footer/Footer';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/registration');
  };

  const handleStartClick = () => {
    navigate('/registration');
  };

  return (
    <div className="landing-page">
      <Header onRegisterClick={handleRegisterClick} />
      <Hero onStartClick={handleStartClick} />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default LandingPage;

