import '../styles/App.css';

function About(){
  return(
    <main className="page about">
      <div className="page-inner">
        <header className="page-header">
          <h1>About MediConnect</h1>
          <p>
            MediConnect is a clean, modern patient experience for booking appointments and reaching care teams.
          </p>
        </header>

        <section className="cards">
          <div className="card">
            <h3>Our focus</h3>
            <p>Fast access, clear information, and a smooth experience from any device.</p>
          </div>
          <div className="card">
            <h3>Care you can trust</h3>
            <p>Privacy-first design with simple workflows that reduce friction for patients.</p>
          </div>
          <div className="card">
            <h3>Built to scale</h3>
            <p>A foundation that can connect to backend services when you’re ready.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default About;
