import { _decorator, Component, Node } from 'cc';
import {EventTarget} from 'cc';
const { ccclass, property } = _decorator;

const event_target = new EventTarget();
/**
 * @description 自定义事件
 * @author 毛山
 * @timestamp 2023-4-1
 */
export class EventDispatcher  {
    private static data :EventDispatcher;


    public static CHECK_LIGHT = "CHECK_LIGHT";

    static get_target():EventTarget{
        if(EventDispatcher.data == null){
            EventDispatcher.data = new EventDispatcher();
        }
        return EventDispatcher.data.get_event_target();
    }

    private get_event_target():EventTarget{
        return event_target;
    }
}

