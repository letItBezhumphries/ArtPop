import _ from "lodash";
import artworkFormFields from "./artworkFormFields";

const validate = (values) => {
  const errors = {};

  _.each(artworkFormFields, ({ name, noValueError }) => {
    if (!values[name]) {
      errors[name] = noValueError;
    }
  });

  return errors;
};

export default validate;
