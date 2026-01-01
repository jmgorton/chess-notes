import React, { isValidElement } from 'react';

// general purpose helper functions
// not specific to chess or react game state

export const isArgumentStringArray = (arg: any): boolean => {
    if (!Array.isArray(arg)) return false;
    return arg.every(element => typeof element === 'string');
}

// TODO test this ... 
export function isArgumentArrayOfType<T>(arg: any, type: T): boolean {
    if (!Array.isArray(arg)) return false;
    // return arg.every(element => element instanceof type);
    return arg.every(element => typeof element === type);
}

export function isArgumentDictionary(arg: any): arg is Record<string, unknown> {
    if (arg === null) return false; // typeof null === 'object' 
    if (typeof arg !== 'object') return false;
    // functions and arrays are also object types in TS bc they have properties and methods 
    // common types of objects: literal types, interfaces, type aliases, general object types 
    // special type object refers to any non-primitive type (string, number, bigint, boolean, symbol, null, undefined)
    // utility types: Partial<T> (all properties optional), Required<T> (all properties required),
    //   Pick<T, K> (selects subset of properties), Record<K, T> (object w specified key-value types) 
    if (Array.isArray(arg)) return false; 
    return true;
}

export const isArgumentReactComponent = (arg: any): boolean => {
    const argPrototype: any | null = Object.getPrototypeOf(arg);
    // arg.prototype instanceof React.Component === false // TODO research prototypes more 
    if (!argPrototype) {
        console.log(`Arg ${arg} has no prototype property.`);
    }
    if (argPrototype instanceof React.Component) {
        // try {
        //     (argPrototype as React.Component<GameProps, GameState>)
        // } catch (error) {
        //     console.error(error);
        // }
        return true;
    }
     if (isValidElement(arg) || isValidElement(argPrototype)) {
        console.log(`${argPrototype || arg} is a valid React element.`);
    }
    return false;
}

// not possible at runtime ?? 
// export function isReactComponentOfType<P, S>(arg: React.Component<P, S>, type: ) {

// }

export function interleave<T, U>(arr1: T[], arr2: U[]): (T | U)[] {
    const interleavedArray: (T | U)[] = [];
    const minLength = Math.min(arr1.length, arr2.length);

    // Interleave while both arrays have elements
    for (let i = 0; i < minLength; i++) {
        interleavedArray.push(arr1[i], arr2[i]);
    }

    // Append any remaining elements from the longer array
    if (arr1.length > arr2.length) {
        interleavedArray.push(...arr1.slice(minLength));
    } else if (arr2.length > arr1.length) {
        interleavedArray.push(...arr2.slice(minLength));
    }

    return interleavedArray;
}
