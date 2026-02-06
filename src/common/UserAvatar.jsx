// components/common/UserAvatar.jsx
import React from 'react';

const UserAvatar = ({
  user,
  size = 'medium',
  showName = false,
  className = ''
}) => {
  const [imgError, setImgError] = React.useState(false);

  const sizes = {
    small: 'h-6 w-6 text-xs',
    medium: 'h-8 w-8 text-sm',
    large: 'h-12 w-12 text-base'
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith('data:') || avatar.startsWith('http')) return avatar;
    return `http://localhost:4500/${avatar}`;
  };

  const imageUrl = user?.avatar ? getAvatarUrl(user.avatar) : null;
  const initial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className={`flex items-center ${className}`}>
      {imageUrl && !imgError ? (
        <img
          className={`rounded-full ${sizes[size]} object-cover`}
          src={imageUrl}
          alt={user?.name || 'User'}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`rounded-full bg-[#01a370] flex items-center justify-center text-white font-medium ${sizes[size]}`}>
          {initial}
        </div>
      )}
      {showName && <span className="ml-2 text-gray-900 font-medium">{user?.name || 'Unknown'}</span>}
    </div>
  );
};

export default UserAvatar;