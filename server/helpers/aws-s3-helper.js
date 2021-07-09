import { S3Client } from '@aws-sdk/client-s3';

export const configClient = () => {
  const client = new S3Client({
    region: 'us-east-2',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY
    }
  });
  return client;
};

export const getUploadedStream = stream => new Promise((resolve, reject) => {
  const data = [];
  stream.on('data', (chunk) => {
    data.push(chunk);
  });
  stream.on('end', () => resolve(Buffer.concat(data)));
  stream.on('error', error => reject(error));
});
