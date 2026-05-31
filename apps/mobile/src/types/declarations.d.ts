declare module 'react-native-crypto-js' {
  const CryptoJS: any;
  export default CryptoJS;
}

declare module 'react-native-screenshot-prevent' {
  const RNScreenshotPrevent: {
    enabled: (enable: boolean) => void;
    enableSecureView: () => void;
    disableSecureView: () => void;
  };
  export default RNScreenshotPrevent;
}
