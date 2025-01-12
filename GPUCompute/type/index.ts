export type BinaryArray = Float32Array | Int32Array | Uint32Array;
export enum DataType {
    float32 = 1 << 0,
    int32 = 1 << 1,
    uint32 = 1 << 2
}