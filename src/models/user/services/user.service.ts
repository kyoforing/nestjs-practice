import { knexInstance as knex } from '../../../config/knex';
import { HttpStatus, Injectable } from '@nestjs/common';
import { assertion } from '../../../helper/assertion';

const addUsersCondition = (sql, q) => {
  if (q) {
    sql.where(function () {
      this.where('id', 'like', `%${q}%`);
      this.orWhere('name', 'like', `%${q}%`);
    });
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
    const usersCountSql = knex('users').count({ count: 'id' });
    addUsersCondition(usersCountSql, q)
    const usersCount = await usersCountSql;

    //Get user list
    const usersSql = knex('users')
      .select('id')
      .select('name')
      .select(knex.raw('UNIX_TIMESTAMP(createTime) * 1000 AS createTime'))
      .select(knex.raw('UNIX_TIMESTAMP(updateTime) * 1000 AS updateTime'));
    addUsersCondition(usersSql, q);

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

  async addUser(body): Promise<any> {
    const { id, name } = body;
    const user = { id, name };

    if (!id || id.length !== 10) assertion(HttpStatus.BAD_REQUEST, 'user id must be 10 characters', '01');

    await knex('users').insert(user);

    return user;
  }
}