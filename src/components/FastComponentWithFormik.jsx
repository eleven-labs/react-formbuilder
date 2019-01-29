import React from "react";
import { connect as formikConnect } from "formik";
import warning from "warning";
import {
  getIn,
  isEmptyChildren,
  isFunction,
  isSameArrays
} from "../utils";

class FastComponentWithFormik extends React.Component {
  constructor(props) {
    super(props);
    const { render, children, component } = props;
    warning(
      !(component && render),
      "You should not use <FastComponentWithFormik component> and <FastComponentWithFormik render> in the same <FastComponentWithFormik> component; <FastComponentWithFormik component> will be ignored"
    );

    warning(
      !(component && children && isFunction(children)),
      "You should not use <FastComponentWithFormik component> and <FastComponentWithFormik children> as a function in the same <FastComponentWithFormik> component; <FastComponentWithFormik component> will be ignored."
    );

    warning(
      !(render && children && !isEmptyChildren(children)),
      "You should not use <FastComponentWithFormik render> and <FastComponentWithFormik children> in the same <FastComponentWithFormik> component; <FastComponentWithFormik children> will be ignored"
    );
  }

  shouldComponentUpdate(props) {
    if (this.props.shouldUpdate) {
      return this.props.shouldUpdate(props);
    } else if (
      getIn(this.props.formik.values, this.props.name) !==
        getIn(props.formik.values, this.props.name) ||
      !isSameArrays(
        getIn(this.props.formik.errors, this.props.name),
        getIn(props.formik.errors, this.props.name)
      ) ||
      getIn(this.props.formik.touched, this.props.name) !==
        getIn(props.formik.touched, this.props.name) ||
      Object.keys(this.props).length !== Object.keys(props).length ||
      this.props.formik.isSubmitting !== props.formik.isSubmitting
    ) {
      return true;
    } else {
      return false;
    }
  }

  componentDidMount() {
    // Register the Field with the parent Formik. Parent will cycle through
    // registered Field's validate fns right prior to submit
    this.props.formik.registerField(this.props.name, this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.name !== prevProps.name) {
      this.props.formik.unregisterField(prevProps.name);
      this.props.formik.registerField(this.props.name, this);
    }

    if (this.props.validate !== prevProps.validate) {
      this.props.formik.registerField(this.props.name, this);
    }
  }

  componentWillUnmount() {
    this.props.formik.unregisterField(this.props.name);
  }

  render() {
    const {
      validate,
      name,
      render,
      children,
      component = "input",
      formik,
      ...props
    } = this.props;

    const {
      validate: _validate,
      validationSchema: _validationSchema,
      ...restOfFormik
    } = formik;

    const field = {
      value:
        props.type === "radio" || props.type === "checkbox"
          ? props.value // React uses checked={} for these inputs
          : getIn(formik.values, name),
      name,
      onChange: formik.handleChange,
      onBlur: formik.handleBlur
    };
    const bag = { field, form: restOfFormik };

    if (render) {
      return render(bag);
    }

    if (isFunction(children)) {
      return children(bag);
    }

    if (typeof component === "string") {
      const { innerRef, ...rest } = props;
      return React.createElement(component, {
        ref: innerRef,
        ...field,
        ...rest,
        children
      });
    }

    return React.createElement(component, {
      ...bag,
      ...props,
      children
    });
  }
}

export default formikConnect(FastComponentWithFormik);
