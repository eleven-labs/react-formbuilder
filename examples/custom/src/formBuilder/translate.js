const translate = (key, args) => {
  const translations = {
    "form.validators.required": ({ label }) =>
      `Please input your ${label.toLowerCase()}!`,
    "form.validators.email": () => `Email is invalid!`,
    "form.validators.is_greater_than": ({ label, length }) =>
      `${label} has to be longer than ${length} characters!`
  };

  return translations[key] ? translations[key](args) : key;
};

export default translate;
