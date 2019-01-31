import React from "react";
import { pick } from "lodash";
import classNames from "classnames";

import './styles.scss';

const Label = ({ className, children, ...props }) => {
    let allowedPropsLabel = pick(
        props,
        ["htmlFor"]
    );

    return (
        <label className={classNames('form__label', className)} {...allowedPropsLabel}>{children}</label>
    );
}

export default Label;
