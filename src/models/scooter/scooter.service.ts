import { knexInstance as knex } from '../../config/knex';
import { HttpStatus, Injectable } from '@nestjs/common';
import { assertion } from '../../helper/assertion';

class ScooterDao {
  id: number;
  scooterSql: any;

  constructor(id) {
    this.id = id;
  }

  async getScooter(condition?: { column: string, value: string | number }) {
    this.scooterSql = knex('scooter')
      .select('id')
      .select('plateNo')
      .select(knex.raw('UNIX_TIMESTAMP(createTime) * 1000 AS createTime'))
      .select(knex.raw('UNIX_TIMESTAMP(updateTime) * 1000 AS updateTime'));

    if (!condition) condition = { column: 'default', value: 0 };
    switch (condition.column) {
      case 'id': return await this.getScooterById(condition.value);
      case 'plateNo': return await this.getScooterByPlateNo(condition.value);
      default: return await this.getScooterById(this.id);
    }
  }

  private async getScooterById(id) {
    return await this.scooterSql.where('id', id)
      .then(rows => rows.length > 0 ? rows[0] : null);
  }

  private async getScooterByPlateNo(plateNo) {
    return await this.scooterSql.where('plateNo', plateNo)
      .then(rows => rows.length > 0 ? rows[0] : null);
  }

  async updateScooter(scooter) {
    await knex('scooter')
      .update(scooter)
      .where('id', this.id);
  }

  async deleteScooter() {
    await knex('scooter')
      .delete()
      .where('id', this.id);
  }
}

@Injectable()
export class ScooterService {
  async getScooters(query): Promise<any> {
    const { q, page = 0, limit = 10 } = query;
    const pageInfo = {
      page: +page,
      pages: 0,
      limit: +limit,
      count: 0,
    };

    //Get Scooter count
    const scootersCountSql = knex('scooter').count({ count: 'id' });
    if (q) scootersCountSql.where('plateNo', 'like', `%${q}%`);

    const scootersCount = await scootersCountSql;

    //Get Scooter list
    const scootersSql = knex('scooter')
      .select('id')
      .select('plateNo')
      .select(knex.raw('UNIX_TIMESTAMP(createTime) * 1000 AS createTime'))
      .select(knex.raw('UNIX_TIMESTAMP(updateTime) * 1000 AS updateTime'));
    if (q) scootersSql.where('plateNo', 'like', `%${q}%`);

    if (page) {
      pageInfo.count = scootersCount.length > 0 ? scootersCount[0].count : 0;
      pageInfo.pages = Math.ceil(pageInfo.count / limit);
      pageInfo.page = pageInfo.page > pageInfo.pages ? pageInfo.pages : pageInfo.page;

      const offset = pageInfo.page > 0 ? (pageInfo.page - 1) * limit : 0;
      scootersSql.limit(limit).offset(offset);
    }

    //result
    const result = {
      page: pageInfo,
      list: await scootersSql,
    };

    return result;
  }

  async getScooter(id): Promise<any> {
    const ScooterClass = new ScooterDao(id);
    const scooter = await ScooterClass.getScooter();

    if (!scooter) assertion(HttpStatus.BAD_REQUEST, 'Scooter not found ', '01');

    return scooter;
  }

  async createScooter(body): Promise<any> {
    const { plateNo } = body;
    const scooter = { plateNo };

    if (!plateNo || plateNo.length >= 10) assertion(HttpStatus.BAD_REQUEST, 'invalid plate number', '04');

    const ScooterClass = new ScooterDao(0);
    const currentScooter = await ScooterClass.getScooter({ column: 'plateNo', value: plateNo });
    if (currentScooter) assertion(HttpStatus.BAD_REQUEST, 'duplicate scooter', '02');

    const id = await knex('Scooter').insert(scooter)
      .then(rows => rows.length > 0 ? rows[0] : null);

    return await ScooterClass.getScooter({ column: 'id', value: id });
  }

  async updateScooter(id, body): Promise<any> {
    const { plateNo } = body;
    const ScooterClass = new ScooterDao(id);
    const scooter = await ScooterClass.getScooter();

    if (!scooter) assertion(HttpStatus.BAD_REQUEST, 'Scooter not found ', '01');
    if (plateNo) {
      const currentScooter = await ScooterClass.getScooter({ column: 'plateNo', value: plateNo });

      if (currentScooter) assertion(HttpStatus.BAD_REQUEST, 'duplicate scooter', '02');
      if (plateNo.length >= 10) assertion(HttpStatus.BAD_REQUEST, 'invalid name', '04');

      await ScooterClass.updateScooter({ plateNo });
    }

    return await ScooterClass.getScooter();
  }

  async deleteScooter(id): Promise<any> {
    const ScooterClass = new ScooterDao(id);
    const scooter = await ScooterClass.getScooter();

    if (!scooter) assertion(HttpStatus.BAD_REQUEST, 'Scooter not found ', '01');
    ScooterClass.deleteScooter();

    return true;
  }
}