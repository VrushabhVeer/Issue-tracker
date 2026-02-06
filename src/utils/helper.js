// Avatar formatting helper function
export const formatAvatar = (avatar) => {
  if (!avatar) return null;
  
  // If avatar is already a data URL or external URL, return as is
  if (avatar.startsWith('data:') || avatar.startsWith('http')) {
    return avatar;
  }

  // If avatar is a path from our uploads folder
  if (avatar.startsWith('uploads/')) {
    return `http://localhost:4500/${avatar}`;
  }
  
  // If avatar is a base64 string without data URL prefix, add it
  // This helps for older records that might be stored as simple base64 strings
  if (avatar.length > 50) {
    return `data:image/png;base64,${avatar}`;
  }
  
  return avatar;
};