
import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerCreateEvent from "../customer-created.event";

export default class InformWhenCustomerIsCreateHandler
implements EventHandlerInterface<CustomerCreateEvent>{

    handle(event: CustomerCreateEvent): void {
        console.log('Esse é o primeiro console.log do evento: CustomerCreated');
    }

}