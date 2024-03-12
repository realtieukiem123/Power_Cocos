import { _decorator, Component, Node } from 'cc';
import { Hexa } from '../Hexa';
import { CheckPower } from './CheckPower';
import { GameManager } from '../GameManager';
const { ccclass, property } = _decorator;

@ccclass('HandleAfterRotate')
export class HandleAfterRotate extends Component {
    //#region: "singleton"
    public static instance: HandleAfterRotate;
    protected onLoad(): void {
        HandleAfterRotate.instance = this;
    }


    @property(Node) public listEnd: Node[] = [];
    start() {

    }

    update(deltaTime: number) {
        
    }
    CheckListEnd(h : Hexa){
        this.listEnd.forEach(h=>{console.log(h.parent.name)});
        for(let i = 0 ;i<this.listEnd.length;i++){
            let index = -1; 
            index = h.listNodeConnect.indexOf(this.listEnd[index]);
            if(index > -1) this.listEnd[i] = null;
            else{
                CheckPower.instance.hasPower = false;
                CheckPower.instance.listNext = [];
                CheckPower.instance.DFS(this.listEnd[i].getComponent(Hexa));
                GameManager.Instance.ResetValidate();
                console.log(CheckPower.instance.hasPower);
                if(!CheckPower.instance.hasPower){
                    CheckPower.instance.listNext.forEach(h =>{
                        h.isLight = false;
                        h.CheckLight(h.isLight);
                    })
                }
            }
        }
        this.listEnd = [];

    }
}


