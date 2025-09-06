// Avatar formatting helper function
export const formatAvatar = (avatar) => {
  if (!avatar) return null;
  
  // If avatar is already a data URL or external URL, return as is
  if (avatar.startsWith('data:') || avatar.startsWith('http')) {
    return avatar;
  }
  
  // If avatar is a base64 string without data URL prefix, add it
  if (avatar.startsWith('iVBORw0KGgo')) {
    return `data:image/png;base64,${avatar}`;
  }
  
  return avatar;
};