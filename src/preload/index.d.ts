import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electronAPI: {
      onControllerInput: (callback: (data: string) => void) => () => void
      openLoadConfig: () => Promise<string>
    }
    electron: ElectronAPI
    api: unknown
  }
}
