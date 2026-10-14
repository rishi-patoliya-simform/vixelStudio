import type { FormikProps } from 'formik';

/**
 * The route params for the sign in screen.
 * @param {string} email - the email of the user.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type SigninRouteParamList = {
  email: string;
};

/**
 * The values that are passed into the sign in form.
 * @typedef {Object} SigninFormValues is an object with two properties, email and password, both of which are strings
 * @property {string} email - The email address of the user.
 * @property {string} password - The password of the user.
 */
export interface SigninFormValues {
  email: string;
  password: string;
}

export type SigninHookReturnType = FormikProps<SigninFormValues>;
