import { useState } from "react";

function IconBookmark({postId, alreadySaved}){
  const [saved, setSave] = useState(alreadySaved);
  
  const guardarPublicacion = async ()=>{
    setSave(!saved)
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/post_save`, {
        method:'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId })
      });

      if(!response) throw new Error('Error en la respuesta de red en saves');
      await response.json();
    } catch (error) {
      console.error('Error al guardar: ', error);
      setSave(saved);
    }
  }
  return(
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill= {saved ? '#FFAD0D':'transparent'} 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} stroke="currentColor" 
    className="size-6"
    height={20}
    onClick={guardarPublicacion}
    style={{
      cursor: "pointer"
    }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
  );
}

export default IconBookmark;