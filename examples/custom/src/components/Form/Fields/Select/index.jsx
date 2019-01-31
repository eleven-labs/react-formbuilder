import React from "react";
import { pick } from "lodash";
import classNames from "classnames";
//import ReactSelect from 'react-select';

import "./styles.scss";

const Select = ({ className, isClearable, formik, ...props }) => {
  let allowedPropsSelectField = pick(props, [
    "id",
    "name",
    "placeholder",
    "options",
    "onBlur",
    "onFocus"
  ]);

  return (
    <ReactSelect
      className={classNames("form__select-field", className)}
      isClearable={isClearable ? isClearable : true}
      value={
        props.options
          ? props.options.find(option => option.value === props.value)
          : ""
      }
      onChange={option =>
        formik.setFieldValue(props.name, option ? option.value : "")
      }
      {...allowedPropsSelectField}
    />
  );
};

export default Select;
