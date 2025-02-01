import { PipelineDescriptor } from "../../basic/pipeline";
import { DataType } from "../../basic/type";

const setting:PipelineDescriptor = {
    label:"fill",
    storageInfoEntries:[
        {type:DataType.float32, label:"tensor"}
    ],
    staticInfoEntries:[
        {type:DataType.float32, label:"filler"}
    ],
    globalId:{
        label:"index"
    },
    main:"tensor[0] = filler[0];",
    otherFunctionEntries:[]
}

export default setting;