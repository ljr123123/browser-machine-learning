import { StorageBufferGroup } from "../basic/buffer";
import { DataSource, DataType } from "../basic/type";

export class Tensor {
    protected shape:number[];
    protected subShape:number[];
    protected batchSize:number;
    protected storageGroup:StorageBufferGroup;
    protected type:DataType;
    constructor(subShape:number[], batchSize:number, type:DataType, source?:DataSource){
        this.shape = [batchSize, ...subShape];
        this.subShape = subShape;
        this.batchSize = batchSize;
        this.type = type;
        if(source == undefined) source = DataSource.CPU;
        this.storageGroup = new StorageBufferGroup(type, source);
    }
    public getShape() { return this.shape; }
    public getBatchSize() { return this.batchSize; }
    public getType() { return this.type; }
    public getStorage() { return this.storageGroup; }
    public getSubShape() { return this.subShape; }
    public changeType(type:DataType):void {
        this.type = type;
        // 接下来还有对缓存区进行的操作没写

    }
    public copy():Tensor {
        const newTensor = new Tensor(this.subShape, this.batchSize, this.type, DataSource.GPU);
        // 还有一个copy的操作没写，估计要涉及到ComputeNode

        return newTensor;
    }
    public view(a:number, b:number):Tensor {

    }
}