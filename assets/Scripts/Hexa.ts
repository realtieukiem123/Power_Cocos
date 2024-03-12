import { _decorator, Button, CCBoolean, CCFloat, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, Quat, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { EventDispatcher } from './EventDispatcher';
import { GameManager } from './GameManager';
import { HandleAfterRotate } from './Handle/HandleAfterRotate';
import { CheckPower } from './Handle/CheckPower';
const { ccclass, property } = _decorator;

@ccclass('Hexa')
export class Hexa extends Component {

    button: Button | null = null;
    colliders: Collider2D[] = null;
    private corner: number = 0;
    private isClick = false;
    public isValidate: boolean = false;



    @property(Node) listNodeConnect: Node[] = [];
    //Config
    @property(CCFloat) speedRotate: number = 1;
    @property(CCBoolean) public isPower = false;
    @property(CCBoolean) public isLight = false;
    @property(Node) public spriteLightOn: Node;




    onLoad() {
        this.corner = this.node.angle;
        this.button = this.getComponent(Button);
        this.button.node.on(Button.EventType.CLICK, this.rotate, this);

        this.colliders = this.getComponentsInChildren(Collider2D);
        if (this.colliders) {
            for (let index = 0; index < this.colliders.length; index++) {
                this.colliders[index].on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
                this.colliders[index].on(Contact2DType.END_CONTACT, this.onEndContact, this);
            }
        }
        //Checklight
        if (!this.isPower) {
            this.CheckLight(false);
        }


    }
    protected start(): void {
        GameManager.Instance.listAllHexa.push(this);


    }
    // protected start(): void {
    //     //OnEvent
    //     EventDispatcher.get_target().on(EventDispatcher.CHECK_LIGHT, this.CheckAllLight);
    // }

    // public CheckAllLight() {
    //     console.log("ecjk");

    //     let isOff = false;
    //     for (let index = 0; index < this.colliders.length; index++) {

    //         if (this.colliders[index].tag != null) {
    //             isOff = true;
    //             return;
    //         }
    //     }
    //     if (!isOff) {
    //         this.isLight = false;
    //         this.CheckLight(this.isLight);
    //     }
    // }

    rotate(button: Button) {

        this.listNodeConnect = [];

        if (this.isClick || this.isPower) return;
        this.isClick = true;
        this.corner -= 60;
        let quat: Quat = new Quat();
        Quat.fromEuler(quat, 0, 0, this.corner);

        tween(this.node)
            .to(this.speedRotate, {
                rotation: quat

            }, {
                easing: "linear",
                onComplete: (target?: object) => {
                    this.isClick = false;
                    CheckPower.instance.hasPower = false;
                    CheckPower.instance.DFS(this);
                    GameManager.Instance.ResetValidate();
                    this.isLight = CheckPower.instance.hasPower;
                    this.CheckLight(this.isLight);
                    HandleAfterRotate.instance.CheckListEnd(this);
                    GameManager.Instance.listHexaPower.forEach(e => {
                        if (e.isPower) {
                            GameManager.Instance.DFS(e);
                            GameManager.Instance.ResetValidate();
                        }

                    })
                }
            })
            .start();
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == 0) {
            console.log(selfCollider.node.parent.name + "|" + otherCollider.node.parent.name)
            // console.log('light on' + this.node.name);
            this.listNodeConnect.push(otherCollider.node.parent);
        }
    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == 0 && !this.isClick) {
            let i = this.listNodeConnect.indexOf(otherCollider.node.parent);
            this.listNodeConnect.splice(i, 1);
        }
        if (otherCollider.tag == 0 && this.isClick && !otherCollider.node.parent.getComponent(Hexa).isPower) {
            HandleAfterRotate.instance.listEnd.push(otherCollider.node.parent);
        }
    }


    public CheckConnect() {

        // this.listNodeConnect.forEach(e => {
        //     if (e.getComponent(Hexa).isPower) {
        //         console.log("light");
        //     }
        // });

    }
    public CheckLight(isOn: boolean) {
        if (isOn) {
            this.spriteLightOn.active = true;
        } else {
            this.spriteLightOn.active = false;
        }
    }
}


