import './inputInvisible.css';
import { useState, useRef, useEffect } from 'react';

function InputInvisible({ holder, type, disabled, required, id, name, value, error, errorMessage, maxLength, className, onChange}) {
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);

  const handleFocus = () => setIsTyping(true);
  const handleBlur = () => setIsTyping(false);
const adjustHeight = () => {
  const textarea = textareaRef.current;
  if (textarea) {
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = scrollHeight > 0 ? scrollHeight + 'px' : '1.2rem';
  }
};

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const inputStateClass = isTyping
    ? 'typing'
    : value && value.trim() !== ''
    ? 'filled'
    : 'unfilled';

  const errorClass = error ? 'error' : '';

  return (
    <>
      <textarea
        ref={textareaRef}
        name={name}
        id={id}
        autoComplete="off"
        required={required}
        disabled={disabled}
        type={type}
        value={value}
        onChange={(e) => {
          adjustHeight();
          onChange(e);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`invisible-input ${inputStateClass} ${errorClass} ${className}`}
        placeholder={holder}
        maxLength={maxLength}
        style={{
          resize: 'none',
          overflow: 'hidden',
        }}
      />
      {errorMessage && (
        <p
          className="mensaje-error"
          style={{
            color: '#F64C4C',
            minHeight: '1.2rem',
            margin: 0,
            visibility: error ? 'visible' : 'hidden',
          }}
        >
          {errorMessage}
        </p>
      )}
    </>
  );
}

export default InputInvisible;