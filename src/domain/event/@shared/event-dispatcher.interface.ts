import EventInterface from "./event.interface";
import EventHandlerInterface from "./event-handler.interface";

export default interface EventDispactherInterface {
    notify(event: EventInterface): void;
    register(eventName: string, eventHandler: EventHandlerInterface):void;
    unregister(eventName: string, eventHandler: EventHandlerInterface):void;
    unregisterAll():void;
}