
import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerCreateEvent from "../customer-created.event";

export default class ConfirmWhenCustomerIsCreateHandler 
implements EventHandlerInterface<CustomerCreateEvent>{

    handle(event: CustomerCreateEvent): void {
        console.log('Esse é o segundo console.log do evento: CustomerCreated');
    }

}