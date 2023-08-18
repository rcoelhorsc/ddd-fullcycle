import EventHandlerInterface from "../../@shared/event-handler.interface";
import ProductCreateEvent from "../product-created.event"

export default class SendEmailWhenProductIsCreatedHandler 
implements EventHandlerInterface<ProductCreateEvent>{

    handle(event: ProductCreateEvent): void {
        //console.log('Sending email to ${event.eventData.email}');
        console.log('Sending email to ......');
    }

}