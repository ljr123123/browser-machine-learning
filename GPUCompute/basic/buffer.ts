import { flatTo2D } from "../utils/array";
import { copyBufferToBufferEncode } from "./command";
import { device } from "./device";
import { ArrayBufferToBinaryArray, BinaryArray, BufferUsage, DataSource, DataType, JSArrayToBinaryArray } from "./type";

export function declareGlobal(key:string, value:BinaryArray, type:DataType) {
    const newBuffer = new StaticBuffer(type, value.byteLength, value);
    globalBufferPool.set(key, newBuffer);
}

export function getGlobal(key:string) {
    const buffer = globalBufferPool.get(key);
    if(!buffer) throw new Error("global Buffer not define.");
    return buffer;
}

const globalBufferPool = new Map<string, StaticBuffer>();

export class Buffer {
    protected buffer?: GPUBuffer;
    protected type: DataType;
    protected usage: GPUBufferUsageFlags;
    protected source: DataSource;
    constructor(type: DataType, usage: BufferUsage, source: DataSource) {
        this.type = type;
        this.usage = usage;
        this.source = source;
    }
    public free() {
        if(this.buffer) this.buffer.destroy();
        else throw new Error("nothing to free.")
        this.buffer = undefined;
    }
    public getBuffer(init?:boolean): GPUBuffer {
        if (this.buffer) return this.buffer;
        else throw new Error("buffer not initialize.")
    }

    protected copy():Buffer {

    }
    protected malloc(byteLength: number) {
        this.buffer = device.createBuffer({
            size: byteLength,
            usage: this.usage,
            mappedAtCreation: this.source == DataSource.CPU
        });
    }
    protected mapWrite(data: BinaryArray) {
        if (this.buffer) {
            const typedArray = this.buffer.getMappedRange();
            const binaryArray = ArrayBufferToBinaryArray(typedArray, this.type);
            binaryArray.set(data);
            this.buffer.unmap();
        }
        else throw new Error("buffer not initialize.");
    }
    protected deviceWrite(data: BinaryArray) {
        if (this.buffer) {
            device.queue.writeBuffer(this.buffer, 0, data);
        }
        else throw new Error("buffer not initialize.");
    }
    protected copyWrite(buffer: Buffer):GPUCommandBuffer {
        if (this.buffer) {
            return copyBufferToBufferEncode(buffer, this);
        }
        else throw new Error("buffer not initialize.");
    }
}

export class StaticBuffer extends Buffer {
    protected buffer: GPUBuffer;
    constructor(type: DataType, byteLength: number, data: BinaryArray) {
        super(type, BufferUsage.STATIC, DataSource.CPU);
        this.buffer = device.createBuffer({
            size: byteLength,
            usage: this.usage,
            mappedAtCreation: true
        });
        this.mapWrite(data);
    }
}

export class StorageBuffer extends Buffer {
    constructor(type: DataType, source: DataSource) {
        super(
            type,
            source == DataSource.CPU ? BufferUsage.STORAGE_FROM_CPU : BufferUsage.STORAGE_FROM_GPU,
            source
        );
    }
    public mapWrite(data: BinaryArray): void {
        if (this.source == DataSource.GPU) throw new Error("this buffer needs initialize from CPU.");
        super.mapWrite(data);
    }
    public deviceWrite(data: BinaryArray): void {
        super.deviceWrite(data);
    }
    public copyWrite(buffer: Buffer): GPUCommandBuffer {
        if (this.source == DataSource.CPU) throw new Error("this buffer needs initialize from GPU.");
        return super.copyWrite(buffer);
    }
    public malloc(byteLength: number): void {
        super.malloc(byteLength);
    }

    // 调试用的，平时估计用不到
    public getSource(): string {
        return this.source == DataSource.CPU ? "CPU" : "GPU";
    }
    public copy():Buffer {
        return super.copy();
    }
}

export class StorageBufferGroup {
    protected keep:number;
    protected shape: number[];
    protected type: DataType;
    protected subGroup?: StorageBufferGroup[];
    protected buffer?: StorageBuffer;
    protected source: DataSource;
    constructor(type: DataType, source: DataSource) {
        // keep 表示单步计算时，是否需要保存维持缓存
        this.keep = 0;
        this.shape = [];
        this.type = type;
        this.source = source;
    }
    public malloc(shape: number[], source: DataSource): void {
        this.shape = shape;
        if (shape.length == 1) {
            this.buffer = new StorageBuffer(this.type, source);
            this.buffer.malloc(shape[0] * 4);
            return;
        }
        this.subGroup = [];
        for (let i = 0; i < shape[0]; i++) {
            const newGroup = new StorageBufferGroup(this.type, this.source);
            newGroup.malloc(shape.slice(1), source);
            this.subGroup.push(newGroup);
        }
    }
    public mapWrite(data: BinaryArray[] | BinaryArray): void {
        if (data instanceof Array) {
            if (!this.subGroup) throw new Error("subGroup not initialize.")
            for (let i = 0; i < this.subGroup.length; i++) {
                this.subGroup[i].mapWrite(data[i]);
            }
        }
        else if (this.buffer) {
            this.buffer.mapWrite(data);
        }
        else throw new Error("buffer not initialize.")
    }
    public copyWrite(bufferGroup: StorageBufferGroup):GPUCommandBuffer[]  {
        const commandBuffers:GPUCommandBuffer[] = [];
        if (bufferGroup.buffer) {
            if (!this.buffer) throw new Error("buffer not initialize.")
            commandBuffers.push(this.buffer.copyWrite(bufferGroup.buffer));
        }
        else if (this.subGroup && bufferGroup.subGroup) {
            for (let i = 0; i < this.subGroup.length; i++) {
                commandBuffers.concat(this.subGroup[i].copyWrite(bufferGroup.subGroup[i]));
            }
        }
        else throw new Error("Error.");
        return commandBuffers;
    }
    public free(): void {
        if(this.subGroup) {
            for(let i = 0; i < this.subGroup.length; i++) {
                this.subGroup[i].free();
            }
        }
        else if(this.buffer) this.buffer.free();
        else throw new Error("nothing to free.")
    }
    public getSource(): string {
        return this.source == DataSource.CPU ? "CPU" : "GPU";
    }
    public copy():GPUComputeGroup {
        
    }
}