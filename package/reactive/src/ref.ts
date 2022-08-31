import { hasChanged, isArray, isObject } from 'package/shared/src'
import { TrackOptypes, TriggerOrTypes } from 'package/shared/src/operators'
import { track, trigger } from './effect'
import { reactive } from './reactive'

declare const RefSymbol: unique symbol

export interface Ref<T = any> {
  value: T
  /**
   * Type differentiator only.
   * We need this to be in public d.ts but don't want it to show up in IDE
   * autocomplete, so we use a private Symbol instead.
   */
  [RefSymbol]: true
}

// export type UnwrapRefSimple<T> = T extends
//   | Function
//   | CollectionTypes
//   | BaseTypes
//   | Ref
//   | RefUnwrapBailTypes[keyof RefUnwrapBailTypes]
//   ? T
//   : T extends Array<any>
//   ? { [K in keyof T]: UnwrapRefSimple<T[K]> }
//   : T extends object & { [ShallowReactiveMarker]?: never }
//   ? {
//       [P in keyof T]: P extends symbol ? T[P] : UnwrapRef<T[P]>;
//     }
//   : T;

export function ref(value) {
  return createRef(value)
}

export function showRef(value) {
  return createRef(value, true)
}

function createRef(value, shallow = false) {
  return new RefImpl(value, shallow)
}
const convert = (value) => (isObject(value) ? reactive(value) : value)
class RefImpl {
  public _value
  public __v_isRef = true
  constructor(public rawValue, public shallow) {
    this._value = shallow ? rawValue : convert(rawValue)
  }
  get value() {
    track(this, TrackOptypes.GET, 'value')
    return this._value
  }
  set value(newValue) {
    if (hasChanged(newValue, this.rawValue)) {
      this.rawValue = newValue
      this._value = this.shallow ? newValue : convert(newValue)
      trigger(this, TriggerOrTypes.SET, 'value', newValue)
    }
  }
}

export function toRef(target, key) {
  return new ObjectRefImpl(target, key)
}

class ObjectRefImpl {
  public __v_isRef = true
  constructor(public target, public key) {}
  get value() {
    return this.target[this.key]
  }
  set value(newValue) {
    this.target[this.key] = newValue
  }
}

export function toRefs(object) {
  const ret = isArray(object) ? new Array(object.length) : {}
  for (const key in object) {
    ret[key] = toRef(object, key)
  }
  return ret
}
