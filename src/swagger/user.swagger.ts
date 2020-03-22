import { ApiProperty } from '@nestjs/swagger';
import * as CommonApiDocs from '../swagger/common.swagger';

export class User {
  @ApiProperty({ description: 'user ID' })
  id: string;

  @ApiProperty({ description: 'user name' })
  name: string;
  
  @ApiProperty({ description: 'create time of user' })
  createTime: Number;
  
  @ApiProperty({ description: 'last update time of user' })
  updateTime: Number;
}

class UserList {
  @ApiProperty({ description: 'page information' })
  page: CommonApiDocs.PageInfo;

  @ApiProperty({ description: 'user list', type: [User] })
  list: User[];
}

export const UserID = {
  name: "id",
  description: "User ID",
  required: true,
  type: String
};

export class CreateUserDto {
  @ApiProperty({ description: 'user ID' })
  id: string;

  @ApiProperty({ description: 'user name' })
  name: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'user name' })
  name: string;
}

export class GetUsersResponse extends CommonApiDocs.SuccessResponse {
  @ApiProperty({ description: 'user list' })
  data: UserList;
}

export class GetUserResponse extends CommonApiDocs.SuccessResponse {
  @ApiProperty({ description: 'user list' })
  data: User;
}

export class AddUserResponse extends CommonApiDocs.SuccessResponse {
  @ApiProperty({ description: 'user' })
  data: CreateUserDto;
}

export class UpdateUserResponse extends CommonApiDocs.SuccessResponse {
  @ApiProperty({ description: 'user' })
  data: User;
}

export class DeleteUserResponse extends CommonApiDocs.SuccessResponse {
  @ApiProperty({ description: 'user' })
  data: string;
}