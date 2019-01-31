import React from "react";
import { pick } from "lodash";
import classNames from "classnames";

import "./styles.scss";

const Radio = ({ className, children, ...props }) => {
  let allowedPropsRadioField = pick(props, [
    "name",
    "value",
    "checked",
    "onChange",
    "onBlur",
    "onFocus"
  ]);

  className = classNames(
    "form__radio-field",
    (props.checked || props.value === true) && "form__radio-field--checked",
    className
  );

  return (
    <label className={className}>
      <span className="form__radio-field__radio">
        <input type="radio" {...allowedPropsRadioField} />
      </span>
      <span className="form__radio-field__label">{props.label}</span>
    </label>
  );
};

export default Radio;
