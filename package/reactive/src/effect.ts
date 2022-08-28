import { isArray, isObject } from "package/shared/src";

export function effect(fn, option: any = {}) {
  const createEffectFn = createReactiveEffect(fn, option);

  if (!option.lazy) {
    createEffectFn();
  }
  return createEffectFn;
}
let uid = 0;
let activeEffect;
const effectStack = [];
function createReactiveEffect(fn, option) {
  const effect = function reactiveEffect() {
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect);
        activeEffect = effect;
        return fn();
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };
  effect.id = uid++;
  effect._isEffect = true;
  effect.raw = fn;
  effect.option = option;
  return effect;
}
const targetMap = new WeakMap();
export function track(target, type, key) {
    if (activeEffect === undefined) {
      return;
    }
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target,(depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key,(dep = new Set()))
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect)
    }
}
export function trigger(target, type, key, value?, oldValue?) {
    // console.log(target, type, key, value, oldValue)
  console.log(targetMap, target, value, key);
  let effects = new Set()
  const addEffects = (effect) => {
    effect.forEach(item => {
      effects.add(item)
    })
  };
  let depsMap = targetMap.get(target)
  if (!depsMap) return
  if (key === 'length' && isArray(target)) {
    depsMap.forEach((element,key) => {
      if (key === 'length') {
        addEffects(element);
      }
    });
  } else if (isObject(target) && depsMap.get(key)) {
    addEffects(depsMap.get(key));
  } else {
    
  }
  effects.forEach((item:Function)=>item())
}