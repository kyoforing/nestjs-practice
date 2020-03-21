import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { UserService } from './services/user.service';
import { ResponseHepler, ResponseFormat } from '../../helper/format';
import { ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import * as UserApiDocs from '../../swagger/user.swagger';
import * as CommonApiDocs from '../../swagger/common.swagger';

const successStatusCode = () => 200;

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/v1/api/users')
  @ApiTags('User')
  @ApiQuery(CommonApiDocs.PageParam)
  @ApiQuery(CommonApiDocs.LimitParam)
  @ApiQuery(CommonApiDocs.QueryParam)
  @ApiResponse({ status: 200, description: 'User list', type: UserApiDocs.GetUsersResponse})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  async getUsers(@Query() params): Promise<ResponseFormat> {
    const users = await this.userService.getUsers(params);
    const responseHelper = new ResponseHepler(successStatusCode());

    return responseHelper.response(users);
  }

  @Post('/v1/api/user')
  @ApiTags('User')
  async addUser(@Body() body): Promise<ResponseFormat> {
    const users = await this.userService.addUser(body);
    const responseHelper = new ResponseHepler(successStatusCode());

    return responseHelper.response(users);
  }
}

