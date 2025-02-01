import { ComputeNode } from "../../basic/compute";
import { DataType } from "../../basic/type";
import { Tensor } from "../../tensor";
import { arrayCompare } from "../../utils/array";

export function add(a:Tensor, b:Tensor):Tensor {
    const a_shape = a.getShape();
    const b_shape = b.getShape();
    if(!arrayCompare(a_shape, b_shape)) throw new Error("tensor's shape not equal.")
    const c = new Tensor(a_shape.slice(1), a_shape[0], a.getType());
    const computeNode = new ComputeNode(
        "add", 
        [a.getStorage(), b.getStorage(), c.getStorage()],
    );
    computeNode.storageBindGroupsInit = () => {

    }
    return c;
}