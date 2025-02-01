import { PipelineDescriptor } from "../../basic/pipeline";
import { DataType } from "../../basic/type";

const pipelineSetting:PipelineDescriptor = {
    label:"add",
    storageInfoEntries:[
        {type:DataType.float32, label:"a"},
        {type:DataType.float32, label:"b"},
        {type:DataType.float32, label:"c"}
    ],
    staticInfoEntries:[],
    otherFunctionEntries:[],
    main:`c[index] = a[index] + b[index];`,
    globalId:{
        label:"index"
    }
};

export default pipelineSetting;