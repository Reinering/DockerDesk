import { cmd1 } from 'app/src-electron/common/utils.js'


export async function getWSLInfo () {
  return cmd1('wsl -v')
}

export async function getWSList () {
  return cmd1('wsl -l')
}
