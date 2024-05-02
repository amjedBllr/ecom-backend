require('dotenv').config();

const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

function generateRandomName() {
    return Math.random().toString(36).substring(2, 15);
}

async function uploadImage(Bucket, File) {
    try {
        const randomFileName = generateRandomName();
        const [uploadedFile] = await storage.bucket(Bucket).upload(File, {
            destination: randomFileName
        });

        console.log('Image uploaded to Google Cloud Storage.');

        // Construct the public URL of the uploaded file
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${uploadedFile.name}`;

        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

