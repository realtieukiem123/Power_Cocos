import { _decorator, CCInteger, Component, director, Label, log, Node, randomRangeInt, Sprite, SpriteFrame, sys, tween, Vec2, Vec3 } from 'cc';
import { Hexa } from './Hexa';
import { LOCAL_STORAGE } from './Menu';
import { SoundManager } from './SoundManager';
import { AudioManager } from './AudioManager';
import { GameAds } from './GameAds';
import { GameFirebase } from './GameFirebase';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    //#region: "singleton"
    public static Instance: GameManager;
    protected onLoad(): void {
        GameManager.Instance = this
    }
    //#endregion




    @property(CCInteger) public numLevel: number;
    @property(Label) public textLevel: Label;
    @property(Hexa) public listAllHexa: Hexa[] = [];
    @property(Hexa) public listHexaPower: Hexa[] = [];
    @property(SpriteFrame) public spriteListMusic: SpriteFrame[] = [];
    @property(Sprite) public spriteMusic: Sprite;
    @property(Node) public replayBannerNode: Node;

    @property(SpriteFrame) public spriteListBG: SpriteFrame[] = [];
    @property(SpriteFrame) public spriteListPopupBG: SpriteFrame[] = [];
    @property(SpriteFrame) public spriteListPopupYes: SpriteFrame[] = [];
    @property(SpriteFrame) public spriteListPopupNo: SpriteFrame[] = [];
    @property(Sprite) public spriteBG: Sprite;
    @property(Sprite) public spritePopupBG: Sprite;
    @property(Sprite) public spritePopupYes: Sprite;
    @property(Sprite) public spritePopupNo: Sprite;

    @property(Node) public winNode: Node;



    data: { listEnd: Hexa[], isPowe: boolean[], listNodeCheck: Hexa[] }
    public isStatus: boolean = false;








    protected start(): void {
        this.LoadFirst();
        this.CheckHexa();
    }

    LoadFirst() {
        this.textLevel.string = this.numLevel.toString();
        //randomBG
        let rd = randomRangeInt(0, 5);
        this.spriteBG.spriteFrame = this.spriteListBG[rd];
        this.spritePopupBG.spriteFrame = this.spriteListPopupBG[rd];
        this.spritePopupYes.spriteFrame = this.spriteListPopupYes[rd];
        this.spritePopupNo.spriteFrame = this.spriteListPopupNo[rd];




        //CheckLevel
        if (sys.localStorage.getItem(LOCAL_STORAGE.level_done) == null || sys.localStorage.getItem(LOCAL_STORAGE.level_done) <= 0) {
            sys.localStorage.setItem(LOCAL_STORAGE.level_done, 1);
        } else if (this.numLevel >= sys.localStorage.getItem(LOCAL_STORAGE.level_done)) {
            sys.localStorage.setItem(LOCAL_STORAGE.level_done, this.numLevel);
        }
        //CheckSound
        if (SoundManager.Instance.isVolume) {
            AudioManager.instance.resume();
            this.spriteMusic.spriteFrame = this.spriteListMusic[1];
        } else {
            AudioManager.instance.pause();
            this.spriteMusic.spriteFrame = this.spriteListMusic[0];
        }
        //Ads
        try {
            //inter
            GameAds.instance.showInterstitalAds('inter', () => {
                console.log('inter');
                //firebase
                GameFirebase.instance.sendAdsInter();
                GameFirebase.instance.sendAdsInterAdmin();
                GameFirebase.instance.sendStartLevel(this.numLevel);
            })
        } catch (error) {
            console.log("error ads firebase")
        }

    }
    CheckHexa() {
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
    public CheckWin() {
        let isWin = true;
        this.listAllHexa.forEach(e => {
            if (e.isLight == false) {
                isWin = false;
                return;
            }
        });
        //Win
        if (isWin) {

            this.isStatus = true;
            this.winNode.active = true;

            //Sound
            SoundManager.Instance.ConnectWinSound();

            tween(this.winNode)
                .to(1, { scale: new Vec3(40, 40) }, {
                    easing: "circIn",
                    onComplete: (target?: object) => {
                        console.log("win");
                        if (this.numLevel >= 10) {
                            director.loadScene("Menu");
                        }
                        else {
                            director.loadScene("Level" + (this.numLevel + 1).toString());
                        }



                    }
                })
                .start();


        }

    }

    //----------------------------BUTTON---------------------------------
    // ButtonSuggest() {
    //     let listNotCorrect: Hexa[] = [];

    // }
    ButtonReplay() {
        SoundManager.Instance.ClickSound();
        this.scheduleOnce(function () {
            this.replayBannerNode.active = true;
        }, 0.125);

    }
    ButtonYesReplay() {
        SoundManager.Instance.ClickSound();
        this.scheduleOnce(function () {
            director.loadScene("Level" + this.numLevel);
        }, 0.125);

    }
    ButtonNoReplay() {
        SoundManager.Instance.ClickSound();
        this.scheduleOnce(function () {
            this.replayBannerNode.active = false;
        }, 0.125);

    }




    ButtonNext() {
        SoundManager.Instance.ClickSound();
        this.scheduleOnce(function () {
            // console.log("Level" + (this.numLevel + 1).toString());
            // console.log(Number(sys.localStorage.getItem(LOCAL_STORAGE.level_done)));

            if (this.numLevel >= 10) {
                return;
            }
            else if (this.numLevel + 1 <= (sys.localStorage.getItem(LOCAL_STORAGE.level_done))) {
                director.loadScene("Level" + (this.numLevel + 1).toString());
            }
        }, 0.125);


        // if (sys.localStorage.getItem(LOCAL_STORAGE.map) >= 15) {

        //     sys.localStorage.setItem(LOCAL_STORAGE.map, Number(sys.localStorage.getItem(LOCAL_STORAGE.map)) + 1);
        //     director.loadScene("GP" + randomRangeInt(10, 15).toString());

        // } else {
        //     director.loadScene(nameMap);
        // }
    }
    ButtonPre() {
        SoundManager.Instance.ClickSound();
        this.scheduleOnce(function () {
            if (this.numLevel <= 1) return;
            director.loadScene("Level" + (this.numLevel - 1).toString());
        }, 0.125);


    }
    ButtonSound() {


        if (SoundManager.Instance.isVolume) {
            //Audio
            SoundManager.Instance.ClickSound();
            //Off Music
            SoundManager.Instance.isVolume = false;
            AudioManager.instance.pause();
            this.spriteMusic.spriteFrame = this.spriteListMusic[0];
        } else {
            //On Music
            SoundManager.Instance.isVolume = true;
            AudioManager.instance.resume();
            this.spriteMusic.spriteFrame = this.spriteListMusic[1];
        }

    }

}



