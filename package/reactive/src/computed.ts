import { isFunction } from "@vue/shared";
import { isTracking, ReactiveEffect, trackEffects, triggerEffects } from "./effect";

export function computed(getterOrOptions) {
  const onlyGetter = isFunction(getterOrOptions);
  let getter, setter;
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {};
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
 return new ComputedRefImpl(getter,setter)
}

class ComputedRefImpl {
  dep;
  _dirty = true;
  __v_isRef = true;
  _value;
  effect;
  constructor(public getter, public setter) {
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerEffects(this.dep)
      }
    });
  }
  get value() {
    if (!isTracking()) {
        trackEffects(this.dep || (this.dep = new Set()))
    }
    if (this._dirty) {
      this._value = this.effect.run(); 
      this._dirty = false 
    }
      return this._value;
  }
  set value(newValue) {
    this.setter(newValue);
  }
}
