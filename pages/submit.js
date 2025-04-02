import { useState } from 'react';

export default function Submit() {
  const [screenshot, setScreenshot] = useState(null);
  const [reason, setReason] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setScreenshot(file);
  };

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

      // Step 3: Save reflection (optional)
      const submitRes = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, reason })
      });

      if (submitRes.ok) {
        setSubmitted(true);
      } else {
        alert('Upload failed. Try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return <p>Thanks for your submission!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Screenshot:
        <input type="file" accept="image/*" onChange={handleFileChange} required />
      </label>
      <br /><br />
      <label>
        Why this matters:
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} required />
      </label>
      <br /><br />
      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  );
}
