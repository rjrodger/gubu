import { Jsonic } from 'jsonic'


function make(spec?: any) {
  return function gubu<T>(src?: T): T {
    return { ...spec, ...src }
  }
}


function Required(term?: any) { }

function Optional(term?: any) { }

function Custom(handler?: any) { }


Object.assign(make, {
  Required,
  Optional,
  Custom,
})


type Gubu = typeof make & {
  Required: typeof Required,
  Optional: typeof Optional,
  Custom: typeof Custom,
}

Object.defineProperty(make, 'name', { value: 'gubu' })

const gubu: Gubu = (make as Gubu)

export { gubu, Required, Optional, Custom }


