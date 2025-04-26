/*
*
* */

import crypto from 'crypto.js'
import { clientConfig } from 'src/common/config.js'


export const interference = crypto.md5(clientConfig.encryption.interference, 'base64')


// 加密方式
export function encryptPwd (password) {
  return crypto.cipher('aes-256-cbc', password, clientConfig.encryption.key)
}

// 解密方式
export function dencryptPwd (data) {

  return crypto.decipher('aes-256-cbc', data, clientConfig.encryption.key)

}
