// File to hold all the custom functions needed for latte

import fs from 'fs'
import path from 'path'
import { ipcMain } from 'electron'


interface Config {
  background: string
  retroarch: string
}

interface Core {
  name: string
  extensions: string[]
}

function handleOpenConfig(): string {
  const content = fs.readFileSync('/home/hazy/.config/latte/config/latte.json', 'utf-8')

  const config: Config = JSON.parse(content)
  loadCores(config)
  
  return content
}

function loadCores(config: Config): Core[] {
  const files = fs.readdirSync(config.retroarch+"/cores")
  const infoFiles = files.filter((file) => {
    return path.extname(file) === ".info"
  })

  const cores: Core[] = [];
  
  infoFiles.forEach((file) => {
    const content = fs.readFileSync(`${config.retroarch}/cores/${file}`, 'utf-8')

    // Function to find a specific key's value in the file
    const getValue = (key) => {
      const regex = new RegExp(`^${key}\\s*=\\s*"(.*)"`, 'm');
      const match = content.match(regex);
      return match ? match[1] : null;
    };

    const corename = getValue("corename")
    const extensions = getValue("supported_extensions")
    if (corename != null && extensions != null) {
      const core: Core = {name: corename, extensions: extensions.split("|")};
      cores.push(core)

    }
  })

  return cores
}

export function setHandles() {
    ipcMain.handle('loadConfig', handleOpenConfig)
}