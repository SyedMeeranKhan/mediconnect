import { useState } from 'react';
import '../styles/App.css';

function Contact() {
  const [status, setStatus] = useState("idle");

  return(
    <main className="page contact">
      <div className="page-inner">
        <header className="page-header">
          <h1>Contact</h1>
          <p>Send a message and we’ll get back to you.</p>
        </header>

        <div className="form-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStatus("sent");
            }}
          >
            <div className="field-row">
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input type="text" name="name" id="name" autoComplete="name" required />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" autoComplete="email" required />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="cell">Phone</label>
                <input type="tel" name="cell" id="cell" autoComplete="tel" />
              </div>
              <div className="field">
                <label htmlFor="topic">Topic</label>
                <input type="text" name="topic" id="topic" placeholder="Appointments, billing, support..." />
              </div>
            </div>

            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea name="message" id="message" rows="7" required />
            </div>

            <button type="submit" className="btn-primary">
              {status === "sent" ? "Sent" : "Send message"}
            </button>
            {status === "sent" ? (
              <div className="form-hint" role="status">
                Thanks. Your message was recorded in the UI (backend hookup comes next).
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </main>
  );
}

export default Contact;
