


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

export const parseDockerImages = (input) => {
  // 按行分割并移除表头
  const lines = input.trim().split('\n').slice(1)

  let id = 0
  return lines.map(line => {
    // 使用正则表达式匹配字段，处理 CREATED 字段的完整性
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
