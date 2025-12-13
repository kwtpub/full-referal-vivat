import './BonusCards.css';

const BonusCards = () => {
  const cards = [
    {
      icon: '/images/Home.svg',
      title: 'РАБОТАЙ ИЗ ЛЮБОЙ ТОЧКИ МИРА',
      description: 'Работай удаленно из любой точки мира и управляй своими продажами онлайн.',
    },
    {
      icon: '/images/Award.svg',
      title: 'ПОЛУЧАЙ БОНУСЫ С ПРОДАЖ',
      description: 'Получай бонусы за каждую успешную продажу и увеличивай свой доход.',
    },
    {
      icon: '/images/Checkcircle.svg',
      title: 'ПОЛНЫЙ КОНТРОЛЬ СВОИХ КЛИЕНТОВ',
      description: 'Отслеживай статусы сделок, управляй клиентами и контролируй весь процесс продаж.',
    },
  ];

  return (
    <section className="landing-bonus-cards">
      <div className="landing-bonus-cards-container">
        {cards.map((card, index) => (
          <article key={index} className="landing-bonus-card">
            <div className="landing-bonus-card-icon">
              <img src={card.icon} alt="" />
            </div>
            <div className="landing-bonus-card-content">
              <h3 className="landing-bonus-card-title">{card.title}</h3>
              <p className="landing-bonus-card-description">{card.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BonusCards;

