import { IBiometricEnv, IErrorClass } from "./StandardInterface";

interface IMosipBioDeviceProps {
    buttonName: string;
    transactionId: string;
    jsonCss?: Object;
    langCode?: string;
    biometricEnv?: IBiometricEnv;
    disable?: boolean;
    onCapture: (biometricResponse: Object) => void;
    onErrored: (errorObj: IErrorClass | null) => void;
  }
  
  export { IMosipBioDeviceProps };