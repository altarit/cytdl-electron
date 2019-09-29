const {Readable, Writable} = require('stream')

export function mockFsExtra() {
  jest.doMock('fs-extra', () => new Object({
    existsSync: (path) => {
      console.log(`Invoked existsSync(${path})`)
      return false
    },
    mkdirSync: (path) => {
      console.log(`Invoked mkdirSync(${path})`)
    },
    createWriteStream: (path) => {
      console.log(`Invoked createWriteStream(${path})`)
      return new Writable({
        write(chunk) {
          console.log('fs.write: ')
          console.log(chunk)
        }
      })
    },
    copy: (inFilePath, outFilePath) => {
      console.log(`fs.copy(${inFilePath} ${outFilePath})`)
      return Promise.resolve()
    }
  }))
}

export default {
  mockFsExtra
}
