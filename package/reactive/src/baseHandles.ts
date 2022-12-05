import { hasChanged, hasOwn, isArray, isIntegerKey, isObject } from "@vue/shared";
import { TrackOptypes, TriggerOrTypes } from "@vue/shared";
import { track, trigger } from "./effect";
import { reactive, readonly } from "./reactive";

const get = createGetter()
const shallowGet = createGetter(false,true);
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true,true);

const set = createSetter();
const shallowSet = createSetter(true);


function createGetter(isReadonly = false,shallow = false) {
    return function get(target, key) {
        const res = Reflect.get(target, key)
        if (!isReadonly) {
            track(target,TrackOptypes.GET,key)
        }
        if (shallow) {
            return res
        }
        if (isObject(res)) {
            return isReadonly?readonly(res):reactive(res)
        }
        return res
    }
}

function createSetter(shallow = false) {
    return function set(target,key,value) {
        const oldValue = target[key]
        let hadKey = isArray(target) && isIntegerKey(key)?Number(key)<target.length:hasOwn(target,key)
        const result = Reflect.set(target, key, value)
        
        if (hadKey && hasChanged(oldValue,value)) {
          //修改
           trigger(target,TriggerOrTypes.SET,key,value,oldValue);
        } else {
          //新增
            trigger(target,TriggerOrTypes.ADD,key,value)
        }

        return result
    }
}
export const mutableHandlers = {
  get,
  set,
};
export const shallowReactiveHandlers = {
    get: shallowGet,
    set:shallowSet
}; 
export const readonlyHandlers = {
    get: readonlyGet,
    set(target,key) {
        console.warn(`${key} is readonly`)
    }
};
export const shallowReadonlyHandlers = {
  get: shallowReadonlyGet,
    set(target, key) {
    console.warn(`${key} is readonly`);
  },
};
