import { _decorator, AudioClip, AudioSource, Component, director, Node, resources } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager  {
    private static _instance: AudioManager;
    public static get instance(): AudioManager {
        if (this._instance == null) {
            this._instance = new AudioManager();
        }
        return this._instance;
    }

    private _audioSource: AudioSource;
    public get audioSource() {
        return this._audioSource
    }

    private _isMusicOn: boolean = true
    public get isMusicOn() {
        return this._isMusicOn
    }

    private _isSFXOn: boolean = true
    public get isSFXOn() {
        return this._isSFXOn
    }

    constructor() {
        let audioManager = new Node()
        audioManager.name = 'AudioManager'


        director.getScene().addChild(audioManager)

        director.addPersistRootNode(audioManager)

        this.getLocalStorage()

        this._audioSource = audioManager.addComponent(AudioSource)
        this._audioSource.loop = true
    }

    getLocalStorage() {
        const localMusic = localStorage.getItem(LOCAL_KEY.MUSIC)
        const localSFX = localStorage.getItem(LOCAL_KEY.SFX)

        if (localSFX) {
            this._isSFXOn = localSFX == 'true' ? true : false
        }

        if (localMusic) {
            this._isMusicOn = localMusic == 'true' ? true : false
        }
    }

    /**
     * @vn
     * phát 1 lần âm thanh ngắn, như là sound effect
     * @en
     * play short audio, such as strikes,explosions
     * @param sound clip or url for the audio
     * @param volume 
     */
    playSFX(sound: AudioClip | string, volume: number = 1.0) {
        if (!this._isSFXOn) {
            return
        }


        if (sound instanceof AudioClip) {
            this._audioSource.playOneShot(sound, volume);
        }
        else {
            resources.load(sound, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                }
                else {
                    this._audioSource.playOneShot(clip, volume);

                }
            });
        }
    }



    /**
     * @vn
     * play âm thanh dài, như là nhạc background
     * @en
     * play long audio, such as the bg music
     * @param sound clip or url for the sound
     * @param volume 
     */
    playMusic(sound: AudioClip | string, volume: number = 0.3) {

        this._audioSource.pause()

        if (sound instanceof AudioClip) {

            //nếu music truyền vào giống music đang phát thì không phát lại music
            if (!this._isMusicOn) {
                console.log('return');
                this._audioSource.clip = null
                return
            }

            if (this._audioSource.clip == sound) {
                // return
            } else {
                this._audioSource.clip = null
            }
            console.log('not return');
            this._audioSource.clip = sound;
            this._audioSource.play();
            this.audioSource.volume = volume;


        }
        else {
            if (!this._isMusicOn) {
                return
            }
            resources.load(sound, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                }
                else {
                    this._audioSource.clip = clip;
                    this._audioSource.play();
                    this.audioSource.volume = volume;

                }
            });
        }
    }

    /**
     * dừng hẳn audio play
     */
    stop() {
        this._audioSource.stop();
    }

    /**
     * tạm dừng audio play
     */
    pause() {
        this._audioSource.pause();
    }

    /**
     * phát tiếp audio play
     */
    resume() {
        this._audioSource.play();
    }

    setSFX() {
        this._isSFXOn = !this._isSFXOn
        localStorage.setItem(LOCAL_KEY.SFX, this._isSFXOn ? 'true' : 'false')
    }


}

const LOCAL_KEY = {
    MUSIC: 'game_music',
    SFX: 'game_sfx'
}


