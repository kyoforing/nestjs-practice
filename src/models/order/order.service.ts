import { knexInstance as knex } from '../../config/knex';
import { HttpStatus, Injectable } from '@nestjs/common';
import { assertion } from '../../helper/assertion';
import { ScooterService } from '../scooter/scooter.service';
import { UserService } from '../user/user.service';

const addOrdersCondition = (sql, q) => {
  if (q) {
    sql.where(function () {
      this.where('o.id', 'like', `%${q}%`);
      this.orWhere('u.id', 'like', `%${q}%`);
      this.orWhere('u.name', 'like', `%${q}%`);
      this.orWhere('s.plateNo', 'like', `%${q}%`);
    });
  }
}

const getScooterStatus = async scooterId => {
  return await knex('order')
    .select('id')
    .where('scooterId', scooterId)
    .where('status', 'rented')
    .then(rows => rows.length > 0 ? 'rented' : 'idle');
}

class OrderDao {
  id: string;

  constructor(id) {
    this.id = id;
  }

  async getOrder() {
    return await knex('order as o')
      .innerJoin('user as u', 'o.userId', 'u.id')
      .innerJoin('scooter as s', 'o.scooterId', 's.id')
      .select({
        id: 'o.id',
        userId: 'u.id',
        name: 'u.name',
        plateNo: 's.plateNo',
        status: 'o.status'
      })
      .select(knex.raw('UNIX_TIMESTAMP(o.createTime) * 1000 AS createTime'))
      .select(knex.raw('UNIX_TIMESTAMP(o.updateTime) * 1000 AS updateTime'))
      .where('o.id', this.id)
      .then(rows => rows.length > 0 ? rows[0] : null);
  }

  async completedOrder() {
    await knex('order')
      .update('status', 'completed')
      .where('id', this.id);
  }
}

@Injectable()
export class OrderService {
  async getOrders(query): Promise<any> {
    const { q, page = 0, limit = 10 } = query;
    const pageInfo = {
      page: +page,
      pages: 0,
      limit: +limit,
      count: 0,
    };

    //Get order count
    const ordersCountSql = knex('order as o')
      .innerJoin('user as u', 'o.userId', 'u.id')
      .innerJoin('scooter as s', 'o.scooterId', 's.id')
      .count({ count: 'o.id' });
    addOrdersCondition(ordersCountSql, q)
    const ordersCount = await ordersCountSql;

    //Get order list
    const ordersSql = knex('order as o')
      .innerJoin('user as u', 'o.userId', 'u.id')
      .innerJoin('scooter as s', 'o.scooterId', 's.id')
      .select({
        id: 'o.id',
        userId: 'u.id',
        name: 'u.name',
        plateNo: 's.plateNo',
        status: 'o.status'
      })
      .select(knex.raw('UNIX_TIMESTAMP(o.createTime) * 1000 AS createTime'))
      .select(knex.raw('UNIX_TIMESTAMP(o.updateTime) * 1000 AS updateTime'));
    addOrdersCondition(ordersSql, q);

    if (page) {
      pageInfo.count = ordersCount.length > 0 ? ordersCount[0].count : 0;
      pageInfo.pages = Math.ceil(pageInfo.count / limit);
      pageInfo.page = pageInfo.page > pageInfo.pages ? pageInfo.pages : pageInfo.page;

      const offset = pageInfo.page > 0 ? (pageInfo.page - 1) * limit : 0;
      ordersSql.limit(limit).offset(offset);
    }

    //result
    const result = {
      page: pageInfo,
      list: await ordersSql,
    };

    return result;
  }

  async getOrder(id): Promise<any> {
    const OrderClass = new OrderDao(id);
    const order = await OrderClass.getOrder();

    if (!order) assertion(HttpStatus.BAD_REQUEST, 'order not found ', '01');

    return order;
  }

  async addOrder(body): Promise<any> {
    const { userId = 0, scooterId = 0 } = body;
    const order = { userId, scooterId, status: 'rented' };

    const UserClass = new UserService()
    const ScooterClass = new ScooterService()
    const user = await UserClass.getUser(userId);
    const scooter = await ScooterClass.getScooter(scooterId);
    const status = await getScooterStatus(scooterId);

    if (!user) assertion(HttpStatus.BAD_REQUEST, 'user not found ', '01');
    if (!scooter) assertion(HttpStatus.BAD_REQUEST, 'scooter not found ', '01');
    if (status === 'rented') assertion(HttpStatus.BAD_REQUEST, 'scooter is used', '06');

    const id = await knex('order').insert(order)
      .then(rows => rows.length > 0 ? rows[0] : null);
    const OrderClass = new OrderDao(id);

    return await OrderClass.getOrder();
  }

  async completeOrder(id): Promise<any> {
    const OrderClass = new OrderDao(id);
    const order = await OrderClass.getOrder();

    if (!order) assertion(HttpStatus.BAD_REQUEST, 'order not found ', '01');
    await OrderClass.completedOrder();

    return true;
  }
}