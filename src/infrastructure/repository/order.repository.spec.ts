import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  function getCustomer(sequence: string){
    const customer = new Customer("c" + sequence, "Customer" + sequence);
    const address = new Address("Street" + sequence, 1, "Zipcode" + sequence, "City" + sequence);
    customer.changeAddress(address);  

    return customer;
  }

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("p1", "Product 1", 10);
    const product2 = new Product("p2", "Product 2", 20);
    await productRepository.create(product1);
    await productRepository.create(product2);

    const orderItem1 = new OrderItem("oi1", product1.name, product1.price, product1.id, 2);
    const orderItem2 = new OrderItem("oi2", product2.name, product2.price, product2.id, 2);

    const order = new Order("o1", customer.id, [orderItem1, orderItem2]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: order.id,
          product_id: orderItem1.productId,
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          order_id: order.id,
          product_id: orderItem2.productId,
        }        
      ],
    });
  });
 
  it("should update a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "oi1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("o1", "c1", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    product.changeName("Product 2");
    product.changePrice(20);

    const orderItemUp = new OrderItem(
      "oi1",
      product.name,
      product.price,
      product.id,
      4
    );
    const orderUp = new Order("o1", "c1", [orderItemUp]);

    await orderRepository.update(orderUp);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: orderUp.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: order.id,
          product_id: orderItem.productId,
        },
      ],
    });
  });

  it("should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "oi1",
      product.name,
      product.price,
      product.id,
      1
    );
    const order = new Order("o1", "c1", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    const foundOrder = await orderRepository.find("o1");

    expect(order).toStrictEqual(foundOrder);
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "oi1",
      product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("o1", "c1", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    
    const product2 = new Product("p2", "Product 2", 20);
    await productRepository.create(product2);

    const orderItem2 = new OrderItem(
      "oi2",
      product2.name,
      product2.price,
      product2.id,
      1
    );
    const order2 = new Order("o2", "c1", [orderItem2]);
    await orderRepository.create(order2);
    const foundAllOrders = await orderRepository.findAll();

    expect(foundAllOrders).toHaveLength(2);
  });

});
