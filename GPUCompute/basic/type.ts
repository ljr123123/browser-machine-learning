export type BinaryArray = Float32Array | Uint32Array | Int32Array;
export enum DataType {
    float32 = 1 << 0,
    int32 = 1 << 1,
    uint32 = 1 << 2
}
export enum BufferUsage {
    STORAGE_FROM_CPU = GPUBufferUsage.COPY_SRC | GPUBufferUsage.STORAGE | GPUBufferUsage.MAP_WRITE,
    STATIC = GPUBufferUsage.COPY_SRC | GPUBufferUsage.UNIFORM | GPUBufferUsage.MAP_WRITE,
    STORAGE_FROM_GPU = GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC | GPUBufferUsage.STORAGE
}
export enum DataSource {
    CPU = 0,
    GPU = 1
}
export enum DataByte {
    float32 = 4,
    int32 = 4,
    uint32 = 4
}

export function JSArrayToBinaryArray(array:number[], type?:DataType):BinaryArray {
    if(type == undefined) type = DataType.float32;
    switch(type) {
        case DataType.float32: return new Float32Array(array);
        case DataType.int32: return new Int32Array(array);
        case DataType.uint32: return new Uint32Array(array);
        default: throw new Error("type illegal.")
    }
}



export function ArrayBufferToBinaryArray(array:ArrayBuffer, type:DataType):BinaryArray{
    switch(type) {
        case DataType.float32: return new Float32Array(array);
        case DataType.int32: return new Int32Array(array);
        case DataType.uint32: return new Uint32Array(array);
        default: throw new Error("type illegal.")
    }
}