import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './models/user/user.controller';
import { UserService } from './models/user/services/user.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();
  });

  // describe('getHello', () => {
  //   it('should return "Hello World!"', () => {
  //     const appController = app.get<UserController>(UserController);
  //     expect(appController.getUsers()).toBe('Hello World!');
  //   });
  // });
});
