import { StyleSheet } from 'react-native';
import { Colors, width, type ThemeMode } from '../../theme';

/**
 * A StyleSheet object that contains all of the profile screen styles.
 * @param {ThemeMode} theme - The theme to use for the styles.
 * @returns {StyleSheet} A StyleSheet object containing all of the profile screen styles.
 */
const styles = (theme: ThemeMode) =>
  StyleSheet.create({
    logoutButton: {
      alignSelf: 'center',
      width: width * 0.5
    },
    screenView: {
      backgroundColor: Colors[theme]?.white,
      flex: 1,
      justifyContent: 'center'
    }
  });

export default styles;
