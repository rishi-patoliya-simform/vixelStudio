/**
 * Configures and returns the Reactotron settings.
 * @returns {Array} An array of configuration settings for Reactotron.
 */
export const getReactotronEnhancer = () => {
  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Reactotron = require('../configs/ReactotronConfig').default;
    return [Reactotron.createEnhancer()];
  } else {
    return [];
  }
};
