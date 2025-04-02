// pages/api/upload-url.js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { filename, type } = req.body;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `uploads/${Date.now()}-${filename}`,
    ContentType: type
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 });
  res.status(200).json({ url });
}
