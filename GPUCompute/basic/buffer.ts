import { device } from "./device";

interface BufferDescriptor {
    usage:GPUFlagsConstant;
}

export class Buffer {
    buffer:GPUBuffer | undefined;
    usage:undefined;
    constructor() {}
    init(size:number) {

    }
}

export class UniformBuffer extends Buffer{
    buffer:GPUBuffer;
    constructor(size:number) {
        super();
        this.buffer = device.createBuffer({
            size:size,
            usage:GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        })
    }
}

export class StorageBuffer extends Buffer{
    constructor() {
        super();
    }
    init(size:number) {
        this.buffer = device.createBuffer({
            size:size,
            usage:GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
        });
    }
}

export class BufferGroup {

}