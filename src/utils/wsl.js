


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
