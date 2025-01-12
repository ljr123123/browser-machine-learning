import { BufferGroup, UniformBuffer } from "./buffer";

interface StaticCompute {
    name:string;
    buffer:UniformBuffer;
    binding?:number;
}

interface StorageCompute {
    name:string;
    group:BufferGroup;
    binding?:number;
}

interface GPUBindGroupCompose {
    storage:GPUBindGroup;
    static:GPUBindGroup;
}


interface ComputeNodeDescriptor {
    mainWGSL:string;
    staticGroups:StaticCompute[];
    storageGroups:StorageCompute[];
    globalId?:boolean;
    localId?:boolean;
    index?:boolean;
}

class ComputeNode {
    pipeline:GPUComputePipeline;
    staticComputes:StaticCompute[];
    storageComputes:StorageCompute[];
    bindGroups:GPUBindGroupCompose[];

    constructor() {
        this.bindGroups = [];
        this.pipeline = 
    }
}