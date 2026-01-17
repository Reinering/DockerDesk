


export function parseWSLListVersion(data) {
  const lines = data.trim().split('\n').filter(line => line.trim())

  const headers = lines[0].trim().split(/\s+/) // 按多个空格分割

  const result = []

  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].trim().replace(/^\*\s*/, '').split(/\s+/)

    if (columns.length === headers.length) {
      const row = {}
      headers.forEach((header, index) => {
        row[header.toLowerCase()] = columns[index]
      })
      result.push(row)
    }
  }

  return result
}

export function parseDistributionList(data) {
  const lines = data.trim().split('\n').slice(3)
  const dividerIndex = lines.findIndex(line => line.trim().startsWith('NAME'))
  return lines.slice(dividerIndex + 1).map(line => {
    const [label, ...valueParts] = line.split(/\s+/)
    const desc = valueParts.join(' ').trim()
    const value = label
    return { label, value, desc }
  })
}


/**
 * 解析 docker images / docker image ls 的输出
 * 支持以下几种常见表头（实际列顺序和空格数量不影响解析）：
 * 1. 经典格式：REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
 * 2. 新格式（带 CreatedAt）：REPOSITORY   TAG       IMAGE ID       CREATED AT      SIZE
 * 3. Docker Desktop 29+ 的 pretty 格式（你当前看到的）：
 *      IMAGE ID   DISK USAGE   CONTENT SIZE   EXTRA   REPOSITORY:TAG   U
 * 4. 其他自定义 --format 表格格式
 */
export const parseDockerImages = (input) => {
  const lines = input.trim().split('\n')

  // 第一行是表头，用来判断格式
  const header = lines[0]?.toUpperCase() || ''

  const results = []

  // ---------- 情况1：经典表格格式（包含 CREATED 或 CREATED AT） ----------
  if (header.includes('REPOSITORY') && header.includes('TAG') && header.includes('IMAGE ID')) {
    // 跳过表头
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // 多个空格分隔的字段，使用 \s{2,} 进行分割（更稳健）
      const cols = line.split(/\s{2,}/).map(s => s.trim())

      // 至少要有 5 列（REPOSITORY TAG IMAGE ID CREATED* SIZE）
      if (cols.length < 5) continue;

      let repository = cols[0]
      let tag        = cols[1]
      let imageId    = cols[2]

      // 处理 REPOSITORY 为 <none> 的情况，实际 repo:tag 可能出现在最后一列
      if (repository === '<none>' || repository === '-') {
        // 有些版本会把 repo:tag 合并到最后一列
        const lastCol = cols[cols.length - 1];
        if (lastCol.includes(':')) {
          const [repo, t] = lastCol.split(/:/, 2);
          repository = repo
          tag = t || '<none>'
        } else {
          tag = '<none>'
        }
      }

      // CREATED 可能是倒数第二列或倒数第三列（CreatedAt 占两列）
      let created = ''
      let size    = cols[cols.length - 1] // SIZE 永远是最后一列

      if (cols.length === 5) {
        // REPOSITORY TAG IMAGE ID CREATED SIZE
        created = cols[3]
      } else if (cols.length >= 6) {
        // REPOSITORY TAG IMAGE ID CREATED AT ... SIZE
        // CreatedAt 可能是两列：日期 + 时间
        created = cols.slice(3, cols.length - 1).join(' ')
      }

      results.push({
        id: results.length + 1,
        repository,
        tag: tag || '<none>',
        imageId,
        created: created.trim(),
        size: size.trim(),
      })
    }

    return results
  }

  // ---------- 情况2：Docker Desktop 29+ 的新 pretty 格式 ----------
  // 表头示例：i Info → U In Use
  //           IMAGE ID DISK USAGE CONTENT SIZE EXTRA
  // 数据行示例：
  // coturn/coturn:latest f44bafdab891 121MB 0B U
  if (header.includes('IMAGE ID') && header.includes('DISK USAGE')) {
    for (let i = 2; i < lines.length; i++) {  // 第1行是 i Info 那一行，第2行是列名
      const line = lines[i].trim()
      if (!line) continue

      // 新格式的特点：repo:tag 在第一列，后面是 ID、DISK USAGE、CONTENT SIZE、EXTRA、U 标记
      const parts = line.split(/\s{2,}/) // 用多个空格分割

      if (parts.length < 4) continue

      let fullName = parts[0]                     // coturn/coturn:latest
      const imageId = parts[1]
      const diskUsage = parts[2]
      const contentSize = parts[3]
      // EXTRA 可能为空，最后可能有 U 标记

      let repository = '<none>'
      let tag = '<none>'

      if (fullName.includes(':')) {
        const [repo, t] = fullName.split(/:/, 2);
        repository = repo
        tag = t
      } else if (fullName.includes('/')) {
        repository = fullName
      }

      results.push({
        id: results.length + 1,
        repository,
        tag,
        imageId,
        created: '',                    // 新格式不提供 created，留空
        size: diskUsage,                // 这里用磁盘实际占用作为 size（最有意义）
        diskUsage,
        contentSize,
        inUse: line.includes(' U') || line.endsWith('U'), // 是否正在使用
      })
    }

    return results
  }

  // ---------- 情况3：其他无法识别的格式，直接返回空 ----------
  console.warn('Unrecognized docker images output format:', lines[0])
  return []
}


export const parseDockerImages1 = (input) => {
  // 按行分割并移除表头
  const lines = input.trim().split('\n').slice(1)

  let id = 0
  return lines.map(line => {
    // 使用正则表达式匹配字段，处理 CREATED 字段的完整性
    line = line.trim()
    const match = line.match(/(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\s+(\S+)$/)
    if (!match) return null // 如果解析失败，返回 null

    const [, repository, tag, imageId, created, size] = match
    id += 1

    return {
      id,
      repository,
      tag,
      imageId,
      created,
      size
    }
  }).filter(item => item !== null) // 过滤掉无效行
}

export function parsePodmanImages(input) {
  // 按行分割并移除空行
  const lines = input.trim().split('\n').filter(line => line.trim() !== '')

  // 移除表头（第一行）
  const dataLines = lines.slice(1)

  let id = 0
  // 将每行解析为对象
  const result = dataLines.map(line => {
    // 按多个空格分割，并清理每部分
    const parts = line.trim().split(/\s{2,}/)
    id += 1

    return {
      id,
      repository: parts[0],
      tag: parts[1],
      imageId: parts[2],
      created: parts[3],
      size: parts[4]
    }
  })

  return result
}

export const parsePullDockerImages = (input) => {
  // 按行分割并移除表头
  const lines = input.trim().split('\n').slice(1)

  return lines.map(line => {
    // 使用正则表达式匹配字段，优化处理 DESCRIPTION 和 OFFICIAL
    const match = line.match(/(\S+(?:\/\S+)*)\s+(.+?)\s+(\d+)\s*(\[?\w*\]?)?$/)
    if (!match) return null // 如果解析失败，返回 null

    const [, name, description, stars, official = ''] = match

    return {
      name,
      description: description.trim(),
      stars: Number(stars),
      official: official.replace(/[[\]]/g, '')
    }
  }).filter(item => item !== null) // 过滤掉无效行
}

export const parsePullPodmanImages = (input) => {
  const lines = input.trim().split('\n').filter(line => line.trim())

  lines.shift()

  return lines.map(line => {
    // Split by multiple spaces, assuming at least 2 spaces separate columns
    const [name, ...descriptionParts] = line.split(/\s{2,}/)
    return {
      name: name.trim(),
      description: descriptionParts.join(' ').trim(),
      stars: '',
      official: ''
    }
  })
}

export const parseDockerNetwork = (str) => {
  // 按行分割，去除空行
  const lines = str.split('\n').filter(line => line.trim())
  // 定义表头，NETWORK ID 作为一列
  const headers = ['network_id', 'name', 'driver', 'scope']

  // 处理数据行，转换为对象数组
  return lines.slice(1).map(line => {
    // 按多个空格分割，确保正确分隔字段
    const values = line.trim().split(/\s+/).filter(Boolean)
    const obj = {}
    headers.forEach((header, index) => {
      // 映射值到字段，超出字段数的值忽略，缺失的值用空字符串
      obj[header] = index < values.length ? values[index] : ''
    })
    return obj
  })
}

export const parseDockerVolume = (input) => {
  // 按行分割并去除首行（表头）
  const lines = input.trim().split('\n').slice(1)

  // 将每行转换为对象
  const result = lines.map(line => {
    // 按多个空格分割（考虑到可能有不定数量的空格）
    const [driver, volumeName] = line.trim().split(/\s+/)
    return { driver, volumeName }
  })

  return result
}

export const parseDockerContainer = (input) => {
  // 按行分割并去除首行（表头）
  const lines = input.trim().split('\n').slice(1)

  // 将每行转换为对象
  const result = lines.map(line => {
    // 按两个或更多空格分割
    const parts = line.trim().split(/\s{2,}/)

    // 确保字段存在，默认空字符串
    const containerId = parts[0] || ''
    const image = parts[1] || ''
    const command = parts[2] || ''
    const created = parts[3] || ''
    const status = parts[4] || ''

    // 处理 PORTS 和 NAMES
    let ports = ''
    let names = ''

    // 如果 parts 长度为 6，说明 PORTS 为空，NAMES 在 parts[5]
    if (parts.length === 6) {
      ports = ''
      names = parts[5] || ''
    } else if (parts.length >= 7) {
      // 如果 parts 长度 >= 7，PORTS 在 parts[5]，NAMES 在 parts[6]
      ports = parts[5] || ''
      names = parts[6] || ''
    }

    return {
      containerId,
      image,
      command,
      created,
      status,
      ports,
      names
    }
  })

  return result
}

export const parsePodmanContainer = (input) => {
  // 按行分割并去除首行（表头）
  const lines = input.trim().split('\n').slice(1)

  // 将每行转换为对象
  const result = lines.map(line => {
    // 按两个或更多空格分割
    const parts = line.trim().split(/\s{2,}/)

    // 确保字段存在，默认空字符串
    const containerId = parts[0] || ''
    const image = parts[1] || ''
    const command = parts[2] || ''
    const created = parts[3] || ''
    const status = parts[4] || ''

    // 处理 PORTS 和 NAMES
    let ports = ''
    let names = ''

    // 如果 parts 长度为 6，说明 PORTS 为空，NAMES 在 parts[5]
    if (parts.length === 6) {
      ports = ''
      names = parts[5] || ''
    } else if (parts.length >= 7) {
      // 如果 parts 长度 >= 7，PORTS 在 parts[5]，NAMES 在 parts[6]
      ports = parts[5] || ''
      names = parts[6] || ''
    }

    return {
      containerId,
      image,
      command,
      created,
      status,
      ports,
      names
    }
  })

  return result
}

function parseExPorts(ports) {
  // 按协议分开处理
  const tcpPorts = ports
    .filter(p => p.protocol === 'tcp')
    .map(p => parseInt(p.port, 10))
    .sort((a, b) => a - b)
  const udpPorts = ports
    .filter(p => p.protocol === 'udp')
    .map(p => parseInt(p.port, 10))
    .sort((a, b) => a - b)

  // 合并连续端口的函数
  const mergePorts = (portNumbers) => {
    if (portNumbers.length === 0) return []
    const ranges = []
    let start = portNumbers[0]
    let prev = start

    for (let i = 1; i <= portNumbers.length; i++) {
      const current = portNumbers[i]
      if (current !== prev + 1 || i === portNumbers.length) {
        if (start === prev) {
          ranges.push(start.toString())
        } else {
          ranges.push(`${start}-${prev}`)
        }
        start = current
      }
      prev = current
    }
    return ranges
  }

  // 合并 TCP 和 UDP 端口
  const tcpRanges = mergePorts(tcpPorts)
  const udpRanges = mergePorts(udpPorts)

  // 合并结果并保留协议信息
  const result = []
  tcpRanges.forEach(port => result.push({ port, protocol: 'tcp' }))
  udpRanges.forEach(port => result.push({ port, protocol: 'udp' }))

  return result
}

export function getExPortsByContainer(mapping) {
  const externalPorts = []
  // 按逗号分割多个端口映射
  const ports = mapping.split(',').map(p => p.trim())

  ports.forEach(port => {
    // 仅匹配 0.0.0.0:XXXX->YYYY/tcp 或 0.0.0.0:XXXX->YYYY/udp
    const mappedMatch = port.match(/^0\.0\.0\.0:(\d+)->\d+\/(tcp|udp)$/)
    if (mappedMatch) {
      externalPorts.push({ port: mappedMatch[1], protocol: mappedMatch[2] })
    }
    // 忽略直接暴露的端口（如 80/tcp, 5000/tcp）和范围（如 6883-6999/tcp）
  })

  // 合并连续端口
  return parseExPorts(externalPorts)
}

export function getExPortsByContainers(mappings) {
  const result = mappings.map(mapping => {
    const externalPorts = []
    // 按逗号分割多个端口映射
    const ports = mapping.split(',').map(p => p.trim())

    ports.forEach(port => {
      // 仅匹配 0.0.0.0:XXXX->YYYY/tcp 或 0.0.0.0:XXXX->YYYY/udp
      const mappedMatch = port.match(/^0\.0\.0\.0:(\d+)->\d+\/(tcp|udp)$/)
      if (mappedMatch) {
        externalPorts.push({ port: mappedMatch[1], protocol: mappedMatch[2] })
      }
      // 忽略直接暴露的端口（如 80/tcp, 5000/tcp）和范围（如 6883-6999/tcp）
    })

    // 合并连续端口
    return parseExPorts(externalPorts)
  })

  return result
}

export function parseContainerUsage(input) {
  // 辅助函数：分离数值和单位
  const splitValueUnit = (str) => {
    const match = str.match(/^([\d.]+)(.*)$/)
    return match ? { value: parseFloat(match[1]), unit: match[2] || '' } : { value: 0, unit: '' }
  }

  // 按行分割，并去掉表头
  const lines = input.trim().split('\n').slice(1)

  // 解析每一行并转换为对象
  const containers = lines.map(line => {
    // 去掉多余空格并按空格分割
    const values = line.trim().split(/\s+/)

    return {
      containerId: values[0], // CONTAINER ID
      name: values[1], // NAME
      cpu: splitValueUnit(values[2]), // CPU % (e.g., 0.00%)
      memoryUsage: splitValueUnit(values[3]), // MEM USAGE (e.g., 5.848MiB)
      memoryLimit: splitValueUnit(values[5]), // MEM LIMIT (e.g., 31.31GiB)
      memoryPercent: splitValueUnit(values[6]), // MEM % (e.g., 0.02%)
      netIO: {
        input: splitValueUnit(values[7]), // NET I/O 输入 (e.g., 6.3kB)
        output: splitValueUnit(values[9]) // NET I/O 输出 (e.g., 2.95kB)
      },
      blockIO: {
        input: splitValueUnit(values[10]), // BLOCK I/O 输入 (e.g., 0B)
        output: splitValueUnit(values[12]) // BLOCK I/O 输出 (e.g., 4.1kB)
      },
      pids: parseInt(values[13]) // PIDS
    }
  })

  return containers
}

function mergeConsecutivePorts(ports) {
  // 按协议分开处理
  const tcpPorts = ports
    .filter(p => p.protocol === 'tcp')
    .map(p => ({ external: parseInt(p.port, 10), internal: parseInt(p.internalPort, 10) }))
    .sort((a, b) => a.external - b.external)
  const udpPorts = ports
    .filter(p => p.protocol === 'udp')
    .map(p => ({ external: parseInt(p.port, 10), internal: parseInt(p.internalPort, 10) }))
    .sort((a, b) => a.external - b.external)

  // 合并连续端口的函数
  const mergePorts = (portObjects) => {
    if (portObjects.length === 0) return []
    const ranges = []
    let start = portObjects[0].external
    let prev = start;
    let startInternal = portObjects[0].internal

    for (let i = 1; i <= portObjects.length; i++) {
      const current = portObjects[i]?.external
      const currentInternal = portObjects[i]?.internal
      if (current !== prev + 1 || i === portObjects.length || currentInternal !== prev + 1) {
        if (start === prev) {
          ranges.push({ external: start.toString(), internal: startInternal.toString() })
        } else {
          ranges.push({ external: `${start}-${prev}`, internal: `${startInternal}-${portObjects[i-1].internal}` })
        }
        start = current
        startInternal = currentInternal
      }
      prev = current
    }
    return ranges
  };

  // 合并 TCP 和 UDP 端口
  const tcpRanges = mergePorts(tcpPorts)
  const udpRanges = mergePorts(udpPorts)

  // 合并结果并保留协议信息
  const result = []
  tcpRanges.forEach(port => result.push({ external: port.external, internal: port.internal, protocol: 'tcp' }))
  udpRanges.forEach(port => result.push({ external: port.external, internal: port.internal, protocol: 'udp' }))

  return result
}

export function getPortsByContainer(mappings) {
  const result = mappings.map(mapping => {
    const externalPorts = []
    // 按逗号分割多个端口映射
    const ports = mapping.split(',').map(p => p.trim())

    ports.forEach(port => {
      // 匹配 0.0.0.0:XXXX->YYYY/tcp 或 0.0.0.0:XXXX->YYYY/udp
      const mappedMatch = port.match(/^0\.0\.0\.0:(\d+)->(\d+)\/(tcp|udp)$/)
      if (mappedMatch) {
        externalPorts.push({ port: mappedMatch[1], internalPort: mappedMatch[2], protocol: mappedMatch[3] })
      }
      // 忽略直接暴露的端口（如 80/tcp, 5000/tcp）和范围（如 6883-6999/tcp）
    })

    // 合并连续端口
    return mergeConsecutivePorts(externalPorts)
  })

  return result
}

export function parseNetstat(data) {
  const lines = data.trim().split('\n')
  const result = {}

  // 正则提取：协议、IP、端口
  const regex = /^(\w+)\s+\d+\s+\d+\s+([\d.a-fA-F:]+):(\d+)\s+/

  lines.forEach(line => {
    const match = line.trim().match(regex)
    if (match) {
      const proto = match[1] // tcp, udp...
      const ip = match[2]    // 127.0.0.1...
      const port = parseInt(match[3], 10)

      // 1. 初始化协议层 (tcp/udp)
      if (!result[proto]) {
        result[proto] = {}
      }

      // 2. 初始化 IP 层并推入端口
      if (!result[proto][ip]) {
        result[proto][ip] = []
      }

      // 避免重复端口
      if (!result[proto][ip].includes(port)) {
        result[proto][ip].push(port)
      }
    }
  })

  return result
}
