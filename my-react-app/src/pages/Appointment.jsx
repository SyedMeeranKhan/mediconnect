import { useEffect, useMemo, useState } from 'react';
import '../styles/App.css';

function Appointment() {
  const API_BASE = useMemo(
    () => import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
    [],
  );

  const [doctors, setDoctors] = useState([]);
  const [doctorsStatus, setDoctorsStatus] = useState('idle');
  const [doctorsError, setDoctorsError] = useState('');

  const [slots, setSlots] = useState([]);
  const [slotsStatus, setSlotsStatus] = useState('idle');
  const [slotsError, setSlotsError] = useState('');

  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [department, setDepartment] = useState('general');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');

  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadDoctors() {
      setDoctorsStatus('loading');
      setDoctorsError('');
      try {
        const res = await fetch(`${API_BASE}/api/doctors/`);
        if (!res.ok) throw new Error(`Failed to load doctors (${res.status})`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data?.results ?? []);
        if (cancelled) return;
        setDoctors(list);
        setSelectedDoctorId((prev) => prev || (list[0]?.id ? String(list[0].id) : ''));
        setDoctorsStatus('success');
      } catch (e) {
        if (cancelled) return;
        setDoctorsStatus('error');
        setDoctorsError(e instanceof Error ? e.message : 'Failed to load doctors');
      }
    }

    loadDoctors();
    return () => {
      cancelled = true;
    };
  }, [API_BASE]);

  useEffect(() => {
    let cancelled = false;

    async function loadSlots() {
      if (!selectedDoctorId || !preferredDate) {
        setSlots([]);
        setPreferredTime('');
        return;
      }

      setSlotsStatus('loading');
      setSlotsError('');
      try {
        const res = await fetch(
          `${API_BASE}/api/doctors/${selectedDoctorId}/available-slots/?date=${preferredDate}`,
        );
        if (!res.ok) throw new Error(`Failed to load slots (${res.status})`);
        const data = await res.json();
        const list = Array.isArray(data?.slots) ? data.slots : [];
        if (cancelled) return;
        setSlots(list);
        setPreferredTime((prev) => (prev && list.includes(prev) ? prev : (list[0] ?? '')));
        setSlotsStatus('success');
      } catch (e) {
        if (cancelled) return;
        setSlotsStatus('error');
        setSlotsError(e instanceof Error ? e.message : 'Failed to load slots');
        setSlots([]);
        setPreferredTime('');
      }
    }

    loadSlots();
    return () => {
      cancelled = true;
    };
  }, [API_BASE, preferredDate, selectedDoctorId]);

  return (
    <main className="page appointment">
      <div className="page-inner">
        <header className="page-header">
          <h1>Book an Appointment</h1>
          <p>Select a doctor, pick a time, and send your request.</p>
        </header>

        <div className="form-card">
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              setSubmitStatus('loading');
              setSubmitError('');

              try {
                if (!selectedDoctorId) throw new Error('Please select a doctor.');
                if (!preferredDate) throw new Error('Please select a date.');
                if (!preferredTime) throw new Error('Please select a time.');

                const scheduledAt = new Date(`${preferredDate}T${preferredTime}:00`).toISOString();

                const payload = {
                  doctor: Number(selectedDoctorId),
                  title: `Appointment - ${department}`,
                  patient_name: patientName,
                  patient_email: patientEmail,
                  patient_phone: patientPhone,
                  reason: department,
                  description: notes,
                  scheduled_at: scheduledAt,
                };

                const res = await fetch(`${API_BASE}/api/appointments/`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });

                const data = await res.json().catch(() => null);
                if (!res.ok) {
                  const message =
                    typeof data === 'object' && data
                      ? JSON.stringify(data)
                      : `Request failed (${res.status})`;
                  throw new Error(message);
                }

                setSubmitStatus('success');
              } catch (err) {
                setSubmitStatus('error');
                setSubmitError(err instanceof Error ? err.message : 'Failed to book appointment');
              }
            }}
          >
            <div className="field">
              <label htmlFor="doctor">Doctor</label>
              <select
                id="doctor"
                name="doctor"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                disabled={doctorsStatus === 'loading'}
                required
              >
                {doctors.map((d) => (
                  <option key={d.id} value={String(d.id)}>
                    {d.name}{d.specialization ? ` — ${d.specialization}` : ''}
                  </option>
                ))}
              </select>
              {doctorsStatus === 'loading' ? (
                <div className="form-hint" role="status">Loading doctors…</div>
              ) : null}
              {doctorsStatus === 'error' ? (
                <div className="form-hint" role="status">{doctorsError}</div>
              ) : null}
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="patientName">Full name</label>
                <input
                  id="patientName"
                  name="patientName"
                  type="text"
                  autoComplete="name"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="patientEmail">Email</label>
                <input
                  id="patientEmail"
                  name="patientEmail"
                  type="email"
                  autoComplete="email"
                  required
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="patientPhone">Phone</label>
                <input
                  id="patientPhone"
                  name="patientPhone"
                  type="tel"
                  autoComplete="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="general">General</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="pediatrics">Pediatrics</option>
                </select>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="preferredDate">Date</label>
                <input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="preferredTime">Time</label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  disabled={!preferredDate || !selectedDoctorId || slotsStatus === 'loading'}
                  required
                >
                  {slots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {slotsStatus === 'loading' ? (
                  <div className="form-hint" role="status">Loading available times…</div>
                ) : null}
                {slotsStatus === 'error' ? (
                  <div className="form-hint" role="status">{slotsError}</div>
                ) : null}
                {slotsStatus === 'success' && preferredDate && selectedDoctorId && slots.length === 0 ? (
                  <div className="form-hint" role="status">No available slots for this date.</div>
                ) : null}
              </div>
            </div>

            <div className="field">
              <label htmlFor="notes">Notes (optional)</label>
              <textarea
                id="notes"
                name="notes"
                rows="5"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary">
              {submitStatus === 'success' ? 'Request sent' : (submitStatus === 'loading' ? 'Sending…' : 'Send request')}
            </button>
            {submitStatus === 'success' ? (
              <div className="form-hint" role="status">Appointment request submitted successfully.</div>
            ) : null}
            {submitStatus === 'error' ? (
              <div className="form-hint" role="status">{submitError}</div>
            ) : null}
          </form>
        </div>
      </div>
    </main>
  );
}

export default Appointment;
