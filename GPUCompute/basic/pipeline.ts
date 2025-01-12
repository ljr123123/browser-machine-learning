const pipelinePool = new Map<string, GPUComputePipeline>();

export function getPipeline(label:string):boolean | pipe {
    if(pipelinePool.has(label)) return 
}

export function createPipeline(label:string, pipeline:GPUComputePipeline) {
    pipelinePool.set(label, pipeline);
}

export function deletePipeline(label:string) {

}


