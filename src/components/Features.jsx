import useReveal from '../hooks/useReveal';

const features = [
  { icon: 'fa-truck-fast', title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: 'fa-rotate-left', title: '14-Day Returns', desc: 'Hassle-free return guarantee' },
  { icon: 'fa-shield-halved', title: 'Secure Payment', desc: '256-bit SSL encryption' },
  { icon: 'fa-headset', title: '24/7 Support', desc: "We're always here for you" },
];

export default function Features() {
  const ref = useReveal();

  return (
    <section className="features">
      <div className="container">
        <div className="features-grid reveal" ref={ref}>
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon"><i className={`fas ${f.icon}`} /></div>
              <strong>{f.title}</strong>
              <span>{f.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
