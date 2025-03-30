import { registerLicense } from '@syncfusion/ej2-base'

// מפתח הרישיון של Syncfusion File Formats
const SYNCFUSION_LICENSE_KEY = 'GTBMmhhan1/fWBgaGRifGJhfGpqampzYWBpZmppZmpoODwxOn0+MikmKRM0PjI6P30wPD4='

export function initializeSyncfusion() {
  registerLicense(SYNCFUSION_LICENSE_KEY)
} 