import type { FormikProps } from 'formik';

/**
 * The values that are passed into the sign up form.
 * @typedef {Object} SignupFormValues
 * @property {string} name - The full name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The password of the user.
 */
export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
}

export type SignupHookReturnType = FormikProps<SignupFormValues>;
