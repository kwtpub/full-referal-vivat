import './Footer.css';

const Footer = () => {
  return (
    <footer className="landing-footer" id="contacts">
      <div className="landing-footer-container">
        <div className="landing-footer-top">
          <div className="landing-footer-brand">
            <img src="/images/logo-01.png" alt="Vivat Logo" className="landing-footer-logo" />
            <p className="landing-footer-tagline">
              We turn ideas into clean, functional digital products.
            </p>
            <p className="landing-footer-country">Россия</p>
          </div>

          <div className="landing-footer-company">
            <h4 className="landing-footer-heading">Компания</h4>
            <nav className="landing-footer-nav">
              <a href="#about" className="landing-footer-link">О компании</a>
              <a href="#news" className="landing-footer-link">Новости</a>
              <a href="#contacts" className="landing-footer-link">Контакты</a>
            </nav>
          </div>

          <div className="landing-footer-contacts">
            <h4 className="landing-footer-heading">Контакты</h4>
            <div className="landing-footer-contact-item">
              <span className="landing-footer-contact-label">Телефон</span>
              <a href="tel:+78461234567" className="landing-footer-contact-value">+7 (846) 123-45-67</a>
            </div>
            <div className="landing-footer-contact-item">
              <span className="landing-footer-contact-label">Email</span>
              <a href="mailto:info@vivat-boat.ru" className="landing-footer-contact-value">info@vivat-boat.ru</a>
            </div>
            <div className="landing-footer-contact-item">
              <span className="landing-footer-contact-label">Адрес</span>
              <span className="landing-footer-contact-value">г. Самара</span>
            </div>
          </div>
        </div>

        <div className="landing-footer-divider" />

        <div className="landing-footer-bottom">
          <p className="landing-footer-copyright">© 2025 VOID LAB. Все права защищены.</p>
          <a href="#privacy" className="landing-footer-privacy">Политика конфиденциальности</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

