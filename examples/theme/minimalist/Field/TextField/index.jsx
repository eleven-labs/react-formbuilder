import React from 'react';

import './styles.scss';

const TextField = ({
  id,
  type = 'text',
  value = '',
  onChange,
  onFocus,
  onBlur
}) => {
  return (
    <input
      id={id}
      className="minimalist-field__text-type"
      type={type}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default TextField;
