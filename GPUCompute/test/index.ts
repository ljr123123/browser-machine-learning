import { device } from "../basic/device";
export async function test() {
    // 12
const originData = [];
for(let i = 0; i < 20000 * 2; i++) {
    originData.push(new Float32Array(100).fill(1))
}
const GPUBuffers = originData.map(element => {
    return device.createBuffer({
        size:element.byteLength,
        usage:GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC | GPUBufferUsage.STORAGE
    })
});

const pipeline = [];
for(let i = 0; i < 10; i++) {
    pipeline.push(device.createComputePipeline({
        layout:"auto",
        compute:{
            module:device.createShaderModule({
                code:`
                @group(0) @binding(0) var<storage, read_write> data1:array<f32>;
                @group(0) @binding(1) var<storage, read_write> data2:array<f32>;
                @compute @workgroup_size(100, 1, 1)
                fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
                    let index = global_id.x;
                    if(index >= ${100}u) { return; }
                    data1[index] = data2[index] + data1[index];
                }
                `
            }),
            entryPoint:"main"
            
        },
        
    }))
}
const commandBuffer = [];
for(let i = 1, j = 0; i <= originData.length / 2; i++, j++) {
    if(j == 10) j = 0;
    const bindGroup = device.createBindGroup({
        layout:pipeline[j].getBindGroupLayout(0),
        entries:[
            {
                binding:0, resource:{buffer:GPUBuffers[i - 1]}
            },
            {
                binding:1, resource:{buffer:GPUBuffers[i * 2 - 1]}
            }
        ]
    });
    let commandEncoder = device.createCommandEncoder();
    let pass = commandEncoder.beginComputePass();
    pass.setBindGroup(0, bindGroup);
    pass.setPipeline(pipeline[j]);
    pass.dispatchWorkgroups(1);
    pass.end();
    commandBuffer.push(commandEncoder.finish());
}
device.queue.submit(commandBuffer);
console.time("time")
await device.queue.onSubmittedWorkDone();
console.timeEnd("time")
}

export const nothing = undefined;