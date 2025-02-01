import { Buffer } from "./buffer";
import { device } from "./device";
import { setting } from "./global";

export function pipelineAndBindGroupsEncode(
    pipeline:GPUComputePipeline, 
    bindGroups:GPUBindGroup[],
    workgroupsX:number,
    workgroupsY:number,
    workgroupsZ:number
):GPUCommandBuffer {
    const commandEncoder = device.createCommandEncoder();
    const pass = commandEncoder.beginComputePass();
    pass.setPipeline(pipeline);
    bindGroups.forEach((element, index) => pass.setBindGroup(index, element));
    pass.dispatchWorkgroups(workgroupsX, workgroupsY, workgroupsZ)
    pass.end();
    return commandEncoder.finish();
}

export function copyBufferToBufferEncode(sourceBuffer:Buffer, aimBuffer:Buffer) {
    const commandEncoder = device.createCommandEncoder();
    const source = sourceBuffer.getBuffer();
    const aim = aimBuffer.getBuffer();
    commandEncoder.copyBufferToBuffer(source, 0, aim, 0, source.size);
    return commandEncoder.finish();
}


