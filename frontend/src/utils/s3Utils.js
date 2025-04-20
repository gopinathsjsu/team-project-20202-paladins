import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import awsConfig from '../config/aws';

const s3Client = new S3Client({
  region: awsConfig.region,
  credentials: {
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
  },
});

export const uploadImageToS3 = async (file, folder = 'restaurants') => {
  try {
    const fileName = `${folder}/${Date.now()}-${file.name}`;
    const command = new PutObjectCommand({
      Bucket: awsConfig.bucketName,
      Key: fileName,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read',
    });

    await s3Client.send(command);
    return `https://${awsConfig.bucketName}.s3.${awsConfig.region}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};

export const getS3ImageUrl = (fileName) => {
  return `https://${awsConfig.bucketName}.s3.${awsConfig.region}.amazonaws.com/${fileName}`;
}; 