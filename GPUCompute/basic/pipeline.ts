import { device } from "./device";
import { DataType } from "./type";

export interface PipelineCompose {
    label:string;
    staticBindGroupLayout?:GPUBindGroupLayout;
    storageBindGroupLayout:GPUBindGroupLayout;
    pipeline:GPUComputePipeline;
}

const pipelineComposePool = new Map<string, PipelineCompose>();

export async function getPipelineCompose(label:string):Promise<PipelineCompose> {
    let pipelineCompose = pipelineComposePool.get(label);
    if(!pipelineCompose) {
        const pipelineLayout = await getPipelineDescriptor(label);
        const storageBindGroupLayout = device.createBindGroupLayout({
            entries:pipelineLayout.storageInfoEntries.map((entry, index) => {
                return {
                    binding:index,
                    buffer:{type:"storage"},
                    visibility:GPUShaderStage.COMPUTE
                }
            })
        });
        const staticBindGroupLayout = 
        pipelineLayout.storageInfoEntries ? 
        device.createBindGroupLayout({
            entries:pipelineLayout.staticInfoEntries.map((entry, index) => {
                return {
                    binding:index,
                    buffer:{type:"uniform"},
                    visibility:GPUShaderStage.COMPUTE
                }
            })
        })
        : undefined;
        const shader = device.createShaderModule({
            code:WGSLEncode(pipelineLayout)
        });
        const array = [];
        array.push(storageBindGroupLayout);
        if(staticBindGroupLayout) array.push(staticBindGroupLayout);
        const computePipelineLayout = device.createPipelineLayout({
            bindGroupLayouts:array
        });
        const pipeline = await device.createComputePipelineAsync({
            layout:computePipelineLayout,
            compute:{
                module:shader,
                entryPoint:"main"
            }
        });
        pipelineCompose = {
            label:label,
            pipeline:pipeline,
            staticBindGroupLayout:staticBindGroupLayout,
            storageBindGroupLayout:storageBindGroupLayout
        };
        pipelineComposePool.set(label, pipelineCompose);
    }
    return pipelineCompose;
}

interface StorageInfoEntry {
    label:string;
    type:DataType;
}

interface StaticInfoEntry {
    label:string;
    type:DataType;
}

interface OtherFunctionEntry {
    label:string;
    content:string;
}

interface globalIdEntry {
    label:string;
}

interface localIdEntry {
    label:string;
    binding:number;
}

export interface PipelineDescriptor {
    label:string;
    storageInfoEntries:StorageInfoEntry[];
    staticInfoEntries:StaticInfoEntry[];
    main:string;
    otherFunctionEntries:OtherFunctionEntry[];
    globalId?:globalIdEntry;
    localId?:localIdEntry;
    workgroup_size_x?:number;
    workgroup_size_y?:number;
    workgroup_size_z?:number;
}

async function getPipelineDescriptor(label:string):Promise<PipelineDescriptor> {
    const layout = pipelineDescriptorPool.get(label);
    if(layout) return layout;
    else {
        try {
            const module = await import(`../pipeline/${label}`);
            return module.default;
        }
        catch {
            throw new Error(`pipeline(${label})'s descriptor not defined, before get descriptor, please use setCustomPipelineDescriptor() to register.`)
        }
    } 
}

const pipelineDescriptorPool = new Map<string, PipelineDescriptor>(); 

export function setCustomPipelineDescriptor(layout:PipelineDescriptor):void{
    pipelineDescriptorPool.set(layout.label, layout);
}
function WGSLEncode({
    storageInfoEntries,
    staticInfoEntries,
    otherFunctionEntries,
    globalId,
    localId,
    main,
    workgroup_size_x,
    workgroup_size_y,
    workgroup_size_z
}:PipelineDescriptor){
    // 这个workgroup_size待优化，卷积的时候应该是可以自己设置的，不然卷积起来会很奇怪。
    // 就手动设置一些常见的卷积核给一般的吧，对于用户自定义的卷积核，感觉比较难做到优化了。
    // let workgroup_size_x = globalId? 16 : 1;
    // let workgroup_size_y = globalId? 16 : 1;
    // let workgroup_size_z = 1;

    return `
    ${storageInfoEntries.map((element, index) => { return `@group(0) @binding${index} var<storage,read_write> ${element.label}:<${element.type}>;\n` })}
    ${staticInfoEntries.map((element, index) => { return `@group(1) @binding${index} var<uniform,read> ${element.label}:<${element.type}>;\n` })}
    ${otherFunctionEntries.map((element) => { return `${element.content}\n` })}
    @compute @workgroup_size(${workgroup_size_x},${workgroup_size_y},${workgroup_size_z})
    fn main(
    ${globalId ? '@builtin(global_invocation_id) id: vec3u,' : ''}
    ${localId ? '@builtin(local_invocation_id) localId: vec3u,' : ''}){
    ${main}
    }`
}