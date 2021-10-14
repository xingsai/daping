/**
 * @desc   深度拷贝数组对象
 * @param  {Any} values  必填
 */
 export function deepCopy(values) {
    let copy;
    if (null == values || "object" != typeof values) return values;
    if (values instanceof Date) {
        copy = new Date();
        copy.setTime(values.getTime());
        return copy;
    }
    if (values instanceof Array) {
        copy = [];
        for (let i = 0, len = values.length; i < len; i++) {
            copy[i] = deepCopy(values[i]);
        }
        return copy;
    }
    if (values instanceof Object) {
        copy = {};
        for (let attr in values) {
            if (values.hasOwnProperty(attr)) copy[attr] = deepCopy(values[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy values! Its type isn't supported.");
}