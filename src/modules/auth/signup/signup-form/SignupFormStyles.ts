import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, scale, type ThemeMode } from '../../../../theme';

/**
 * A StyleSheet object that contains all of the sign up form styles.
 * @param {ThemeMode} theme - The theme to use for the styles.
 * @returns {StyleSheet} A StyleSheet object containing all of the sign up form styles.
 */
const styles = (theme: ThemeMode) =>
  StyleSheet.create({
    ...ApplicationStyles(theme),
    buttonText: {
      color: Colors[theme]?.white
    },
    errorMsg: {
      color: Colors[theme]?.red,
      fontSize: scale(14),
      marginBottom: scale(20)
    },
    formContainer: {
      flex: 1,
      paddingHorizontal: scale(20)
    },
    labelText: {
      color: Colors[theme]?.black,
      fontSize: scale(14)
    },
    linkActionText: {
      color: Colors[theme]?.lightBlue,
      fontSize: scale(14),
      fontWeight: '600'
    },
    linkContainer: {
      alignItems: 'center',
      marginTop: scale(18)
    },
    linkText: {
      color: Colors[theme]?.lightBlue,
      fontSize: scale(14)
    },
    subtitleText: {
      color: Colors[theme]?.gray,
      fontSize: scale(14),
      lineHeight: scale(20),
      marginBottom: scale(32)
    },
    textInput: {
      backgroundColor: Colors[theme]?.black,
      borderRadius: scale(5),
      color: Colors[theme]?.white,
      fontSize: scale(16),
      paddingHorizontal: scale(10),
      paddingVertical: scale(10)
    },
    titleText: {
      color: Colors[theme]?.black,
      fontSize: scale(24),
      fontWeight: 'bold',
      marginBottom: scale(8)
    }
  });

export default styles;
