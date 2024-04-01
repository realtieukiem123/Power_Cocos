import { _decorator, Component, director, Node } from 'cc';
import { SoundManager } from './SoundManager';
import { GameAds } from './GameAds';
import { GameFirebase } from './GameFirebase';
const { ccclass, property } = _decorator;

@ccclass('Menu')
export class Menu extends Component {

    ButtonPlay() {
        SoundManager.Instance.ClickSound();
        this.scheduleOnce(function () {
            director.loadScene("Level1");
        }, 0.125);

    }
    protected start(): void {
        SoundManager.Instance.BGMusic();
        try {
            //inter
            GameAds.instance.showInterstitalAds('inter', () => {
                console.log('inter');
                //firebase
                GameFirebase.instance.sendAdsInter();
                GameFirebase.instance.sendAdsInterAdmin();
                //GameFirebase.instance.sendStartLevel(this.level);
            })
        } catch (error) {
            console.log("error ads firebase")
        }


    }


}

export const LOCAL_STORAGE = {
    level: "1",
    level_done: "1",
}


