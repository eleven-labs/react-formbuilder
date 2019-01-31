import React from "react";
import { pick } from 'lodash';
import classNames from "classnames";

import "./styles.scss";

const Button = ({ label, ...props }) => {
    let allowedPropsButton = pick(
        props,
        ["type", "className", "onClick"],
    );

    return <button className={classNames('button')} {...allowedPropsButton}>{label}</button>;
}

export default Button;
