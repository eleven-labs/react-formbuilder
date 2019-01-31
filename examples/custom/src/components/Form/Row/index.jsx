import React from "react";
import classNames from "classnames";

import "./styles.scss";

const Row = ({ className, hasErrors, required, children }) => (
    <div className={classNames(
        'form__row',
        required && 'form__row--required',
        hasErrors && 'form__row--error',
        className
    )}>
        {children}
    </div>
);

export default Row;
