
const isObject = val => typeof val === 'object' && val !== null

const isNumber = val => typeof val === 'number'
const isString = val => typeof val === 'string'
const isBoolean = (val) => typeof val === "boolean";
const isFunction = val => typeof val ==='function'
const isArray = val => Array.isArray(val)
const isIntegerKey = key => parseInt(key) + '' === key
const hasOwn = (target = {}, key) => target.hasOwnProperty(key);
const hasChanged = (oldValue, value) => {
    if (isNaN(oldValue) || isNaN(value)){
        return false
    }
    return oldValue !== value
}
export {
    isObject,
    isNumber,
    isString,
    isArray,
    isBoolean,
    isFunction,
    isIntegerKey,
    hasOwn,
    hasChanged
}


