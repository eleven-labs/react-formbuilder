import React from 'react';

import './styles.scss';

const Label = ({ children, ...props }) => (
    <label className="minimalist-field__label" {...props}>
        {children}
    </label>
);

export default Label;
