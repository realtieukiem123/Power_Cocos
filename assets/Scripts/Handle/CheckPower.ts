import { _decorator, Component, Node } from 'cc';
import { DFS } from './DFS';
import { Hexa } from '../Hexa';
const { ccclass, property } = _decorator;

@ccclass('CheckPower')
export class CheckPower extends DFS {
    static instance : CheckPower = null;
    protected onLoad(): void {
        CheckPower.instance = this;
    }

    hasPower : boolean = false;
    listNext : Hexa[] = [];
    override DoSomething(h: Hexa): void {
        h.isValidate = true;
        this.listNext.push(h);
        if(h.isPower) this.hasPower = true;
    }
}


