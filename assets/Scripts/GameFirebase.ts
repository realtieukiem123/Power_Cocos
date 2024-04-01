import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

const sendLogEvent = (window as any).sendLogEvent;
const myGameConfig = (window as any).myGameConfig;
const sendLogEventAdmin = (window as any).sendLogEventAdmin;

@ccclass('GameFirebase')
export class GameFirebase extends Component {

    static readonly EVENT_START_GAME = "event_start_level";
    static readonly EVENT_NEXT_LEVEL = "event_complete_level";
    static readonly EVENT_ADS_INTER = "event_ads_inter";
    static readonly EVENT_ADS_REWARD = "event_ads_reward";
    static readonly EVENT_SCORE = "event_score";
    static readonly EVENT_LEVEL_LOSE = "event_level_lose";
    static readonly EVENT_AD_ERROR = "event_ad_error";


    static readonly PARAM_TYPE = "type";
    static readonly PARAM_LEVEL = "level";
    static readonly PARAM_SCORE = "score";

    static instance: GameFirebase = null

    private ads_inter_time : number = 180;
    link_apk_on: string = "https://www.google.com.vn/";

    protected onLoad(): void {
        GameFirebase.instance = this;

        this.loadConfig();
    }

    getAdsTimeInter(): number{
        return this.ads_inter_time;
    }

    protected start(): void {
    }

    sendLog(name, data : {[key :string]: string }){
        // return
        sendLogEvent(name,data);
    }
    sendLogAdmin(name, data: {[key: string]: string})
    {
        sendLogEventAdmin(name, data);
    }

    private example_send(){
        let data = {
            [GameFirebase.PARAM_LEVEL]: "level_1"
        }
        this.sendLog(GameFirebase.EVENT_START_GAME, data);
    }

    loadConfig(){
        // console.log("url config "+ myGameConfig.url_config_game)
        fetch(myGameConfig.url_config_game)
            .then(response => {
                if (response.ok) {
                return response.text();
                } else {
                    // console.log("time inter "+ myGameConfig.ads_inter_time)
                    this.ads_inter_time = myGameConfig.ads_inter_time;
                    this.link_apk_on = myGameConfig.link_apk_on;
                }
            })
            .then(data => {
                // Now you can work with the contents of the file (data).
                // console.log("data response ",data);
                let config = JSON.parse(data);
                this.ads_inter_time = config.ads_inter_time;
                this.link_apk_on = config.link_apk_on;
                // console.log("config.ads_inter_time ", config.ads_inter_time);
            })
            .catch(error => {
                console.error('An error occurred:', error);
                this.ads_inter_time = myGameConfig.ads_inter_time;
                this.link_apk_on = myGameConfig.link_apk_off
            });

    }


    sendAdsInter(){
        let data = {
            [GameFirebase.PARAM_TYPE]: "Interstital"
        }
        this.sendLog(GameFirebase.EVENT_ADS_INTER, data);
    }
    sendAdsInterAdmin(){
        let data = {
            [GameFirebase.PARAM_TYPE]: "Interstital"
        }
        this.sendLogAdmin(GameFirebase.EVENT_ADS_INTER, data);
    }

    sendAdsReward(){
        let data = {
            [GameFirebase.PARAM_TYPE]: "Reward"
        }
        this.sendLog(GameFirebase.EVENT_ADS_REWARD, data);
    }
    sendAdsRewardAdmin(){
        let data = {
            [GameFirebase.PARAM_TYPE]: "Reward"
        }
        this.sendLogAdmin(GameFirebase.EVENT_ADS_REWARD, data);
    }

    sendStartLevel(level: number){
        let data = {
            [GameFirebase.PARAM_LEVEL]: level.toString()
        }
        this.sendLog(GameFirebase.EVENT_START_GAME, data);
    }


    sendNextLevel(level: number){
        let data = {
            [GameFirebase.PARAM_LEVEL]: level.toString()
        }
        this.sendLog(GameFirebase.EVENT_NEXT_LEVEL, data);
    }

    sendLevelLose(level: number)
    {
        let data = {
            [GameFirebase.PARAM_LEVEL]: level.toString()
        }
        this.sendLog(GameFirebase.EVENT_LEVEL_LOSE, data);
    }

    sendScore(score: number){
        let data = {
            [GameFirebase.PARAM_SCORE]: score.toString()
        }
        this.sendLog(GameFirebase.EVENT_SCORE, data);
    }
    sendAdsError()
    {
        let data = {
            [GameFirebase.PARAM_TYPE] : "AdsError"
        }
        this.sendLog(GameFirebase.EVENT_AD_ERROR, data);
    }


    sendAdsErrorAdmin()
    {
        let data = {
            [GameFirebase.PARAM_TYPE] : "AdsError"
        }
        this.sendLogAdmin(GameFirebase.EVENT_AD_ERROR, data);
    }

}
