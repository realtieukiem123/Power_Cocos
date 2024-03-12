import { _decorator, Component, Node } from 'cc';
import { Hexa } from '../Hexa';
const { ccclass, property } = _decorator;

@ccclass('DFS')
export class DFS extends Component {
    DFS(hex: Hexa) {
        let tempctrl = hex.getComponent(Hexa);
        this.DoSomething(tempctrl);
        tempctrl.listNodeConnect.forEach((e) => {
            let ctr = e.getComponent(Hexa);
            if (!ctr.isValidate)
                this.DFS(ctr);
        })
    }

    DoSomething(h : Hexa){

    }
}


