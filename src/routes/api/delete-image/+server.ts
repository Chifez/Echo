import { error, json } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST({ request }) {
  const { publicId } = await request.json();
  if (!publicId) {
    return json({ error: 'No public id' }, { status: 400 });
  }
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (!result.ok) {
      return json({ error: 'failed to upload' }, { status: 500 });
    }
    return json({ success: true });
  } catch (err) {
    console.error('Error deleting image', err);
    return json({ success: false }, { status: 500 });
  }
}
