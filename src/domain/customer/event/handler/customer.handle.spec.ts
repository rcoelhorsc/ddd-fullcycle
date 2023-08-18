import Customer from "../../entity/customer"
import CustomerCreateEvent from "../customer-created.event"
import InformWhenCustomerIsCreateHandler from "./inform-customer-is-create.handler"
import InformWhenCustomerAddressIsChangedHandler from "./inform-customer-address-changed.handler"
import ConfirmWhenCustomerIsCreateHandler from "./confirm-customer-is-create.handler"
import Address from "../../value-object/address"
import CustomerChangedAddressEvent from "../customer-changed.address-event"


describe('Customer Handler Unit Tests', () => {
    let spyConsoleLog: any
  
    beforeEach(() => {
      spyConsoleLog = jest.spyOn(console, 'log')
    })
  
    afterEach(() => {
      spyConsoleLog.mockRestore()
    })
  
    it('should inform when customer is created handler', () => {
      const customer = new Customer('1', 'Customer 1')
      const customerCreatedEvent = new CustomerCreateEvent(customer)
  
      new InformWhenCustomerIsCreateHandler().handle(customerCreatedEvent)
  
      expect(spyConsoleLog).toHaveBeenCalledWith(
        'Esse é o primeiro console.log do evento: CustomerCreated'
      )
    })
  
    it('should confirm when customer is created handler', () => {
      const customer = new Customer('c1', 'Customer 1')
      const customerCreatedEvent = new CustomerCreateEvent(customer)
  
      new ConfirmWhenCustomerIsCreateHandler().handle(customerCreatedEvent)
  
      expect(spyConsoleLog).toHaveBeenCalledWith(
        'Esse é o segundo console.log do evento: CustomerCreated'
      )
    })
  
    it('should inform when customer address is changed Handler', () => {
      const customer = new Customer('c1', 'Customer 1')
      const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
      customer.changeAddress(address)
      const customerChangedAddressEvent = new CustomerChangedAddressEvent({
        id: customer.id,
        name: customer.name,
        address: customer.Address.toString(),
      })
  
      new InformWhenCustomerAddressIsChangedHandler().handle(customerChangedAddressEvent)
  
      expect(spyConsoleLog).toHaveBeenCalledWith(
        `Endereço do cliente: ${customer.id}, ${
          customer.name
        } alterado para: ${customer.Address.toString()}`
      )
    })
  })