// Simple image service placeholder - no external dependencies
const uploadImage = async (file) => {
  console.log(`[IMAGE] Would upload: ${file.originalname}`);
  return { url: 'https://via.placeholder.com/150', publicId: 'placeholder' };
};

const deleteImage = async (publicId) => {
  console.log(`[IMAGE] Would delete: ${publicId}`);
  return { success: true };
};

const generateAvatar = async (name) => {
  console.log(`[IMAGE] Would generate avatar for: ${name}`);
  return { url: 'https://via.placeholder.com/150', publicId: 'avatar' };
};

module.exports = {
  uploadImage,
  deleteImage,
  generateAvatar
}; 