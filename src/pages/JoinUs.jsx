import { useState } from 'react';
import { memberAPI } from '../utils/api';
import './JoinUs.css';

const provinceCities = {
  'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'St. Albert', 'Medicine Hat', 'Grande Prairie', 'Airdrie', 'Spruce Grove', 'Leduc', 'Fort McMurray'],
  'British Columbia': ['Vancouver', 'Surrey', 'Burnaby', 'Richmond', 'Abbotsford', 'Coquitlam', 'Kelowna', 'Langley', 'Saanich', 'Delta', 'Nanaimo', 'Victoria', 'Kamloops', 'Chilliwack', 'Prince George', 'Vernon'],
  'Manitoba': ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie'],
  'New Brunswick': ['Moncton', 'Saint John', 'Fredericton', 'Dieppe', 'Miramichi'],
  'Newfoundland and Labrador': ["St. John's", 'Mount Pearl', 'Corner Brook', 'Conception Bay South'],
  'Nova Scotia': ['Halifax', 'Sydney', 'Dartmouth', 'Truro', 'New Glasgow'],
  'Ontario': ['Toronto', 'Hamilton', 'Ottawa', 'Mississauga', 'Brampton', 'London', 'Markham', 'Vaughan', 'Kitchener', 'Windsor', 'Richmond Hill', 'Oakville', 'Burlington', 'Sudbury', 'Oshawa', 'Barrie', 'St. Catharines', 'Cambridge', 'Kingston', 'Guelph', 'Thunder Bay', 'Waterloo', 'Brantford', 'Niagara Falls'],
  'Prince Edward Island': ['Charlottetown', 'Summerside', 'Stratford', 'Cornwall'],
  'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Saguenay', 'Levis', 'Trois-Rivieres', 'Terrebonne'],
  'Saskatchewan': ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current'],
  'Northwest Territories': ['Yellowknife', 'Hay River', 'Inuvik'],
  'Nunavut': ['Iqaluit', 'Rankin Inlet', 'Arviat'],
  'Yukon': ['Whitehorse', 'Dawson City', 'Watson Lake']
};

const provincePostalPrefixes = {
  'Newfoundland and Labrador': ['A'],
  'Nova Scotia': ['B'],
  'Prince Edward Island': ['C'],
  'New Brunswick': ['E'],
  'Quebec': ['G', 'H', 'J'],
  'Ontario': ['K', 'L', 'M', 'N', 'P'],
  'Manitoba': ['R'],
  'Saskatchewan': ['S'],
  'Alberta': ['T'],
  'British Columbia': ['V'],
  'Nunavut': ['X'],
  'Northwest Territories': ['X'],
  'Yukon': ['Y']
};

const positionOptions = [
  'Elder',
  'Pastor',
  'Deacon',
  'AFM Member',
  'Former Praise and Worship Leader',
  'Other (please specify)'
];

const OTHER_CITY = 'Other (type in)';

const emptyForm = {
  firstName: '', lastName: '', email: '', phone: '',
  province: '', city: '', cityOther: '',
  postalCode: '',
  position: '', positionOther: '',
  joinGroup: true
};

const postalRegex = /^[ABCEGHJKLMNPRSTVXY]\d[A-Z]\s?\d[A-Z]\d$/i;

function JoinUs() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [postalWarning, setPostalWarning] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'province') {
      setForm(prev => ({ ...prev, province: value, city: '', cityOther: '' }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const checkPostalCode = (value) => {
    setPostalWarning('');
    if (!value || !form.province) return;

    const cleaned = value.trim().toUpperCase();
    if (!postalRegex.test(cleaned)) return; // format error shown separately by required pattern

    const expectedPrefixes = provincePostalPrefixes[form.province];
    if (expectedPrefixes && !expectedPrefixes.includes(cleaned[0])) {
      setPostalWarning(
        `That postal code doesn't look like a typical ${form.province} postal code — please double check it.`
      );
    }
  };

  const handlePostalBlur = (e) => {
    checkPostalCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });

    if (!postalRegex.test(form.postalCode.trim())) {
      setStatus({ type: 'error', text: 'Please enter a valid Canadian postal code (e.g. L8W 3S2).' });
      return;
    }

    if (form.city === OTHER_CITY && !form.cityOther.trim()) {
      setStatus({ type: 'error', text: 'Please type in your city.' });
      return;
    }

    if (form.position === 'Other (please specify)' && !form.positionOther.trim()) {
      setStatus({ type: 'error', text: 'Please specify the position you held.' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        province: form.province,
        city: form.city === OTHER_CITY ? form.cityOther.trim() : form.city,
        postalCode: form.postalCode.trim().toUpperCase(),
        position: form.position === 'Other (please specify)' ? form.positionOther.trim() : form.position,
        joinGroup: form.joinGroup
      };

      const response = await memberAPI.create(payload);
      setStatus({ type: 'success', text: response.data.message });
      setForm(emptyForm);
      setPostalWarning('');
    } catch (error) {
      setStatus({
        type: 'error',
        text: error.response?.data?.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const cityOptions = form.province ? (provinceCities[form.province] || []) : [];

  return (
    <div className="joinus-page">
      <div className="joinus-header">
        <div className="container">
          <div className="joinus-badge">AFM Database · Across Canada</div>
          <h1>Become Part of the Family</h1>
          <p>
            We're building a database of AFM members across every province. Please tell us
            where you are — this helps us connect with you, and may even help us start a new
            assembly in your area. Our goal is simple: AFM should be in every province in Canada.
          </p>
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

            <div className="form-group">
              <label>Position Formerly Held in AFM *</label>
              <select name="position" value={form.position} onChange={handleChange} required>
                <option value="">Select a position</option>
                {positionOptions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {form.position === 'Other (please specify)' && (
                <input
                  type="text"
                  name="positionOther"
                  value={form.positionOther}
                  onChange={handleChange}
                  placeholder="Please type in the position"
                  className="conditional-field"
                  required
                />
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Province *</label>
                <select name="province" value={form.province} onChange={handleChange} required>
                  <option value="">Select a province</option>
                  {Object.keys(provinceCities).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>City *</label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  disabled={!form.province}
                >
                  <option value="">
                    {form.province ? 'Select a city' : 'Select a province first'}
                  </option>
                  {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  {form.province && <option value={OTHER_CITY}>{OTHER_CITY}</option>}
                </select>
                {form.city === OTHER_CITY && (
                  <input
                    type="text"
                    name="cityOther"
                    value={form.cityOther}
                    onChange={handleChange}
                    placeholder="Please type in your city"
                    className="conditional-field"
                    required
                  />
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Postal Code *</label>
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                onBlur={handlePostalBlur}
                placeholder="e.g. L8W 3S2"
                required
                style={{ maxWidth: '200px' }}
              />
              {postalWarning && <p className="field-warning">{postalWarning}</p>}
            </div>

            <label className="checkbox-label">
              <input type="checkbox" name="joinGroup" checked={form.joinGroup} onChange={handleChange} />
              Please connect me with an assembly in my area, or notify me about starting one nearby
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