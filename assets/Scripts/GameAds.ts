import { _decorator, Component, director, game } from 'cc';
import { InterstitialAdEvent, RewardedVideoAdEvent } from '../adsense-h5g-api/ad_event';
import { InterstitialType } from '../adsense-h5g-api/interstitial_type';
import { requestRewardedAd, showInterstitialAd, showPrerollAd, showRewardedAd } from '../adsense-h5g-api/h5_games_ads';
import { GameFirebase } from './GameFirebase';
const { ccclass } = _decorator;

const myGameConfig = (window as any).myGameConfig;

@ccclass('GameAds')
export class GameAds extends Component {
    static instance: GameAds = null
    
    start() {
        this.onAddListenner();
        if(myGameConfig.is_pogame == null || myGameConfig.is_pogame == 0){
            showPrerollAd();
        }
    }

    protected onLoad(): void {
        GameAds.instance = this;
        director.addPersistRootNode(this.node);
        this.initPogameSDK()
    }

    onAddListenner() {
        game.on(InterstitialAdEvent.BEFORE_AD, this.onHandleInterstitialBeforeAd, this);
        game.on(InterstitialAdEvent.AFTER_AD, this.onHandleInterstitialAfterAd, this);
        game.on(InterstitialAdEvent.AD_BREAK_DONE, this.onHandleInterstitialAdBreakDone, this);
        game.on(RewardedVideoAdEvent.BEFORE_AD, this.onHandleRewardBeforeAds, this);
        game.on(RewardedVideoAdEvent.AFTER_AD, this.onRewardedVideoAfterAd, this);
        game.on(RewardedVideoAdEvent.AD_BREAK_DONE, this.onHandleRewardBreakDone, this);
        game.on(RewardedVideoAdEvent.BEFORE_REWARD, this.onHandleRewardBeforeReward, this);
        game.on(RewardedVideoAdEvent.AD_VIEWED, this.onHandleRewardViewed, this);
        game.on(RewardedVideoAdEvent.AD_DISMISSED, this.onRewardedVideoAdDismissed, this);
    }
    //#region Inters ads 
    showInterstitalAds(name: string, onAdBreakDone: () => void){

        this.onInterstitialAdBreakDone = onAdBreakDone;
        if(myGameConfig.is_pogame != null && myGameConfig.is_pogame == 1){
            this.POShowAd();
        }
        else{
            showInterstitialAd(InterstitialType.NEXT, name);
        }
    }

    onInterstitialBeforeAd : (() => void) | null;

    onInterstitialAfterAd : (() => void) | null;

    onInterstitialAdBreakDone : (() => void) | null;

    onHandleInterstitialAdBreakDone (){
        if(this.onInterstitialAdBreakDone)
            this.onInterstitialAdBreakDone();
    }

    onHandleInterstitialBeforeAd (){
        if(this.onInterstitialBeforeAd)
            this.onInterstitialBeforeAd();
    }

    onHandleInterstitialAfterAd (){
        if(this.onInterstitialAfterAd)
            this.onInterstitialAfterAd();
    }

    //#endregion

    //#region Reward ads
    onRewardedVideoAfterAd : (() => void) | null;

    onRewardedVideoAdBreakDone : ((isViewed: boolean) => void) | null;

    onRewardedVideoBeforeReward : (() => void) | null;

    onRewardedVideoAdViewed : (() => void) | null;

    onRewardedVideoAdDismissed : (() => void) | null;

    watched : boolean;

    showRewardAds(name: string, onAdBreakDone: (viewed : boolean) => void){
        this.watched = false;
        this.onRewardedVideoAdBreakDone = onAdBreakDone;
        if(myGameConfig.is_pogame != null && myGameConfig.is_pogame == 1){
            this.POShowRewardedAd()
        }
        else{
            requestRewardedAd(name);
        }
    }

    onHandleRewardBeforeAds(){
        console.log("onHandleRewardBeforeAds ?");
    }

    onHandleRewardBeforeReward(){
        console.log("ready show ads ?");
        showRewardedAd();
    }

    onHandleRewardBreakDone(){
        if(this.onRewardedVideoAdBreakDone)
            this.onRewardedVideoAdBreakDone(this.watched)
    }

    onHandleRewardViewed(){
        this.watched = true;
    }
    //#endregion

    //#region POGAME SDK
    
    private initPogameSDK () {
        window["PO_OPTIONS"] = {
            gameId: myGameConfig.pogame_id,
            onEvent: (event) => {
                console.log(`event: ${event.name}`)
                switch (event.name) {
                    case "SDK_READY":
                        // When the SDK is ready.
                        console.log("SDK_READY")
                        break;
                    case "SDK_ERROR":
                        // When the SDK has hit a critical error.
                        break;
                    case "AD_ERROR":
                        try {
                            GameFirebase.instance.sendAdsError();
                            GameFirebase.instance.sendAdsErrorAdmin();
    
                        } catch (error) {
                            console.log('error ads');
                        }
                        break;
                    case "SDK_GAME_START":
                        // advertisement done, resume game logic and unmute audio
                        console.log("SDK_GAME_START")
                        break;
                    case "SDK_GAME_PAUSE":
                        // pause game logic / mute audio
                        console.log("SDK_GAME_PAUSE");
                        break;
                    case "SDK_REWARDED_WATCH_COMPLETE":
                        // this event is triggered when your user completely watched rewarded ad
                        this.watched = true;
                        console.log("SDK_REWARDED_WATCH_COMPLETE")
                        break;
                }
            },
        };

        const script = document.createElement('script');
        script.id = 'posdk';
        script.src = 'https://sdk.pogame.com/posdk.js';
        document.head.appendChild(script);
    }

    private POShowAd() {
        const posdk: Posdk | undefined = window['posdk'];
        if (typeof posdk !== 'undefined' && typeof posdk.showAd === 'function') {
            posdk.showAd()
                .then(response => {
                    // A rewarded ad can be shown to the user when he/she clicked it.
                    this.onHandleInterstitialAdBreakDone();
                })
                .catch(error => {
                    // Any Rewarded ad is not available to the user.
                    this.onHandleInterstitialAdBreakDone();
                });
        }
    }

    private POShowRewardedAd() {
        const posdk: Posdk | undefined = window['posdk'];
        if (typeof posdk !== 'undefined' && typeof posdk.showAd === 'function') {
            console.log("show ads reward ")
            posdk.showAd('rewarded')
                .then(response => {
                    // Ad process done. You can track "SDK_REWARDED_WATCH_COMPLETE" event if that event triggered,
                    // that means the user watched the advertisement completely, and you can give a reward there.
                    this.onHandleRewardBreakDone();

                })
                .catch(error => {
                    // An error caught. Please don't give the reward here.
                    this.onHandleRewardBreakDone();
                });
        }
    }
}

// Define a type for posdk
interface Posdk {
    showAd: (adType?: string) => Promise<any>;
    // Add other methods or properties if needed
}
