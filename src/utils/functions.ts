// general purpose helper functions
// not specific to chess or react game state

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
