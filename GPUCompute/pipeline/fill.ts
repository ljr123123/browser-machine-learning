import { DataType } from "../basic/type";
import { PipelineDescriptor } from "./pipeline";

const fill:PipelineDescriptor = {
    label:"fill",
    storageInfoEntries:[
        {binding:0, label:"buffer", type:DataType.float32}
    ],
    staticInfoEntries:[
        {binding:0, label:"filler", type:DataType.float32}
    ],
    globalId:{
        binding:1, label:"index"
    },
    main:"buffer[index] = filler[0];",
    otherFunctionEntries:[]
}

export default fill;