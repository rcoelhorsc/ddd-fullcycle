import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-create.handler";
import ProductCreateEvent from "../product/product-created.event";
import EventDispatcher from "./event-dispacther"

describe("Domain events teste", () => {

    it("should register event handler", () => {

        const eventDispacther = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispacther.register("ProductCreateEvent", eventHandler);

        expect(eventDispacther.getEventHandlers["ProductCreateEvent"]).toBeDefined();
        expect(eventDispacther.getEventHandlers["ProductCreateEvent"].length).toBe(1);
        expect(eventDispacther.getEventHandlers["ProductCreateEvent"][0]).toMatchObject(eventHandler);
    });

    it("should unregister event handler", () => {

        const eventDispacther = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispacther.register("ProductCreateEvent", eventHandler);
       
        expect(eventDispacther.getEventHandlers["ProductCreateEvent"][0]).toMatchObject(eventHandler);

        eventDispacther.unregister("ProductCreateEvent", eventHandler);

        expect(eventDispacther.getEventHandlers["ProductCreateEvent"]).toBeDefined();
        expect(eventDispacther.getEventHandlers["ProductCreateEvent"].length).toBe(0);
    });

    it("should unregister all events handlers", () => {

        const eventDispacther = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispacther.register("ProductCreateEvent", eventHandler);
       
        expect(eventDispacther.getEventHandlers["ProductCreateEvent"][0]).toMatchObject(eventHandler);

        eventDispacther.unregisterAll();

        expect(eventDispacther.getEventHandlers["ProductCreateEvent"]).toBeUndefined();
    });

    it("should notify all event handlers", () => {
        const eventDispacther = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispacther.register("ProductCreateEvent", eventHandler);

        expect(eventDispacther.getEventHandlers["ProductCreateEvent"][0]).toMatchObject(eventHandler);

        const productCreateEvent = new ProductCreateEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0,
        });

        //Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
        eventDispacther.notify(productCreateEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

});