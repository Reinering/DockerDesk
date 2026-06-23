

export async function ping(url, timeout = 5000) {
  const start = Date.now()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    // 使用 no-cors + 小资源，错误更少
    const response = await fetch(url, {
      mode: 'no-cors',      // 关键：大幅减少跨域错误
      cache: 'no-cache',
      signal: controller.signal
    })

    // 能走到这里就代表能连通（opaque response）
    return { success: true, time: Date.now() - start }

  } catch (err) {
    return { success: false, time: -1 }
  } finally {
    clearTimeout(timer)
  }
}

