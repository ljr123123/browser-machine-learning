import { DataType } from "../basic/type";
import { PipelineDescriptor } from "./pipeline";

const pipeline_add:PipelineDescriptor = {
    label: "add",
    storageInfoEntries:[
        {binding:0, label:"x", type:DataType.float32},
        {binding:1, label:"y", type:DataType.float32},
        {binding:2, label:"z", type:DataType.float32}
    ],
    staticInfoEntries:[],
    main: `
    z[index] = y[index] + x[index];
    `,
    globalId: {
        binding:0,
        label:"index"
    },
    otherFunctionEntries: [],
}
export default pipeline_add;