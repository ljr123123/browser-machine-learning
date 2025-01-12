let device:GPUDevice;
let adapter:GPUAdapter | null;

async function init() {
    adapter = await navigator.gpu.requestAdapter();
    if(adapter == null) throw new Error("this browser doesn't support WebGPU.");
    device = await adapter.requestDevice();
}

await init();

export {
    device,
    adapter
}