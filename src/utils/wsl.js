


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

export const parsePullDockerImages = (input) => {
  // 按行分割并移除表头
  const lines = input.trim().split('\n').slice(1)

  return lines.map(line => {
    // 使用正则表达式匹配字段，优化处理 DESCRIPTION 和 OFFICIAL
    const match = line.match(/(\S+(?:\/\S+)*)\s+(.+?)\s+(\d+)\s*(\[?\w*\]?)?$/)
    if (!match) return null; // 如果解析失败，返回 null

    const [, name, description, stars, official = ''] = match

    return {
      name,
      description: description.trim(),
      stars: Number(stars),
      official: official.replace(/[[\]]/g, '')
    }
  }).filter(item => item !== null) // 过滤掉无效行
}
