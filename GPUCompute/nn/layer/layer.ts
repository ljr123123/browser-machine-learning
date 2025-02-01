import { Tensor } from "../../tensor";

export class Layer {
    constructor(){}
    protected forward(x:Tensor):Tensor{
        return x;
    }
}