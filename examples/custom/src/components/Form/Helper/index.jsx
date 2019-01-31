import React from "react";
import classNames from "classnames";

import './styles.scss';

const Helper = ({ className, children }) => (
    <p className={classNames('form__helper', className)}>{children}</p>
);

export default Helper;
