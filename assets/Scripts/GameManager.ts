import { _decorator, Component, Node } from 'cc';
import { Hexa } from './Hexa';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    //#region: "singleton"
    public static Instance: GameManager;
    protected onLoad(): void {
        GameManager.Instance = this
    }
    //#endregion


    @property(Hexa) public listAllHexa: Hexa[] = [];
    @property(Hexa) public listHexaPower: Hexa[] = [];
    data: { listEnd: Hexa[], isPowe: boolean[], listNodeCheck: Hexa[] }


    protected start(): void {
        this.scheduleOnce(() => {
            this.listHexaPower.forEach(e => {
                if (e.isPower) {
                    this.DFS(e);
                    this.ResetValidate();
                }

            })
        }, 0.1);
    }

    DFS(hex: Hexa) {
        let tempctrl = hex.getComponent(Hexa);
        this.DoSomething(tempctrl);
        tempctrl.listNodeConnect.forEach((e) => {
            let ctr = e.getComponent(Hexa);
            if (!ctr.isValidate)
                this.DFS(ctr);
        })

    }
    // DFSPower(hex: Hexa) {
    //     let tempctrl = hex.getComponent(Hexa);
    //     this.CheckConnectPower(tempctrl);

    //     tempctrl.listNodeConnect.forEach((e) => {
    //         let ctr = e.getComponent(Hexa);
    //         if (!ctr.isValidate)
    //             this.DFSPower(ctr);
    //     })
    // }

    DoSomething(h: Hexa) {
        if (h.isValidate) return;
        h.isValidate = true;
        h.isLight = true;
        h.CheckLight(h.isLight);

    }
    ResetValidate() {
        this.listAllHexa.forEach(e => {
            e.isValidate = false;
        });
    }
    public CheckConnectPower(h: Hexa) {
        h.isValidate = true;
        this.data.listNodeCheck.push(h);
        if (h.isPower) {
            return true;
        }
        return false;

    }

    // CheckPower(){
    //     this.data.listEnd.forEach(e => {
    //         this.DFSPower(e);
    //     });
    // }

}


