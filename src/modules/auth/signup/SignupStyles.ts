import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, type ThemeMode } from '../../../theme';

/**
 * A StyleSheet object that contains all of the sign up screen styles.
 * @param {ThemeMode} theme - The theme to use for the styles.
 * @returns {StyleSheet} A StyleSheet object containing all of the sign up screen styles.
 */
const styles = (theme: ThemeMode) =>
  StyleSheet.create({
    ...ApplicationStyles(theme),
    screenView: {
      backgroundColor: Colors[theme]?.white,
      marginTop: '30%'
    }
  });

export default styles;
