import React from 'react';

function Toast({ message }) {
  return (
    <div className={`toast ${message ? 'show' : ''}`}>
      {message}
    </div>
  );
}

export default Toast;
