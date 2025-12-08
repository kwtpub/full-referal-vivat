import { Button } from '../../ui';
import './Hero.css';

interface HeroProps {
  onStartClick: () => void;
}

const Hero = ({ onStartClick }: HeroProps) => {
  return (
    <section className="landing-hero">
      <div className="landing-hero-container">
        <div className="landing-hero-content">
          <h1 className="landing-hero-title">
            <span className="landing-hero-title-line">СОЗДАВАЙ БУДУЩЕЕ</span>
            <span className="landing-hero-title-line">ПРИВОДИ КЛИЕНТОВ</span>
            <span className="landing-hero-title-line">ПОЛУЧАЙ ПРЕМИЮ</span>
          </h1>
          
          <Button
            variant="primary"
            size="large"
            onClick={onStartClick}
            className="landing-hero-button"
          >
            Начать
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

