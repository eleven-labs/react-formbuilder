import React from 'react';
import { toPath, isEqual, cloneDeep } from 'lodash';
import { cpus } from 'os';

/**
 * Deeply get a value from an object via it's path.
 */
export const getIn = (obj, key, def, p = 0) => {
    const path = toPath(key);
    while (obj && p < path.length) {
        obj = obj[path[p++]];
    }
    return obj === undefined ? def : obj;
}

/**
 * Deeply set a value from in object via it's path.
 */
export const setIn = (obj, path, value) => {
    let res = {};
    let resVal = res;
    let i = 0;
    let pathArray = toPath(path);

    for (; i < pathArray.length - 1; i++) {
        const currentPath = pathArray[i];
        let currentObj = getIn(obj, pathArray.slice(0, i + 1));

        if (resVal[currentPath]) {
            resVal = resVal[currentPath];
        } else if (currentObj) {
            resVal = resVal[currentPath] = cloneDeep(currentObj);
        } else {
            const nextPath = pathArray[i + 1];
            resVal = resVal[currentPath] =
                isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
        }
    }

    if (value === undefined) {
        delete resVal[pathArray[i]];
    } else {
        resVal[pathArray[i]] = value;
    }

    const result = { ...obj, ...res };

    // If the path array has a single element, the loop did not run.
    // Deleting on `resVal` had no effect in this scenario, so we delete on the result instead.
    if (i === 0 && value === undefined) {
        delete result[pathArray[i]];
    }

    return result;
}

/**
 * Does a React component have exactly 0 children
 */
export const isEmptyChildren = (children) => React.Children.count(children) === 0;

/**
 * The given object a Function
 */
export const isFunction = (obj) => typeof obj === 'function';

/**
 * Is the given object an integer
 */
export const isInteger = (obj) => String(Math.floor(Number(obj))) === obj;

/**
 * The arrays is the same
 */
export const isSameArrays = (array1 = [], array2 = []) => isEqual(array1.sort(), array2.sort());