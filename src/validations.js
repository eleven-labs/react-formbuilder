import isEmpty from 'lodash/isEmpty';

export default {
  Required: v => !isEmpty(v),
  Email: email => {
    const regex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    return email && email.length > 0 ? regex.test(email) : true;
  },
  IsGreaterThan: (v, { length }) => v.length >= length,
  RepeatValue: (v, { values, key }) => v === values[key],
};
