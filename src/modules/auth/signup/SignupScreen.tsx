import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../hooks';
import { SignupForm } from './signup-form';
import styleSheet from './SignupStyles';
import useSignup from './useSignup';
import type { SignupHookReturnType } from './SignupTypes';

/**
 * The SignupScreen component. It renders a Formik form that renders a SignupForm component.
 * @returns A ReactElement.
 */
export default function SignupScreen(): React.ReactElement {
  const { styles } = useTheme(styleSheet);
  const formik: SignupHookReturnType = useSignup();

  return (
    <View style={StyleSheet.flatten([styles.screen, styles.screenView])}>
      <SignupForm {...formik} />
    </View>
  );
}
