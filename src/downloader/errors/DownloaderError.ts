export default class DownloaderError extends Error {
  public statusText: string

  constructor(message: string, statusText: string) {
    super(message)
    this.statusText = statusText
  }
}
