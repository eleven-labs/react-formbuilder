import React from "react";
import { pick } from "lodash";
import classNames from "classnames";

import "./styles.scss";

const Checkbox = ({ className, children, ...props }) => {
  let allowedPropsCheckboxField = pick(props, [
    "name",
    "value",
    "checked",
    "onChange",
    "onBlur",
    "onFocus"
  ]);

  className = classNames(
    "form__checkbox-field",
    (props.checked || props.value === true) && "form__checkbox-field--checked",
    className
  );

  return (
    <label className={className}>
      <span className="form__checkbox-field__checkbox">
        <input type="checkbox" {...allowedPropsCheckboxField} />
      </span>
      <span className="form__checkbox-field__label">{props.label}</span>
    </label>
  );
};

export default Checkbox;
