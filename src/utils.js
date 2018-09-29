import React from 'react';
import { toPath, isEqual } from 'lodash';

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
 * Does a React component have exactly 0 children
 */
export const isEmptyChildren = (children) => React.Children.count(children) === 0;

/**
 * The given object a Function
 */
export const isFunction = (obj) => typeof obj === 'function';

/**
 * The arrays is the same
 */
export const isSameArrays = (array1 = [], array2 = []) =>isEqual(array1.sort(), array2.sort());