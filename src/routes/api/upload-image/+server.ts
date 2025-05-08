import { json } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from '$env/static/private';
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export async function POST({ request }) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;

    if (!file) {
      return json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          chunk_size: 6000000, // 6MB chunks
          timeout: 60000, // 60 second timeout
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.on('error', (error) => {
        console.error('Stream error:', error);
        reject(error);
      });

      uploadStream.end(buffer);
    });

    if (!result || !result.secure_url) {
      throw new Error('Upload failed - no URL returned');
    }

    return json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err: any) {
    console.error('Error uploading image:', err);
    return json(
      {
        success: false,
        error: err.message || 'Failed to upload image',
        details: err.toString(),
      },
      { status: 500 }
    );
  }
}
