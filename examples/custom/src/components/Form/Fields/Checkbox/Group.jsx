import React from "react";

import Checkbox from './Checkbox';

const Group = ({ options, formik, ...props }) => options.map((option, key) => (
    <Checkbox
        key={key}
        {...props}
        checked={props.value.includes(option.value)}
        onChange={(e) => {
            let nextValue = props.value.includes(option.value) ?
                props.value.filter(value => value !== option.value) :
                props.value.concat(option.value);

            formik.setFieldValue(props.name, nextValue);
        }}
        {...option}
    />
));

export default Group;
