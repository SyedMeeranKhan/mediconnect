import { Link } from 'react-router-dom';
import '../styles/App.css';

function Footer() {
  return(
    <footer className="Footer">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="footer-brand">MediConnect</div>
          <p className="footer-text">
            A clean, fast experience for appointments and patient communication.
          </p>
        </div>

        <div className="footer-col">
          <div className="footer-title">Quick links</div>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/appointment">Appointment</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-title">Contact</div>
          <div className="footer-text">
            Email: support@mediconnect.local
            <br />
            Phone: +00 000 0000
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-title">Hours</div>
          <div className="footer-text">
            Mon–Fri: 9:00–18:00
            <br />
            Sat: 10:00–14:00
            <br />
            Sun: Closed
          </div>
        </div>
      </div>
    </footer>
    
  );
}

export default Footer;
