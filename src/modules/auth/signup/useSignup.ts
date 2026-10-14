import { useFormik, type FormikProps } from 'formik';
import { useEffect, useRef } from 'react';
import { AuthActions, useAppDispatch } from '../../../redux';
import { SignupFormSchema } from '../../../utils';
import type { SignupFormValues, SignupHookReturnType } from './SignupTypes';

/**
 * Hook that returns the ref to the sign up form and the function to submit the form.
 * @returns formik props
 */
export default function useSignup(): SignupHookReturnType {
  const dispatch = useAppDispatch();
  const registerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Creating a formik object that is used to submit the form. */
  const formik: FormikProps<SignupFormValues> = useFormik<SignupFormValues>({
    initialValues: {
      name: '',
      email: '',
      password: ''
    },
    validationSchema: SignupFormSchema,
    onSubmit: (_values: SignupFormValues) => {
      // TODO: You can call the signup API here and handle the response accordingly.
      // Simulated sign up - replace with actual API success handling in production
      registerTimerRef.current = setTimeout(() => {
        dispatch(AuthActions.setLoggedIn(true));
      }, 1000);
    }
  });

  useEffect(() => {
    return () => {
      if (registerTimerRef.current) {
        clearTimeout(registerTimerRef.current);
      }
    };
  }, []);

  return formik;
}
