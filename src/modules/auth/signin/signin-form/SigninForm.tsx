import React, { createRef } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CustomButton } from '../../../../components';
import { ROUTES, Strings } from '../../../../constants';
import { useTheme } from '../../../../hooks';
import { AuthSelectors, useAppSelector } from '../../../../redux';
import { Colors } from '../../../../theme';
import { navigateWithParam } from '../../../../utils';
import styleSheet from './SigninFormStyles';
import { isRemainingToFillForm } from './SigninFormUtils';
import type { SigninFormPropsType } from './SigninFormTypes';

/**
 * The sign in form component.
 * @param {SigninFormPropsType} props - The props for the sign in form.
 * @returns A sign in form component.
 */
export default function SigninForm({
  handleSubmit,
  handleChange,
  values,
  errors
}: SigninFormPropsType): React.ReactElement {
  const { styles, theme } = useTheme(styleSheet);
  const loading = useAppSelector<boolean>(AuthSelectors.getLoading);
  const inputPasswordRef: React.LegacyRef<TextInput> = createRef();
  const disabled: boolean = isRemainingToFillForm(values, errors);
  const fieldErrorEmail: string | undefined = (values.email?.length ?? 0) ? errors.email : '';
  const fieldErrorPassword: string | undefined =
    (values.password?.length ?? 0) ? errors.password : '';

  return (
    <View style={styles.formContainer}>
      <Text style={styles.titleText}>{Strings.Auth.signInTitle}</Text>
      <Text style={styles.subtitleText}>{Strings.Auth.signInSubtitle}</Text>
      <TextInput
        autoFocus
        returnKeyType="next"
        keyboardType="email-address"
        selectionColor={Colors[theme]?.white}
        placeholderTextColor={Colors[theme]?.white}
        underlineColorAndroid="transparent"
        placeholder={Strings.Auth.hintEmail}
        style={styles.textInput}
        onChangeText={handleChange('email')}
        onSubmitEditing={() => {
          inputPasswordRef.current?.focus();
        }}
      />
      <Text style={styles.errorMsg}>{fieldErrorEmail}</Text>
      <TextInput
        secureTextEntry
        ref={inputPasswordRef}
        returnKeyType="done"
        keyboardType="default"
        selectionColor={Colors[theme]?.white}
        placeholderTextColor={Colors[theme]?.white}
        underlineColorAndroid="transparent"
        placeholder={Strings.Auth.hintPassword}
        style={styles.textInput}
        onChangeText={handleChange('password')}
        onSubmitEditing={() => {
          handleSubmit();
        }}
      />
      <Text style={styles.errorMsg}>{fieldErrorPassword}</Text>
      <CustomButton
        style={StyleSheet.flatten([styles.buttonContainer, styles.buttonTopMargin])}
        disabled={disabled}
        loading={loading}
        title={Strings.Auth.btnSignIn}
        onPress={() => handleSubmit()}
      />
      <View style={styles.linkContainer}>
        <Text style={styles.labelText}>
          {Strings.Auth.noAccountLabel}
          <Text style={styles.linkActionText} onPress={() => navigateWithParam(ROUTES.SignUp)}>
            {Strings.Auth.signUpAction}
          </Text>
        </Text>
      </View>
    </View>
  );
}
