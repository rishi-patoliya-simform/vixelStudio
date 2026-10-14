import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, type AlertButton } from 'react-native';
import {
  check,
  checkMultiple,
  checkNotifications,
  openSettings,
  request,
  requestMultiple,
  requestNotifications,
  type Permission,
  type RationaleObject
} from 'react-native-permissions';
import { MMKVKeys, Strings } from '../constants';
import { getStorageString, setStorageString, storage } from '../services';
import { globalMetrics } from '../theme';
import useDeepCompareCallback from './useDeepCompareCallback';
import useDeepCompareEffect from './useDeepCompareEffect';

type PermissionRationale = RationaleObject & {
  buttonNeutral?: string;
};

type RationaleOptions = {
  customDialogView?: (buttonPositive: () => void, buttonNegative: () => void) => void;
} & Partial<PermissionRationale>;

/**
 * A type that represents the permission status of a current permission.
 * @enum {string}
 */
export type PermissionStatus = 'unavailable' | 'denied' | 'limited' | 'granted' | 'blocked';

/* Defining a default value for the options RationaleOptions object. */
const defaultOption: RationaleOptions = {
  title: '',
  message: '',
  buttonPositive: ''
};

interface PermissionsOptions {
  /** If it should ask the permissions when mounted, defaults to `false` */
  ask?: boolean;
  /** If it should fetch information about the permissions when mounted and trigger onGranted callback , defaults to `false` */
  getWithCallback?: boolean;
}

/**
 * used for single permission check and request control.
 * @param {Permission} type - The permission you want to check.
 * @param {RationaleOptions} requestRationale - This is the rationale that will be shown to the user if
 * they have denied the permission.
 * @param {RationaleOptions} requestBlocked - The rationale options to show when the permission is
 * blocked.
 * @param {PermissionsOptions} options - for initial configuration of hooks.
 * @param {() => void} onGranted - A callback function that will be called when the permission is granted.
 * @param {() => void} customDialogComplete - This is a callback function that is called when the custom dialog is
 * closed.
 * @param {boolean} removedFirstCheck - to remove first time check logic.
 * @returns {() => void} requestPermissions - This is a function that will request the permissions.
 */
export function useSinglePermissions(
  type: Permission | undefined,
  requestRationale: RationaleOptions = defaultOption,
  requestBlocked: RationaleOptions = defaultOption,
  options: PermissionsOptions = { ask: false, getWithCallback: false },
  onGranted: () => void = () => {},
  customDialogComplete: () => void = () => {},
  removedFirstCheck: boolean = true
): {
  permissionStatus: PermissionStatus | undefined;
  error: Error | undefined;
  requestPermissions: () => void;
  getPermissions: () => Promise<PermissionStatus>;
} {
  const [isFirstTime, setIsFirstTime] = useState<boolean>(removedFirstCheck);
  const [error, setError] = useState<Error>();
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus | undefined>();

  const askDeniedPermissions = useDeepCompareCallback(() => {
    const { title, message, buttonPositive, buttonNegative, buttonNeutral, customDialogView } =
      requestRationale;

    /**
     * It returns a function that resolves the promise returned by onPressGet().
     */
    const onPressNegative = () => {
      customDialogComplete();
    };

    /**
     * It returns a function that resolves the promise returned by onPressAsk().
     */
    const onPressPositive = () => {
      if (type) {
        request(type)
          .then((status: PermissionStatus) => {
            if (status === 'granted' || status === 'limited') {
              onGranted();
            }
          })
          .catch((err: Error) => {
            setError(err);
          })
          .finally(() => {
            customDialogComplete();
          });
      } else {
        onGranted();
        customDialogComplete();
      }
    };

    if (!_.isNil(customDialogView)) {
      customDialogView?.(onPressPositive, onPressNegative);
    } else if (
      !_.isEmpty(title) &&
      !_.isEmpty(message) &&
      !_.isEmpty(buttonPositive) &&
      !_.isEmpty(buttonNegative)
    ) {
      const buttons: AlertButton[] = [];

      if (buttonNegative) {
        if (buttonNeutral) {
          buttons.push({ text: buttonNeutral, onPress: onPressNegative });
        }
        buttons.push({ text: buttonNegative, onPress: onPressNegative });
      }

      buttons.push({
        text: buttonPositive,
        onPress: onPressPositive
      });

      Alert.alert(title!, message, buttons, { cancelable: false });
    } else {
      onPressPositive();
    }
  }, [requestRationale, type, onGranted, customDialogComplete]);

  const askBlockedPermissions = useDeepCompareCallback(() => {
    const { title, message, buttonPositive, buttonNegative, buttonNeutral, customDialogView } =
      requestBlocked;

    /**
     * It returns a function that resolves the promise returned by onPressGet().
     */
    const onPressNegative = () => {
      customDialogComplete();
    };

    /**
     * It returns a function that resolves the promise returned by onPressAsk().
     */
    const onPressPositive = () => {
      if (type) {
        openSettings()
          .then(() => check(type))
          .then((status: PermissionStatus) => {
            setPermissionStatus(status);
            if (status === 'granted' || status === 'limited') {
              onGranted();
            }
          })
          .catch((err: Error) => {
            setError(err);
          })
          .finally(() => {
            customDialogComplete();
          });
      } else {
        onGranted();
        customDialogComplete();
      }
    };

    if (!_.isNil(customDialogView)) {
      customDialogView?.(onPressPositive, onPressNegative);
    } else if (
      !_.isEmpty(title) &&
      !_.isEmpty(message) &&
      !_.isEmpty(buttonPositive) &&
      !_.isEmpty(buttonNegative)
    ) {
      const buttons: AlertButton[] = [];

      if (buttonNegative) {
        if (buttonNeutral) {
          buttons.push({ text: buttonNeutral, onPress: onPressNegative });
        }
        buttons.push({ text: buttonNegative, onPress: onPressNegative });
      }

      buttons.push({
        text: buttonPositive,
        onPress: onPressPositive
      });

      Alert.alert(title!, message, buttons, { cancelable: false });
    } else {
      onPressPositive();
    }
  }, [requestBlocked, type, onGranted, customDialogComplete]);

  useEffect(() => {
    if (type) {
      check(type)
        .then((status: PermissionStatus) => {
          setPermissionStatus(status);
          if (status === 'blocked') {
            setIsFirstTime(false);
          }
        })
        .catch((err: Error) => {
          setError(err);
        });
    }
  }, [type]);

  const requestingPermission = useDeepCompareCallback(() => {
    if (type) {
      request(type)
        .then((status: PermissionStatus) => {
          setPermissionStatus(status);

          if (status === 'granted' || status === 'limited') {
            onGranted();
          }
        })
        .catch((err: Error) => {
          setError(err);
        });
    }
  }, [type, onGranted]);

  const requestPermissions = useDeepCompareCallback(async () => {
    const storedIsFirstTime = getStorageString<string>(MMKVKeys.isFirstTimePermission, 'true');
    const countForAndroidDenied = storage.getNumber(MMKVKeys.countForAndroidDenied) ?? 0;
    if (type) {
      if (isFirstTime && storedIsFirstTime === 'true') {
        setIsFirstTime(false);
        setStorageString(MMKVKeys.isFirstTimePermission, 'false');
        setStorageString(MMKVKeys.countForAndroidDenied, 0);
        requestingPermission();
      } else {
        check(type)
          .then((status: PermissionStatus) => {
            setPermissionStatus(status);
            if (status === 'granted' || status === 'limited') {
              onGranted();
            } else if (status === 'denied') {
              if (globalMetrics.isAndroid && countForAndroidDenied < 1) {
                setStorageString(MMKVKeys.countForAndroidDenied, 1);
                requestingPermission();
              } else if (globalMetrics.isAndroid && countForAndroidDenied === 1) {
                askBlockedPermissions();
              } else if (globalMetrics.isIos) {
                askDeniedPermissions();
              }
            } else if (status === 'blocked') {
              askBlockedPermissions();
            } else {
              setError(new Error(Strings.APIError.permissionIsUnavailable));
            }
          })
          .catch((err: Error) => {
            setError(err);
          });
      }
    } else {
      onGranted();
    }
  }, [
    isFirstTime,
    type,
    askDeniedPermissions,
    requestingPermission,
    askBlockedPermissions,
    onGranted
  ]);

  /**
   * A function that gets the current permission status.
   * @returns A promise that resolves to the current permission status.
   */
  const getPermissions = useDeepCompareCallback<() => Promise<PermissionStatus>>(() => {
    return type
      ? check(type)
          .then((status: PermissionStatus) => {
            setPermissionStatus(status);
            return status;
          })
          .catch((error1: Error) => {
            setError(error1);
            throw error1;
          })
      : Promise.reject(new Error(Strings.APIError.permissionTypeIsUndefined));
  }, [type]);

  useDeepCompareEffect(() => {
    if (options?.ask) {
      requestPermissions();
    }
  }, [options?.ask]);

  useDeepCompareEffect(() => {
    if (
      (permissionStatus === 'granted' || permissionStatus === 'limited') &&
      options?.getWithCallback
    ) {
      onGranted();
    }
  }, [permissionStatus, options?.getWithCallback]);

  return {
    permissionStatus,
    error,
    requestPermissions,
    getPermissions
  };
}

interface GetPermissionResultReturnType {
  status: PermissionStatus;
  deniedList: Permission[];
  blockedList: Permission[];
}

/**
 * Check and filter multiple permission status.
 * @param {Permission[]} types - Permission[]: The list of permissions you want to check.
 * @param {Permission[]} optionTypes - Permission[]:  The list of permissions you want to ignore.
 * @param statuses - Record<Permission[number], PermissionStatus> - current permissions status.
 * @returns An object with a status, deniedList, and blockedList property.
 */
function getPermissionResult(
  types: Permission[],
  optionTypes: Permission[],
  statuses: Record<Permission[number], PermissionStatus>
): GetPermissionResultReturnType {
  const tempOptionTypes: Permission[] = optionTypes ?? [];
  const grantedList: Permission[] = types.filter(
    (type) =>
      statuses[type] === 'granted' ||
      statuses[type] === 'limited' ||
      tempOptionTypes.findIndex((p) => p === type) > -1
  );
  const deniedList: Permission[] = types.filter(
    (type) => statuses[type] === 'denied' && tempOptionTypes.findIndex((p) => p === type) <= -1
  );
  const blockedList: Permission[] = types.filter(
    (type) => statuses[type] === 'blocked' && tempOptionTypes.findIndex((p) => p === type) <= -1
  );
  let status: PermissionStatus = 'unavailable';
  if (grantedList.length === types.length) {
    status = 'granted';
  } else if (deniedList.length > 0) {
    status = 'denied';
  } else if (blockedList.length > 0) {
    status = 'blocked';
  } else {
    status = 'unavailable';
  }
  return { status, deniedList, blockedList };
}

/**
 * used for multiple permission check and request control.
 * @param {Permission[]} type - The permission you want to check.
 * @param {RationaleOptions} requestRationale - This is the rationale that will be shown to the user if
 * they have denied the permission.
 * @param {RationaleOptions} requestBlocked - The rationale options to show when the permission is
 * blocked.
 * @param {PermissionsOptions} options - for initial configuration of hooks.
 * @param {() => void} onGranted - A callback function that will be called when the permission is granted.
 * @param {() => void} customDialogComplete - This is a callback function that is called when the custom dialog is
 * closed.
 * @param {Permission[]} optionTypes - The permission you want to be ignored.
 * @param {boolean} removedFirstCheck - to remove first time check logic.
 * @returns {() => void} requestPermissions - This is a function that will request the permissions.
 */
export function useMultiplePermissions(
  types: Permission[] | undefined,
  requestRationale: RationaleOptions = defaultOption,
  requestBlocked: RationaleOptions = defaultOption,
  options: PermissionsOptions = { ask: false, getWithCallback: false },
  onGranted: () => void = () => {},
  customDialogComplete: () => void = () => {},
  optionTypes: Permission[] = [],
  removedFirstCheck: boolean = true
): {
  permissionStatus: Record<Permission[number], PermissionStatus> | undefined;
  error: Error | undefined;
  requestPermissions: () => void;
  getPermissions: () => Promise<Record<Permission[number], PermissionStatus> | void>;
} {
  const [isFirstTime, setIsFirstTime] = useState<boolean>(removedFirstCheck);
  const [error, setError] = useState<Error>();
  const [permissionStatus, setPermissionStatus] = useState<
    Record<Permission[number], PermissionStatus> | undefined
  >();

  const askDeniedPermissions = useDeepCompareCallback(() => {
    const { title, message, buttonPositive, buttonNegative, buttonNeutral, customDialogView } =
      requestRationale;

    /**
     * It returns a function that resolves the promise returned by onPressGet().
     */
    const onPressNegative = () => {
      customDialogComplete();
    };

    /**
     * It returns a function that resolves the promise returned by onPressAsk().
     */
    const onPressPositive = () => {
      if (types) {
        requestMultiple(types)
          .then((statuses: Record<Permission[number], PermissionStatus>) => {
            const { status } = getPermissionResult(types, optionTypes, statuses);
            setPermissionStatus(statuses);
            if (status === 'granted' || status === 'limited') {
              onGranted();
            }
          })
          .catch((err: Error) => {
            setError(err);
          })
          .finally(() => {
            customDialogComplete();
          });
      } else {
        onGranted();
        customDialogComplete();
      }
    };

    if (!_.isNil(customDialogView)) {
      customDialogView?.(onPressPositive, onPressNegative);
    } else if (
      !_.isEmpty(title) &&
      !_.isEmpty(message) &&
      !_.isEmpty(buttonPositive) &&
      !_.isEmpty(buttonNegative)
    ) {
      const buttons: AlertButton[] = [];

      if (buttonNegative) {
        if (buttonNeutral) {
          buttons.push({ text: buttonNeutral, onPress: onPressNegative });
        }
        buttons.push({ text: buttonNegative, onPress: onPressNegative });
      }

      buttons.push({
        text: buttonPositive,
        onPress: onPressPositive
      });

      Alert.alert(title!, message, buttons, { cancelable: false });
    } else {
      onPressPositive();
    }
  }, [optionTypes, requestRationale, types, onGranted, customDialogComplete]);

  const askBlockedPermissions = useDeepCompareCallback(() => {
    const { title, message, buttonPositive, buttonNegative, buttonNeutral, customDialogView } =
      requestBlocked;

    /**
     * It returns a function that resolves the promise returned by onPressGet().
     */
    const onPressNegative = () => {
      customDialogComplete();
    };

    /**
     * It returns a function that resolves the promise returned by onPressAsk().
     */
    const onPressPositive = () => {
      if (types) {
        openSettings()
          .then(() => checkMultiple(types))
          .then((statuses: Record<Permission[number], PermissionStatus>) => {
            setPermissionStatus(statuses);
            const { status } = getPermissionResult(types, optionTypes, statuses);
            if (status === 'granted' || status === 'limited') {
              onGranted();
            }
          })
          .catch((err: Error) => {
            setError(err);
          })
          .finally(() => {
            customDialogComplete();
          });
      } else {
        onGranted();
        customDialogComplete();
      }
    };

    if (!_.isNil(customDialogView)) {
      customDialogView?.(onPressPositive, onPressNegative);
    } else if (
      !_.isEmpty(title) &&
      !_.isEmpty(message) &&
      !_.isEmpty(buttonPositive) &&
      !_.isEmpty(buttonNegative)
    ) {
      const buttons: AlertButton[] = [];

      if (buttonNegative) {
        if (buttonNeutral) {
          buttons.push({ text: buttonNeutral, onPress: onPressNegative });
        }
        buttons.push({ text: buttonNegative, onPress: onPressNegative });
      }

      buttons.push({
        text: buttonPositive,
        onPress: onPressPositive
      });

      Alert.alert(title!, message, buttons, { cancelable: false });
    } else {
      onPressPositive();
    }
  }, [optionTypes, requestBlocked, types, onGranted, customDialogComplete]);

  useEffect(() => {
    if (types) {
      checkMultiple(types)
        .then((statuses: Record<Permission[number], PermissionStatus>) => {
          setPermissionStatus(statuses);
          const { status } = getPermissionResult(types, optionTypes, statuses);
          if (status === 'blocked') {
            setIsFirstTime(false);
          }
        })
        .catch((err: Error) => {
          setError(err);
        });
    }
  }, [optionTypes, types]);

  /**
   * A function that gets the current permission status.
   * @returns A promise that resolves to the current permission status.
   */
  const getPermissions = useDeepCompareCallback<
    () => Promise<Record<Permission[number], PermissionStatus> | void>
  >(() => {
    return types
      ? checkMultiple(types)
          .then((statuses: Record<Permission[number], PermissionStatus>) => {
            setPermissionStatus(statuses);
            const { status } = getPermissionResult(types, optionTypes, statuses);
            if (status === 'blocked') {
              setIsFirstTime(false);
            }
          })
          .catch((err: Error) => {
            setError(err);
          })
      : Promise.reject(new Error(Strings.APIError.permissionTypeIsUndefined));
  }, [types, optionTypes]);

  const requestingPermission = useDeepCompareCallback(() => {
    if (types) {
      requestMultiple(types)
        .then((statuses: Record<Permission[number], PermissionStatus>) => {
          setPermissionStatus(statuses);
          const { status } = getPermissionResult(types, optionTypes, statuses);
          if (status === 'granted' || status === 'limited') {
            onGranted();
          }
        })
        .catch((err: Error) => {
          setError(err);
        });
    }
  }, [types, optionTypes, onGranted]);

  const requestPermissions = useDeepCompareCallback(() => {
    const storedIsFirstTime = getStorageString<string>(MMKVKeys.isFirstTimePermission, 'true');
    const countForAndroidDenied = storage.getNumber(MMKVKeys.countForAndroidDenied) ?? 0;
    if (types) {
      if (isFirstTime && storedIsFirstTime === 'true') {
        setIsFirstTime(false);
        setStorageString(MMKVKeys.isFirstTimePermission, 'false');
        setStorageString(MMKVKeys.countForAndroidDenied, 0);
        requestingPermission();
      } else {
        checkMultiple(types)
          .then((statuses: Record<Permission[number], PermissionStatus>) => {
            setPermissionStatus(statuses);
            const { status } = getPermissionResult(types, optionTypes, statuses);
            if (status === 'granted' || status === 'limited') {
              onGranted();
            } else if (status === 'denied') {
              if (globalMetrics.isAndroid && countForAndroidDenied < 1) {
                setStorageString(MMKVKeys.countForAndroidDenied, 1);
                requestingPermission();
              } else if (globalMetrics.isAndroid && countForAndroidDenied === 1) {
                askBlockedPermissions();
              } else if (globalMetrics.isIos) {
                askDeniedPermissions();
              }
            } else if (status === 'blocked') {
              askBlockedPermissions();
            } else {
              setError(new Error(Strings.APIError.permissionIsUnavailable));
            }
          })
          .catch((err: Error) => {
            setError(err);
          });
      }
    } else {
      onGranted();
    }
  }, [types, askDeniedPermissions, requestingPermission, askBlockedPermissions, onGranted]);

  useDeepCompareEffect(() => {
    if (options?.ask) {
      requestPermissions();
    }
  }, [options?.ask]);

  return {
    permissionStatus,
    error,
    requestPermissions,
    getPermissions
  };
}

/**
 * used for notification permission check and request control.
 * @param {PermissionRationale} requestBlocked - The rationale to display when the user is blocked permission.
 * @param {PermissionsOptions} options - for initial configuration of hooks.
 * @param {() => void} onGranted - The function to call when the permission is granted.
 * @returns [PermissionStatus | undefined, Error | undefined, () => Promise<void>, () => Promise<void>]
 */
export function useNotificationPermissions(
  requestBlocked: PermissionRationale,
  options: PermissionsOptions = {},
  onGranted: () => void = () => {}
): [PermissionStatus | undefined, Error | undefined, () => Promise<void>, () => Promise<void>] {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus | undefined>();
  const [error, setError] = useState<Error>();
  const { ask = false } = options;

  const askBlockedPermissionsWithState = useCallback<() => Promise<PermissionStatus>>(() => {
    const { title, message, buttonPositive, buttonNegative, buttonNeutral } = requestBlocked;

    return new Promise<PermissionStatus>((resolve) => {
      const buttons: AlertButton[] = [];

      if (buttonNegative) {
        /**
         * It checks the permission status of the user and returns the status.
         */
        const onPress = () =>
          resolve(
            checkNotifications().then(({ status }: { status: PermissionStatus }) => {
              setPermissionStatus(status);
              return status;
            })
          );
        if (buttonNeutral) {
          buttons.push({ text: buttonNeutral, onPress });
        }
        buttons.push({ text: buttonNegative, onPress });
      }

      buttons.push({
        text: buttonPositive,
        onPress: () =>
          resolve(
            openSettings().then(() =>
              checkNotifications().then(({ status }: { status: PermissionStatus }) => {
                setPermissionStatus(status);
                return status;
              })
            )
          )
      });

      Alert.alert(title, message, buttons, { cancelable: false });
    });
  }, [requestBlocked]);

  const askBlockedPermissions = useCallback<() => Promise<void>>(() => {
    const { title, message, buttonPositive, buttonNegative, buttonNeutral } = requestBlocked;

    return new Promise<void>((resolve) => {
      const buttons: AlertButton[] = [];

      if (buttonNegative) {
        /**
         * OnPress is a function that returns the result of resolve().
         */
        const onPress = () => resolve();
        if (buttonNeutral) {
          buttons.push({ text: buttonNeutral, onPress });
        }
        buttons.push({ text: buttonNegative, onPress });
      }

      buttons.push({
        text: buttonPositive,
        onPress: () => resolve(openSettings())
      });

      Alert.alert(title, message, buttons, { cancelable: false });
    });
  }, [requestBlocked]);

  const askPermissions = useCallback<() => Promise<void>>(() => {
    return requestNotifications(['alert', 'badge', 'sound'])
      .then(({ status }: { status: PermissionStatus }) => {
        if (status === 'blocked') {
          return askBlockedPermissionsWithState();
        }
        return status;
      })
      .then(setPermissionStatus)
      .catch(setError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPermissions = useCallback<() => Promise<void>>(() => {
    return checkNotifications()
      .then(({ status }: { status: PermissionStatus }) => setPermissionStatus(status))
      .catch(setError);
  }, []);

  useDeepCompareEffect(() => {
    if (ask) {
      askPermissions();
    }
  }, [ask, askPermissions, getPermissions]);

  useEffect(() => {
    if (permissionStatus === 'granted' || permissionStatus === 'limited') {
      onGranted();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionStatus]);

  const callPermission = useMemo(
    () => (permissionStatus === 'blocked' ? askBlockedPermissions : askPermissions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissionStatus]
  );
  return [permissionStatus, error, callPermission, getPermissions];
}
