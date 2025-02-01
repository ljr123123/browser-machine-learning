import { StaticBuffer, StorageBufferGroup } from "./buffer";
import { pipelineAndBindGroupsEncode } from "./command";
import { device } from "./device";
import { setting } from "./global";
import { getPipelineCompose, PipelineCompose } from "./pipeline";
import { BinaryArray, DataType } from "./type";

interface BufferInit {
    byteLength:number;
    type:DataType;
    data:BinaryArray;
}

interface ComputeNodeDescriptor {
    pipelineLabel:string;
    storages:StorageBufferGroup[];
    statics?:BufferInit[];
    globalStatic?:boolean;
}

export class ComputeNode {
    protected label:string;
    protected storages:StorageBufferGroup[];
    protected statics:StaticBuffer[];
    protected pipelineCompose?:PipelineCompose;
    protected staticBindGroup?:GPUBindGroup;
    protected storageBindGroups:GPUBindGroup[];
    protected renderBundle?:GPURenderBundle;
    protected dispatchWorkgroup_x:number;
    protected dispatchWorkgroup_y:number;
    protected dispatchWorkgroup_z:number;
    protected inits?:BufferInit[];
    protected globalStatic?:boolean;
    constructor(
        {
            pipelineLabel,
            storages,
            statics,
            globalStatic
        }:ComputeNodeDescriptor
    ){
        this.label = pipelineLabel;
        this.inits = statics;
        this.globalStatic = globalStatic;
        this.storages = storages;
        this.storageBindGroups = [];
        this.statics = [];
        this.dispatchWorkgroup_z = 1;
        this.dispatchWorkgroup_y = 1;
        this.dispatchWorkgroup_x = 1;
    }
    protected async staticBindGroupInit(inits:BufferInit[], globalStatic:StaticBuffer[] = []){
        if(!this.pipelineCompose) throw new Error("pipelineCompose not initialize.")
        if(!this.pipelineCompose.staticBindGroupLayout) throw new Error("staticBindGroupLayout not defined.");
        inits.forEach(element => {
            const newBuffer = new StaticBuffer(element.type, element.byteLength, element.data);
            this.statics.push(newBuffer);
        });
        const staticCombine = this.statics.concat(globalStatic);
        this.staticBindGroup = device.createBindGroup({
            layout:this.pipelineCompose.staticBindGroupLayout,
            entries:staticCombine.map((element, index) => {
                return {
                    binding:index,
                    resource:{
                        buffer:element.getBuffer()
                    }
                }
            })
        });
    }
    public async storageBindGroupsInit(storageData:Array<any>) {
        // 需要自行编写
        // 主要包括malloc内存分配
        // 以及StorageBindGroup该怎么创建的问题
        // 还有dispatchWorkgroups(x,y,z)
    }
    public async encode(
        storageData:Array<any>
    ):Promise<GPUCommandBuffer[]> {
        const pipelineCompose = await getPipelineCompose(this.label);
        this.pipelineCompose = pipelineCompose;
        if(!this.pipelineCompose) throw new Error("pipelineCompose error.")
        if(this.inits) this.staticBindGroupInit(this.inits, this.globalStatic);
        this.storageBindGroupsInit(storageData);
        return this.storageBindGroups.map(element => {
            return pipelineAndBindGroupsEncode(
                pipelineCompose.pipeline,
                this.staticBindGroup?[element, this.staticBindGroup]:[element],
                this.dispatchWorkgroup_x,
                this.dispatchWorkgroup_y,
                this.dispatchWorkgroup_z
            )
        })
    }
}