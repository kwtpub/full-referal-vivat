import './AboutSection.css';

const AboutSection = () => {
  const services = [
    {
      icon: (
        <svg width="59" height="59" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.5 2.45837C15.6167 2.45837 4.41669 13.6584 4.41669 27.5417C4.41669 41.425 15.6167 52.625 29.5 52.625C43.3834 52.625 54.5834 41.425 54.5834 27.5417C54.5834 13.6584 43.3834 2.45837 29.5 2.45837ZM39.5834 32.4584H34.4167V42.2917C34.4167 45.0167 32.225 47.2084 29.5 47.2084C26.775 47.2084 24.5834 45.0167 24.5834 42.2917V32.4584H19.4167C16.6917 32.4584 14.5 30.2667 14.5 27.5417C14.5 24.8167 16.6917 22.625 19.4167 22.625H24.5834V12.7917C24.5834 10.0667 26.775 7.87504 29.5 7.87504C32.225 7.87504 34.4167 10.0667 34.4167 12.7917V22.625H39.5834C42.3084 22.625 44.5 24.8167 44.5 27.5417C44.5 30.2667 42.3084 32.4584 39.5834 32.4584Z" stroke="url(#paint0_linear_money)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="paint0_linear_money" x1="29.5" y1="2.45837" x2="29.5" y2="52.625" gradientUnits="userSpaceOnUse">
              <stop offset="0.158654" stopColor="#C9A987"/>
              <stop offset="1" stopColor="#6C5741"/>
            </linearGradient>
          </defs>
        </svg>
      ),
      title: 'Прозрачная система',
      description: 'Отслеживайте каждого клиента в реальном времени от первого контакта до финальной сделки'
    },
    {
      icon: (
        <svg width="59" height="59" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="29.5" cy="29.5" r="24.5833" stroke="url(#paint0_linear_target1)" strokeWidth="4"/>
          <circle cx="29.5" cy="29.5" r="15.8333" stroke="url(#paint1_linear_target2)" strokeWidth="3.5"/>
          <circle cx="29.5" cy="29.5" r="7.375" stroke="url(#paint2_linear_target3)" strokeWidth="3"/>
          <defs>
            <linearGradient id="paint0_linear_target1" x1="29.5" y1="2.45837" x2="29.5" y2="56.5417" gradientUnits="userSpaceOnUse">
              <stop offset="0.158654" stopColor="#C9A987"/>
              <stop offset="1" stopColor="#6C5741"/>
            </linearGradient>
            <linearGradient id="paint1_linear_target2" x1="29.5" y1="11.2084" x2="29.5" y2="47.7917" gradientUnits="userSpaceOnUse">
              <stop offset="0.158654" stopColor="#C9A987"/>
              <stop offset="1" stopColor="#6C5741"/>
            </linearGradient>
            <linearGradient id="paint2_linear_target3" x1="29.5" y1="19.6667" x2="29.5" y2="39.3334" gradientUnits="userSpaceOnUse">
              <stop offset="0.158654" stopColor="#C9A987"/>
              <stop offset="1" stopColor="#6C5741"/>
            </linearGradient>
          </defs>
        </svg>
      ),
      title: 'Растущие проценты',
      description: 'От 3% до 5% с продажи, плюс бесплатный катер после 10 продаж'
    },
    {
      icon: (
        <svg width="59" height="59" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.5 54.0833C29.5 54.0833 7.375 42.0208 7.375 24.5833V9.83333L29.5 4.91666L51.625 9.83333V24.5833C51.625 42.0208 29.5 54.0833 29.5 54.0833Z" stroke="url(#paint0_linear_shield)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="paint0_linear_shield" x1="29.5" y1="4.91666" x2="29.5" y2="54.0833" gradientUnits="userSpaceOnUse">
              <stop offset="0.158654" stopColor="#C9A987"/>
              <stop offset="1" stopColor="#6C5741"/>
            </linearGradient>
          </defs>
        </svg>
      ),
      title: 'Гарантия выплат',
      description: 'Официальный договор защищает ваши интересы и гарантирует получение комиссии'
    },
    {
      icon: (
        <svg width="59" height="59" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="9.83331" y="4.91666" width="39.3333" height="49.1667" rx="4.91667" stroke="url(#paint0_linear_phone)" strokeWidth="4"/>
          <path d="M19.6666 12.2917H39.3333M29.5 46.7083H29.5246" stroke="url(#paint1_linear_phone2)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="paint0_linear_phone" x1="29.5" y1="4.91666" x2="29.5" y2="54.0833" gradientUnits="userSpaceOnUse">
              <stop offset="0.158654" stopColor="#C9A987"/>
              <stop offset="1" stopColor="#6C5741"/>
            </linearGradient>
            <linearGradient id="paint1_linear_phone2" x1="29.5" y1="12.2917" x2="29.5" y2="46.7083" gradientUnits="userSpaceOnUse">
              <stop offset="0.158654" stopColor="#C9A987"/>
              <stop offset="1" stopColor="#6C5741"/>
            </linearGradient>
          </defs>
        </svg>
      ),
      title: 'Личный кабинет',
      description: 'Удобная CRM-система для управления вашей базой клиентов и отслеживания сделок'
    },
    {
      icon: (
        <svg width="59" height="59" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.91669 22.125L12.2917 19.6667V41.7917L4.91669 44.25V22.125Z" stroke="url(#paint0_linear_boat1)" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M12.2917 19.6667L29.5 7.375L46.7084 19.6667L41.7917 41.7917L29.5 46.7083L17.2084 41.7917L12.2917 19.6667Z" stroke="url(#paint1_linear_boat2)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M46.7084 19.6667V41.7917L54.0834 44.25V22.125L46.7084 19.6667Z" stroke="url(#paint2_linear_boat3)" strokeWidth="3" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="paint0_linear_boat1" x1="29.5" y1="7.375" x2="29.5" y2="46.7083" gradientUnits="userSpaceOnUse">
              <stop offset="0.158654" stopColor="#C9A987"/>
              <stop offset="1" stopColor="#6C5741"/>
            </linearGradient>
            <linearGradient id="paint1_linear_boat2" x1="29.5" y1="7.375" x2="29.5" y2="46.7083" gradientUnits="userSpaceOnUse">
              <stop offset="0.158654" stopColor="#C9A987"/>
              <stop offset="1" stopColor="#6C5741"/>
            </linearGradient>
            <linearGradient id="paint2_linear_boat3" x1="29.5" y1="19.6667" x2="29.5" y2="44.25" gradientUnits="userSpaceOnUse">
              <stop offset="0.158654" stopColor="#C9A987"/>
              <stop offset="1" stopColor="#6C5741"/>
            </linearGradient>
          </defs>
        </svg>
      ),
      title: 'Широкий выбор',
      description: 'Предлагайте клиентам катера от нескольких производителей на выгодных условиях'
    },
    {
      icon: (
        <svg width="59" height="59" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M51.625 49.1667H7.375M12.2917 49.1667V22.125M22.125 49.1667V12.2917M31.9583 49.1667V29.5M41.7917 49.1667V19.6667" stroke="url(#paint0_linear_chart)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <defs>
            <linearGradient id="paint0_linear_chart" x1="29.5" y1="12.2917" x2="29.5" y2="49.1667" gradientUnits="userSpaceOnUse">
              <stop offset="0.158654" stopColor="#C9A987"/>
              <stop offset="1" stopColor="#6C5741"/>
            </linearGradient>
          </defs>
        </svg>
      ),
      title: 'Статистика продаж',
      description: 'Следите за своим прогрессом, количеством продаж и заработанными комиссиями'
    }
  ];

  return (
    <section className="landing-about" id="about">
      <div className="landing-about-container">
        <h2 className="landing-about-title">Что мы предлагаем</h2>
        
        <div className="landing-about-grid">
          {services.map((service, index) => (
            <article key={index} className="landing-about-card">
              <div className="landing-about-card-icon">{service.icon}</div>
              <h3 className="landing-about-card-title">{service.title}</h3>
              <p className="landing-about-card-description">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

