let device:GPUDevice;
let adapter:GPUAdapter | null;
export const initSetting = {
    powerPreference:undefined
}

async function init() {
    adapter = await navigator.gpu.requestAdapter(initSetting);
    if(!adapter) throw new Error("this browser doesn't support WebGPU.");
    device = await adapter.requestDevice();
}

await init();

export {
    device,
    adapter
}