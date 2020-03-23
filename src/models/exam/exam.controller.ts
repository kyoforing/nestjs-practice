import { Controller, Get } from '@nestjs/common';
import { ResponseHepler, ResponseFormat } from '../../helper/format';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import * as ExamApiDocs from '../../swagger/exam.swagger';
import * as CommonApiDocs from '../../swagger/common.swagger';

const successStatusCode = () => 200;

@Controller()
export class ExamController {
  @ApiTags('Exam')
  @ApiResponse({ status: 200, description: 'Sum of people age', type: ExamApiDocs.GetExamResponse })
  @ApiResponse({ status: 400, description: 'Bad Request', type: CommonApiDocs.BadRequestResponse})
  @Get('/v1/api/sum-of-age')
  async getSumOfAge(): Promise<ResponseFormat> {
    const people = [{ id: 1, age: 3 }, { id: 2, age: 4 }, { id: 3, age: 6 }, { id: 4, age: 5 }];
    const responseHelper = new ResponseHepler(successStatusCode());
    const result = {
      people,
      result:　people.map(el => el.age).reduce((a, b) => a + b, 0)
    }

    return responseHelper.response(result);
  }
}

