import './inputBasic.css'
import { useState } from 'react';

function InputBasic({holder, type, disabled, required, id, name, value, onChange, error, errorMessage}){
  const [isTyping, setIsTyping] = useState(false);

  const handleFocus = () => {
    setIsTyping(true);
  };

  const handleBlur = () => {
    setIsTyping(false)
  };

  const inputStateClass = isTyping
    ? 'typing'
    : value && value.trim() !== ''
    ? 'filled'
    : 'unfilled';

  const errorClass = error ? 'error' : '';

  return (
    <>
      <input
        name={name}
        id={id}
        autoComplete='off'
        required={required}
        disabled={disabled}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`mi-input ${inputStateClass} ${errorClass}`}
        placeholder={holder}
        maxLength={30}
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

export default InputBasic;
