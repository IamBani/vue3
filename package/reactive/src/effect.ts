import { hasChanged, isArray, isObject } from "@vue/shared";
import { TriggerOrTypes } from "@vue/shared";


type EffectScheduler =(...args:any[])=>any

export function effect(fn, option: any = {}) {
  const reactiveEffect = new ReactiveEffect(fn);
  reactiveEffect.run()
  // if (!option.lazy) {
  //   createEffectFn();
  // }
  function run() {
    reactiveEffect.run();
  }
  run.effect = reactiveEffect
  return run
   
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

export function clearEffect(effect) {
  const deps = effect.deps
  deps.forEach(item => {
    item.delete(effect)
  })
}
export class ReactiveEffect {
  id = uid++;
  active = true;
  private isEffect = true;
  deps = [];
  constructor(public fn, public scheduler?: EffectScheduler | null) {}
  run() {
    if (!this.active) {
      return this.fn();
    }
    if (!effectStack.includes(this)) {
      try {
        effectStack.push((activeEffect = this));
        return this.fn();
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  }
  stop() {
    if (this.active) {
      clearEffect(this);
      this.active = false;
    }
  }
}
const targetMap = new WeakMap();
export function isTracking() {
  return activeEffect === undefined
}
export function track(target, type, key) {
    if(isTracking())return
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target,(depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Set()));
    }
    trackEffects(dep)
} 
export function trackEffects(dep) {
    if (!dep.has(activeEffect)) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
    }
};
export function trigger(target, type, key, value?, oldValue?) {
  // console.log(target, type, key, value, oldValue)
  console.log(targetMap, target, value, key);
  let depsMap = targetMap.get(target)
  if (!depsMap || !hasChanged(value, oldValue)) return
  let effects = new Set()
  const addEffects = (effect) => {
    effect.forEach(item => {
      effects.add(item)
    })
  };
 
  if (key === 'length' && isArray(target)) {
    depsMap.forEach((element, key) => {
      if (key === 'length') {
        addEffects(element);
      }
    });
  } else if (isObject(target) && depsMap.get(key)) {
    addEffects(depsMap.get(key));
  } else {
    switch (type) {
      case TriggerOrTypes.ADD:
        if (isArray(target) && key > target.length) {
          addEffects(depsMap.get('length'))
        }
        break;
    }
  }
  triggerEffects(effects);
}


export function triggerEffects(deps) {
  deps.forEach((item: any) => {
    if (item.scheduler) {
      return item.scheduler();
    }
    item.run();
  });
}