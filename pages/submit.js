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


 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!screenshot || !reason) {
    alert('Please select a screenshot and reason before submitting.');
    return;
  }

  setUploading(true);

  try {
    const file = screenshot;
    const filename = file.name;
    const type = file.type;

    // Step 1: Get a signed upload URL from your backend
    const res = await fetch('/api/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, type })
    });

    const { url } = await res.json();

    // Step 2: Upload the file directly to S3
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': type },
      body: file
    });

    alert('Screenshot submitted successfully!');

    // Reset form
    setScreenshot(null);
    setReason('');
  } catch (err) {
    console.error('Upload failed:', err);
    alert('Upload failed. Please try again.');
  } finally {
    setUploading(false);
  }
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
