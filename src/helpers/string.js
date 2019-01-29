const capitalize = text =>
  !text
    ? ""
    : "".concat(text.substr(0, 1).toUpperCase(), text.substr(1, text.length));

const pascalCase = word =>
  word
    .split("_")
    .reduce(
      (acc, subWord, index) =>
        `${acc}${index > 0 ? capitalize(subWord) : subWord}`,
      ""
    );

const pascalCaseFormData = word =>
  pascalCase(word)
    .split("[")
    .reduce(
      (acc, subWord, index) =>
        acc.length === 0
          ? `${acc}${capitalize(subWord)}`
          : `${acc}[${capitalize(subWord)}`,
      ""
    );

export { capitalize, pascalCase, pascalCaseFormData };
