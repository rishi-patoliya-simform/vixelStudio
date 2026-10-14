export const domain: string = 'vixelstudio.page.link';

export const bundleId: string = 'com.simform.vixelstudio';

export const scheme: string = 'vixelstudio://';

export const deepLinkPrefixes = ['vixelstudio://', `${domain}//`, `https://${domain}`];

export enum DeepLink {
  // vixelstudio://magic_link&lang=en&tenantId=austin-electrical-qqm76
  MagicLink = 'magic_link',
  // vixelstudio://forgot_password&lang=en&tenantId=austin-electrical-qqm76
  ForgotPassword = 'forgot_password',
  // vixelstudio://?toastMessage=<message content>
  ToastMessage = 'toastMessage',
  // vixelstudio://?signin
  SignIn = 'signin',
  // vixelstudio://?details
  Details = 'details'
}

/**
 * Regex for deep links
 */
export const DeepLinkRegex = {
  SignIn: /^signin?$/,
  Details: /^(\d*)?details\/?(\d*)?$/
};

export default DeepLink;
