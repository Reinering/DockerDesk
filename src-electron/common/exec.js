import { isWindows } from './utils.js'
import { exec, execSync, spawn } from 'child_process'
import readline from 'readline'
import os from 'node:os'
import iconv from 'iconv-lite'
import * as sudo from 'sudo-prompt'


export class Exec {
  constructor(Proxy) {
    this.proxy = Proxy
  }

  exec(command, args, options) {

    let env = { ...process.env };

    if (options?.env) {
      env = Object.assign(env, options.env);
    }

    if (this.proxy.isEnabled()) {
      if (this.proxy.proxy?.httpsProxy) {
        env['HTTPS_PROXY'] = `${this.proxy.proxy.httpsProxy}`;
      }
      if (this.proxy.proxy?.httpProxy) {
        env['HTTP_PROXY'] = `${this.proxy.proxy.httpProxy}`;
      }
      if (this.proxy.proxy?.noProxy) {
        env['NO_PROXY'] = this.proxy.proxy.noProxy;
      }
    }

    if (options?.isAdmin) {
      if (isWindows()) {
        return new Promise((resolve, reject) => {
          const sudoEnv = env

          for (const key of Object.keys(sudoEnv)) {
            if (!/^[a-zA-Z_]\w*$/.test(key)) {
              delete sudoEnv[key]
            }
          }
          const sudoOptions = {
            name: 'Admin usage',
            env: sudoEnv,
          };
          const sudoCommand = `${command} ${(args ?? []).join(' ')}`

          const callback = (error, stdout, stderr) => {
            if (error) {
              // need to return a RunError
              const errResult = {
                name: error.name,
                message: `Failed to execute command: ${error.message}`,
                exitCode: 1,
                command: sudoCommand,
                stdout: stdout?.toString() ?? '',
                stderr: stderr?.toString() ?? '',
                cancelled: false,
                killed: false,
              }

              reject(errResult)
            }
            const result = {
              command,
              stdout: stdout?.toString() ?? '',
              stderr: stderr?.toString() ?? '',
            }
            // in case of success
            resolve(result)
          }

          sudo.exec(sudoCommand, sudoOptions, callback)
        })
      }

    }

    if (env['FLATPAK_ID']) {
      const customEnvVariables = []
      for (const envVar in options?.env) {
        customEnvVariables.push(`--env=${envVar}=${options.env[envVar]}`)
      }
      args = ['--host', ...customEnvVariables, command, ...(args ?? [])]
      command = 'flatpak-spawn'
    }

    let cwd
    if (options?.cwd) {
      cwd = options.cwd
    }

    return new Promise((resolve, reject) => {
      let stdout = ''
      let stderr = ''

      const childProcess = spawn(command, args, { env, cwd })

      options?.token?.onCancellationRequested(() => {
        if (!childProcess.killed) {
          childProcess.kill()
          options?.logger?.error('Execution cancelled')
          const errResult = {
            name: 'Execution cancelled',
            message: 'Failed to execute command: Execution cancelled',
            exitCode: 1,
            command: command,
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            cancelled: true,
            killed: childProcess.killed,
          }
          reject(errResult)
        }
        options?.logger?.error('Failed to execute cancel: Process has been already killed');
        const errResult = {
          name: 'Failed to execute cancel: Process has been already killed',
          message: 'Failed to execute cancel: Process has been already killed',
          exitCode: 1,
          command: command,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          cancelled: false,
          killed: childProcess.killed,
        }
        reject(errResult)
      })

      childProcess.stdout.setEncoding(options?.encoding ?? 'utf8')
      childProcess.stderr.setEncoding(options?.encoding ?? 'utf8')

      childProcess.stdout.on('data', data => {
        stdout += data.toString()
        options?.logger?.log(data)
      });

      childProcess.stderr.on('data', data => {
        stderr += data.toString()
        options?.logger?.warn(data)
      });

      childProcess.on('error', error => {
        options?.logger?.error(`Failed to execute command: ${error.message}`);
        const errResult = {
          name: error.name,
          message: `Failed to execute command: ${error.message}`,
          exitCode: 1,
          command: command,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          cancelled: false,
          killed: childProcess.killed,
        }
        reject(errResult)
      })

      childProcess.on('close', exitCode => {
        if (exitCode === 0) {
          const result = {
            command,
            stdout: stdout.trim(),
            stderr: stderr.trim(),
          }
          resolve(result)
        } else {
          options?.logger?.error(`Command execution failed with exit code ${exitCode}`);
          const errResult = {
              name: `Command execution failed with exit code ${exitCode}`,
              message: `
        Command execution failed with exit code $
          {
            exitCode
          }
          `,
            exitCode: exitCode ?? 1,
            command: command,
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            cancelled: false,
            killed: childProcess.killed,
          }
          reject(errResult)
        }
      })
    })
  }



}
