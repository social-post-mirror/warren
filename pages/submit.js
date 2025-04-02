// pages/submit.js
import { useState } from 'react';

export default function Submit() {
  const [screenshot, setScreenshot] = useState(null);
  const [reason, setReason] = useState('');
  const [uploading, setUploading] = useState(false);

  const reasons = [
    { value: '', label: 'Select reason' },
  { value: 'historical', label: 'Historical record' },
  { value: 'accountability', label: 'Public accountability' },
  { value: 'culture', label: 'Cultural significance' },
  { value: 'satire', label: 'Satire or commentary' },
  { value: 'journalism', label: 'Example of journalism or reporting' },
  { value: 'misinformation', label: 'Highlights misinformation or bias' },
  { value: 'celebrity', label: 'Public figure behavior' },
  { value: 'activism', label: 'Activism or protest documentation' },
  { value: 'community', label: 'Represents community sentiment' },
  { value: 'deleted', label: 'Deleted or removed content' }
];


  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    // placeholder logic, we'll hook up S3 next
    alert('Upload logic goes here.');
    setUploading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
      <h1>Submit a Screenshot</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Screenshot:
          <input type="file" accept="image/*" onChange={handleFileChange} required />
        </label>
        <br /><br />
        <label>
          Why this matters:
          <select value={reason} onChange={(e) => setReason(e.target.value)} required>
            {reasons.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </label>
        <br /><br />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Submit to the Mirror'}
        </button>
      </form>
    </div>
  );
}
