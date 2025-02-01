import { device } from "./device";

export const setting = {
    StorageBufferKeeping:false,
    CommandBufferKeeping:false
}


const mallocPromisePool = new Array<Promise<void>>;
const commandBufferPool = new Array<Promise<GPUCommandBuffer[]>>;
const deletePromisePool = new Array<Promise<void>>;

export async function solve():Promise<void> {
    // 多步执行，在把GPUCommand push到Queue之前把所有的Buffer都分配好
    if(setting.StorageBufferKeeping) {
        await Promise.all(mallocPromisePool);
        const commandBuffers = await Promise.all(commandBufferPool);
        commandBuffers.forEach(async element => {
            device.queue.submit(element);
            await device.queue.onSubmittedWorkDone();
        })
        await Promise.all(deletePromisePool);
    }
} 