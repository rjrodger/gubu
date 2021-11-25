import { Jsonic } from 'jsonic'


function gubu(spec?: any) {
  return function gubu<T>(src?: T): T {
    return { ...spec, ...src }
  }
}





export { gubu }


