import { Test, TestingModule } from '@nestjs/testing';
import { ExamController } from './models/exam/exam.controller';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [ExamController],
      providers: [],
    }).compile();
  });

  describe('Validate sum of age', () => {
    it('should return 18', async () => {
      const appController = app.get<ExamController>(ExamController);
      const response = await appController.getSumOfAge();

      expect(response.data.result).toBe(18);
    });
  });
});
