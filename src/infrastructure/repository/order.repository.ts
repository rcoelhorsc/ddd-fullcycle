import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderRepositoryInterface from "../../domain/repository/order-repository-interface";

function orderItemToDatabase(orderItem: OrderItem) {
	return {
		id: orderItem.id,
		productId: orderItem.productId,
		name: orderItem.name,
		quantity: orderItem.quantity,
	};
}

function orderItemModelToOrderItem(orderItemModel: OrderItemModel) {
	return new OrderItem(orderItemModel.id, orderItemModel.name, orderItemModel.price, orderItemModel.product_id, orderItemModel.quantity);
}

export default class OrderRepository implements OrderRepositoryInterface
{
    async create(entity: Order): Promise<void> {
      await OrderModel.create({
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{model: OrderItemModel}],
      }
      );
    }

    async update(entity: Order): Promise<void> {
      await OrderModel.update(
        {
          id: entity.id,
          customer_id: entity.customerId,
          total: entity.total(),
          items: entity.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
          })),
        },
        {
          where: {
            id: entity.id,
          },
        }
      );
    }

    async find(id: string): Promise<Order> {
      let orderModel;
      try {
        orderModel = await OrderModel.findOne({
          where: {
            id,
          },
          include: ["items"],
          rejectOnEmpty: true,
        });
      } catch (error) {
        throw new Error("Order not found");
      }
      const orderItems = orderModel.items.map((item) => {
        let orderItem = new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        );
        return orderItem;
      });
  
      return new Order(id, orderModel.customer_id, orderItems);
    }
  
    async findAll(): Promise<Order[]> {
      const orderModels = await OrderModel.findAll({
        include: [{ model: OrderItemModel }],
      });
      const orders = orderModels.map((orderModel) => {
        let order = new Order(
          orderModel.id,
          orderModel.customer_id,
          orderModel.items.map((item) => {
            let orderItem = new OrderItem(
              item.id,
              item.name,
              item.price,
              item.product_id,
              item.quantity
            );
  
            return orderItem;
          })
        );
        return order;
      });
      return orders;
    }

  }
  