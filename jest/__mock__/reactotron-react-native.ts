export const Reactotron = {
  configure: () => Reactotron,
  useReactNative: () => Reactotron,
  asyncStorage: () => Reactotron,
  trackGlobalErrors: () => Reactotron,
  createEnhancer: () => jest.fn,
  use: () => Reactotron,
  connect: () => Reactotron,
  clear: () => Reactotron,
  openInEditor: () => Reactotron
};

module.exports = Reactotron;
