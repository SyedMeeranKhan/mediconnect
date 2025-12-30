import '../styles/App.css';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

function Home(){
  const API_BASE = useMemo(
    () => import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
    [],
  );

  const [doctors, setDoctors] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus('loading');
      setError('');
      try {
        const res = await fetch(`${API_BASE}/api/doctors/`);
        if (!res.ok) throw new Error(`Failed to load doctors (${res.status})`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data?.results ?? []);
        if (cancelled) return;
        setDoctors(list.slice(0, 4));
        setStatus('success');
      } catch (e) {
        if (cancelled) return;
        setStatus('error');
        setError(e instanceof Error ? e.message : 'Failed to load doctors');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [API_BASE]);

  return(
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-content">
            <h1>Modern healthcare, simplified</h1>
            <p>
              Book appointments, contact support, and manage your visit details in one place.
            </p>
            <div className="home-hero-actions">
              <Link to="/appointment" className="btn-primary">Book Appointment</Link>
              <Link to="/contact" className="btn-secondary">Contact Us</Link>
            </div>
            <div className="home-metrics">
              <div className="metric-card">
                <div className="metric-value">24/7</div>
                <div className="metric-label">Support</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">Fast</div>
                <div className="metric-label">Bookings</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">Secure</div>
                <div className="metric-label">Data</div>
              </div>
            </div>
          </div>
          <aside className="home-hero-panel">
            <div className="home-panel-title">Available doctors</div>
            {status === 'loading' ? (
              <div className="home-panel-skeleton" aria-label="Loading doctors">
                <div className="panel-line" />
                <div className="panel-line" />
                <div className="panel-line" />
              </div>
            ) : null}
            {status === 'error' ? (
              <div className="home-panel-error" role="status">{error}</div>
            ) : null}
            {status === 'success' ? (
              <div className="doctor-list" aria-label="Doctor list">
                {doctors.map((d) => (
                  <div key={d.id} className="doctor-item">
                    <div className="doctor-name">{d.name}</div>
                    <div className="doctor-meta">{d.specialization || 'General'}</div>
                  </div>
                ))}
                <Link to="/appointment" className="btn-secondary home-panel-cta">
                  Book a slot
                </Link>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="home-section">
        <div className="home-grid">
          <div className="feature-card">
            <h3>Smart scheduling</h3>
            <p>Pick a department, choose a time, and send an appointment request in minutes.</p>
          </div>
          <div className="feature-card">
            <h3>Clear communication</h3>
            <p>Use the contact form to reach the team and get quick responses.</p>
          </div>
          <div className="feature-card">
            <h3>Simple experience</h3>
            <p>A clean, image-free design that stays fast and accessible on all devices.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
