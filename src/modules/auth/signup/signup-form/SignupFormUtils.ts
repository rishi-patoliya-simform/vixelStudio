import _ from 'lodash';
import type { SignupFormValues } from '../SignupTypes';
import type { FormikErrors } from 'formik';

/**
 * Checks if the form has any errors or unfilled required fields.
 * @param {SignupFormValues} values - the values of the form.
 * @param {FormikErrors<SignupFormValues>} errors - the errors of the form.
 * @returns {boolean} - true if the form has any errors or missing values.
 */
export function isRemainingToFillForm(
  values: SignupFormValues,
  errors: FormikErrors<SignupFormValues>
): boolean {
  const isError: boolean =
    !_.isEmpty(errors.name) || !_.isEmpty(errors.email) || !_.isEmpty(errors.password);

  const isNoValue: boolean =
    _.isEmpty(values.name) || _.isEmpty(values.email) || _.isEmpty(values.password);

  return isError || isNoValue;
}
