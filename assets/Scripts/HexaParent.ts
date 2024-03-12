import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HexaParent')
export class HexaParent extends Component {
    @property(Node) listNodeAround: Node[] = [];
    public collider: Collider2D;

    protected onLoad(): void {
        this.collider = this.getComponent(Collider2D);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == 1) {
            this.listNodeAround.push(otherCollider.node);
        }

    }
}


