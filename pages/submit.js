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

      // Step 1: Get signed URL
      const res = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, type }),
      });

      const { url } = await res.json();

      // Step 2: Upload file directly to S3
      await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': type },
        body: file,
      });

      // Step 3: (Optional) Log or submit metadata to your backend
      console.log('Upload complete');

      setSubmitted(true);
      setScreenshot(null);
      setReason('');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Submit a Screenshot</h1>

      {submitted ? (
        <p>✅ Thank you! Your screenshot has been submitted.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Screenshot:
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </label>
          <br /><br />

          <label>
            Why this matters:
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </label>
          <br /><br />

          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  );
}
