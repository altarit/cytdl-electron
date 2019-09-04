/* tslint:disable:no-console */
export function log(...args: any) {
  console.log.apply(Object, args)
}

export function error(...args: any) {
  console.error.apply(Object, args)
}
