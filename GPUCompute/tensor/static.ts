import { BinaryArray } from "../type";

class StaticController {

};

export function declareStatic(data:BinaryArray | Array<number>) {
    let binary:BinaryArray;
    if(data instanceof Array) binary = new Float32Array(data);
    else binary = data;

    
}