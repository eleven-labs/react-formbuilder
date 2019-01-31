import React from "react";
import { pick } from "lodash";
import classNames from "classnames";

import "./styles.scss";

const Text = ({ className, ...props }) => {
    let allowedPropsTextField = pick(
        props,
        [
            "id",
            "type",
            "name",
            "value",
            "onChange",
            "onBlur",
            "onFocus",
            "placeholder"
        ]
    );

    return <input className={classNames('form__text-field', className)} {...allowedPropsTextField} />;
}

export default Text;
