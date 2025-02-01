import { add } from "../../functional/add";
import { matmul } from "../../functional/plus";
import { Tensor } from "../../tensor";
import { Layer } from "./layer";

export class Linear extends Layer {
    weightMatrix:Tensor;
    biasMatrix:Tensor;
    constructor(input_nodes:number, output_nodes:number){
        super();
        this.weightMatrix = new Tensor();
        this.biasMatrix = new Tensor();
    }
    forward(x:Tensor):Tensor {
        const plusResult = matmul(x, this.weightMatrix);
        return add(plusResult, this.biasMatrix);
    }
}