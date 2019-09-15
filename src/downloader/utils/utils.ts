const fs = window.require('fs-extra')

export function pad(s: string | number, len: number = 2, filler: string = '0'): string {
  return (new Array(len + 1).join(filler) + s).slice(-len)
}

export function mapFormats(formats: any[]) {
  return formats.map((el: any) => {
    return {
      filesize: el.filesize,
      ext: el.ext,
      format_id: el.format_id,
      format: el.format,
      format_note: el.format_note,
    }
  })
}

export function mkdirs(root: string, ...dirs: string[]): string {
  if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  let current = root
  for (const dir of dirs) {
    current = current + '/' + dir
    if (!fs.existsSync(current)) {
      fs.mkdirSync(current)
    }
  }

  return current
}

export function generateDateId(): string {
  const requestIdStringPart = Math.random()
    .toString(36)
    .substring(2, 6)
  const now = new Date()
  return (
    `${pad(now.getMonth())}.${pad(now.getDate())}-` +
    `${pad(now.getHours())}.${pad(now.getMinutes())}.${pad(now.getSeconds())}-` +
    `${pad(now.getMilliseconds(), 3)}-${requestIdStringPart}`
  )
}

export function encodeDangerousFilePath(oldPath: any): string {
  if (typeof oldPath !== 'string') {
    throw new TypeError(`Path is not a string.`)
  }

  return oldPath.replace(/[\\/:?"*<>|]/g, `_`)
}
