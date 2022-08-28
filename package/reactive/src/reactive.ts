// import { UnwrapRefSimple, Ref } from "./ref";

import { isObject } from "package/shared/src";
import { mutableHandlers, readonlyHandlers, shallowReactiveHandlers, shallowReadonlyHandlers } from "./baseHandles";




// export type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRefSimple<T>;

// export function reactive<T extends object>(target: T): UnwrapNestedRefs<T>;

export function reactive(target) {
  return createReactiveObject(target, false, mutableHandlers);
}

export function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers);
}

export function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers);
}

export function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyHandlers);
}
const reactiveMap = new WeakMap()
const readonlyMap = new WeakMap();

export function createReactiveObject(target, isReadonly, baseHandles) {
  if (!isObject(target)) {
    return target
  }
  const proxyMap = isReadonly?readonlyMap:reactiveMap
  if (proxyMap.get(target)) {
    return proxyMap.get(target)
  }
  const proxy = new Proxy(target, baseHandles)

  proxyMap.set(target,proxy)
  return proxy
}
