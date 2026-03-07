import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electronAPI: {
      onControllerInput: (callback: (data: string) => void) => () => void
    }
    electron: ElectronAPI
    api: unknown
  }
}
