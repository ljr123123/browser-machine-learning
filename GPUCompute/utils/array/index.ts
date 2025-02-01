export function flatTo2D<T>(array:T[], shape:number[]) {
    return array.flat(shape.length - 2);
}

export function arrayCompare<T>(x:T[], y:T[]) {
    return x.length == y.length &&
    x.every((value, index) => value === y[index]);
}