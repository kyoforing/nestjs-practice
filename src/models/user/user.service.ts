import { knexInstance as knex } from '../../config/knex';
import { HttpStatus, Injectable } from '@nestjs/common';
import { assertion } from '../../helper/assertion';

const createUsersCondition = (sql, q) => {
  if (q) {
    sql.where(function () {
      this.where('id', 'like', `%${q}%`);
      this.orWhere('name', 'like', `%${q}%`);
    });
  }
}

class UserDao {
  id: string;

  constructor(id) {
    this.id = id;
  }

  async getUser() {
    return await knex('user')
      .select('id')
      .select('name')
      .select(knex.raw('UNIX_TIMESTAMP(createTime) * 1000 AS createTime'))
      .select(knex.raw('UNIX_TIMESTAMP(updateTime) * 1000 AS updateTime'))
      .where('id', this.id)
      .then(rows => rows.length > 0 ? rows[0] : null);
  }

  async updateUser(user) {
    await knex('user')
      .update(user)
      .where('id', this.id);
  }

  async deleteUser() {
    await knex('user')
      .delete()
      .where('id', this.id);
  }
}

@Injectable()
export class UserService {
  async getUsers(query): Promise<any> {
    const { q, page = 0, limit = 10 } = query;
    const pageInfo = {
      page: +page,
      pages: 0,
      limit: +limit,
      count: 0,
    };

    //Get user count
    const usersCountSql = knex('user').count({ count: 'id' });
    createUsersCondition(usersCountSql, q)
    const usersCount = await usersCountSql;

    //Get user list
    const usersSql = knex('user')
      .select('id')
      .select('name')
      .select(knex.raw('UNIX_TIMESTAMP(createTime) * 1000 AS createTime'))
      .select(knex.raw('UNIX_TIMESTAMP(updateTime) * 1000 AS updateTime'));
    createUsersCondition(usersSql, q);

    if (page) {
      pageInfo.count = usersCount.length > 0 ? usersCount[0].count : 0;
      pageInfo.pages = Math.ceil(pageInfo.count / limit);
      pageInfo.page = pageInfo.page > pageInfo.pages ? pageInfo.pages : pageInfo.page;

      const offset = pageInfo.page > 0 ? (pageInfo.page - 1) * limit : 0;
      usersSql.limit(limit).offset(offset);
    }

    //result
    const result = {
      page: pageInfo,
      list: await usersSql,
    };

    return result;
  }

  async getUser(id): Promise<any> {
    const UserClass = new UserDao(id);
    const user = await UserClass.getUser();

    if(!user) assertion(HttpStatus.BAD_REQUEST, 'user not found ', '01');
    
    return user;
  }

  async createUser(body): Promise<any> {
    const { id, name } = body;
    const user = { id, name };

    if (!id || id.length !== 10) assertion(HttpStatus.BAD_REQUEST, 'user id must be 10 characters', '03');
    if (!name || name.length >= 10) assertion(HttpStatus.BAD_REQUEST, 'invalid name', '04');

    const UserClass = new UserDao(id);
    const currentUser = await UserClass.getUser();

    if(currentUser) assertion(HttpStatus.BAD_REQUEST, 'duplicate user', '02');

    await knex('user').insert(user);

    return user;
  }

  async updateUser(id, body): Promise<any> {
    const { name } = body;
    const UserClass = new UserDao(id);
    const user = await UserClass.getUser();

    if(!user) assertion(HttpStatus.BAD_REQUEST, 'user not found ', '01');
    if (name) {
      if (name.length >= 10) assertion(HttpStatus.BAD_REQUEST, 'invalid name', '04');
      
      await UserClass.updateUser({ name });
    }
    
    return await UserClass.getUser();
  }

  async deleteUser(id): Promise<any> {
    const UserClass = new UserDao(id);
    const user = await UserClass.getUser();

    if(!user) assertion(HttpStatus.BAD_REQUEST, 'user not found ', '01');

    UserClass.deleteUser();
    
    return true;
  }
}