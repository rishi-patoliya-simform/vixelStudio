import React, { type FC } from 'react';
import { View } from 'react-native';
import { CustomButton } from '../../components';
import { Strings } from '../../constants';
import { useTheme } from '../../hooks';
import { AuthActions, useAppDispatch } from '../../redux';
import styleSheet from './ProfileStyles';

/**
 * The ProfileScreen component
 * @returns {React.ReactElement} A React element.
 */
const ProfileScreen: FC = (): React.ReactElement => {
  const { styles } = useTheme(styleSheet);
  const dispatch = useAppDispatch();
  return (
    <View style={styles.screenView}>
      <CustomButton
        style={styles.logoutButton}
        title={Strings.Profile.btnLogout}
        variant="solid"
        onPress={() => dispatch(AuthActions.logout())}
      />
    </View>
  );
};

export default ProfileScreen;
