import React from "react";

import Radio from './Radio';

const Group = ({ options, formik, ...props }) => options.map((option, key) => (
    <Radio
        key={key}
        {...props}
        checked={props.value === option.value}
        {...option}
    />
));

export default Group;
