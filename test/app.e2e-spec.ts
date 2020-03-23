import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/v1/api/sum-of-age (GET)', (done) => {
    return request(app.getHttpServer())
      .get('/v1/api/sum-of-age')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const responseObj = JSON.parse(res.text);
        expect(responseObj.data.result).toBe(18);

        return done();
      });
  });
});
