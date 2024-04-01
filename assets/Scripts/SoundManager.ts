import { _decorator, AudioClip, AudioSource, CCBoolean, Component, director, Node } from 'cc';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {
    @property(AudioClip) public audioList: AudioClip[] = [];
    @property(CCBoolean) public isVolume: boolean = true;

    //#region: "singleton"
    public static Instance: SoundManager;
    protected onLoad(): void {
        if (SoundManager.Instance == null) {
            SoundManager.Instance = this;
            //this.isVolume = true;
            director.addPersistRootNode(this.node);
        }
        director.loadScene("Menu");

    }
    //#endregion



    public ClickSound(): void {
        if (!this.isVolume) return;
        AudioManager.instance.playSFX(this.audioList[0], 1);
    }
    public ConnectWinSound(): void {
        if (!this.isVolume) return;
        AudioManager.instance.playSFX(this.audioList[1], 1);
    }
    public ConnectSound(): void {
        if (!this.isVolume) return;
        AudioManager.instance.playSFX(this.audioList[2], 1);
        // let nodeAudio = new Node();
        // let audioManager = nodeAudio.addComponent(AudioSource)

        // if (!this.isVolume) return;
        // audioManager.loop = false;
        // audioManager.playOneShot(this.audioList[2], 1);
        // console.log("soundfire" + audioManager.playOneShot(this.audioList[2], 1));

    }
    public ConnectPrivateSound(): void {
        if (!this.isVolume) return;
        AudioManager.instance.playSFX(this.audioList[3], 1);
    }
    public BGMusic(): void {
        if (!this.isVolume) return;
        AudioManager.instance.playMusic(this.audioList[4], 0.2);
    }
   

}


