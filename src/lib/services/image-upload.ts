export async function uploadImage(
  file: File
): Promise<{ url: string; public_id: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`/api/upload-image`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  console.log('upload from service is', data);
  return {
    url: data.url,
    public_id: data.publicId,
  };
}

export async function deleteImage(publicId: string): Promise<{ data: string }> {
  const response = await fetch('/api/delete-image', {
    method: 'POST',
    body: JSON.stringify({ publicId: publicId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  console.log('delete from service is', data);
  return { data: data };
}
