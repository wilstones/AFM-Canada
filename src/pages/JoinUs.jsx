import { useState } from 'react';
import { memberAPI } from '../utils/api';
import './JoinUs.css';

const provinces = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
  'Prince Edward Island', 'Quebec', 'Saskatchewan',
  'Northwest Territories', 'Nunavut', 'Yukon'
];

const emptyForm = {
  firstName: '', lastName: '', email: '', phone: '',
  province: '', city: '', postalCode: '', joinGroup: true
};

function JoinUs() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    setLoading(true);
    try {
      const response = await memberAPI.create(form);
      setStatus({ type: 'success', text: response.data.message });
      setForm(emptyForm);
    } catch (error) {
      setStatus({
        type: 'error',
        text: error.response?.data?.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="joinus-page">
      <div className="joinus-header">
        <div className="container">
          <h1>Become Part of Our Family</h1>
          <p>Tell us a little about yourself and we'll connect you with a church group in your area.</p>
        </div>
      </div>

      <div className="container joinus-container">
        <div className="joinus-form-card">
          {status.text && (
            <div className={status.type === 'error' ? 'error-message' : 'success-message'}>
              {status.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="joinus-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Surname *</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. (613) 555-0123" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Province *</label>
                <select name="province" value={form.province} onChange={handleChange} required>
                  <option value="">Select a province</option>
                  {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>City *</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Postal Code *</label>
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="e.g. L8W 3S2"
                required
                style={{ maxWidth: '200px' }}
              />
            </div>

            <label className="checkbox-label">
              <input type="checkbox" name="joinGroup" checked={form.joinGroup} onChange={handleChange} />
              Please add me to the official church group in my area
            </label>

            <button type="submit" className="btn-primary joinus-submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JoinUs;