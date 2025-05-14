import { error, json } from '@sveltejs/kit';
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
  const { publicId } = await request.json();
  console.log('publicId', publicId);
  if (!publicId) {
    return json({ error: 'No public id' }, { status: 400 });
  }
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (!result.ok) {
      console.log('delete from api is not working');
      return json(
        { error: `failed to delete image ${result.error.message}` },
        { status: 500 }
      );
    }
    console.log('delete from api is working');
    return json({ success: true });
  } catch (err) {
    console.error('Error deleting image', err);
    return json({ success: false }, { status: 500 });
  }
}
