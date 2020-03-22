import { Controller, Get, Post, Put, Delete, Query, Body, Param } from '@nestjs/common';
import { UserService } from './services/user.service';
import { ResponseHepler, ResponseFormat } from '../../helper/format';
import { ApiResponse, ApiCreatedResponse, ApiTags, ApiQuery, ApiBody, ApiParam } from '@nestjs/swagger';
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
  @ApiResponse({ status: 400, description: 'Bad Request', type: CommonApiDocs.BadRequestResponse})
  async getUsers(@Query() params): Promise<ResponseFormat> {
    const users = await this.userService.getUsers(params);
    const responseHelper = new ResponseHepler(successStatusCode());

    return responseHelper.response(users);
  }

  @Get('/v1/api/user/:id')
  @ApiTags('User')
  @ApiParam(UserApiDocs.UserID)
  @ApiResponse({ status: 200, description: 'User information', type: UserApiDocs.GetUserResponse})
  @ApiResponse({ status: 400, description: 'Bad Request', type: CommonApiDocs.BadRequestResponse})
  async getUser(@Param() params): Promise<ResponseFormat> {
    const user = await this.userService.getUser(params.id);
    const responseHelper = new ResponseHepler(successStatusCode());

    return responseHelper.response(user);
  }

  @Post('/v1/api/user')
  @ApiTags('User')
  @ApiBody({ type: UserApiDocs.CreateUserDto })
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: UserApiDocs.AddUserResponse})
  @ApiResponse({ status: 400, description: 'Bad Request', type: CommonApiDocs.BadRequestResponse})
  async addUser(@Body() body): Promise<ResponseFormat> {
    const user = await this.userService.addUser(body);
    const responseHelper = new ResponseHepler(successStatusCode());

    return responseHelper.response(user);
  }

  @Put('/v1/api/user/:id')
  @ApiTags('User')
  @ApiParam(UserApiDocs.UserID)
  @ApiBody({ type: UserApiDocs.UpdateUserDto })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: UserApiDocs.UpdateUserResponse})
  @ApiResponse({ status: 400, description: 'Bad Request', type: CommonApiDocs.BadRequestResponse})
  async updateUser(@Param() params, @Body() body): Promise<ResponseFormat> {
    const user = await this.userService.updateUser(params.id, body);
    const responseHelper = new ResponseHepler(successStatusCode());

    return responseHelper.response(user);
  }

  @Delete('/v1/api/user/:id')
  @ApiTags('User')
  @ApiParam(UserApiDocs.UserID)
  @ApiResponse({ status: 200, description: 'The record has been successfully deleted.', type: UserApiDocs.DeleteUserResponse})
  @ApiResponse({ status: 400, description: 'Bad Request', type: CommonApiDocs.BadRequestResponse})
  async deleteUser(@Param() params, @Body() body): Promise<ResponseFormat> {
    await this.userService.deleteUser(params.id);
    const responseHelper = new ResponseHepler(successStatusCode());

    return responseHelper.response('OK');
  }
}

