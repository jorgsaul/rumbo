import { useState } from 'react';

function IconoLike({ postId, initialLiked, initialCount }) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num;
  };

  const likeClicked = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => prev + (newLiked ? 1 : -1));

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/post_like`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId })
      });

      if (!response.ok) throw new Error('Error en la respuesta de red en likes');
      const data = await response.json();
    } catch (error) {
      console.error('Error al dar like:', error);
      setLiked(liked);
      setLikesCount(prev => prev + (liked ? 1 : -1));
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={liked ? '#91235a' : 'transparent'}
        viewBox="0 0 24 24"
        strokeWidth={liked ? 0 : 1}
        stroke="currentColor"
        className="size-6"
        height={25}
        onClick={likeClicked}
        style={{ cursor: 'pointer' }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
      <span>{formatNumber(likesCount)}</span>
    </div>
  );
}

export default IconoLike;
