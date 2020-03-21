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

export class GetUsersResponse {
  @ApiProperty({ description: 'status code' })
  statusCode: number;

  @ApiProperty({ description: 'error code' })
  errorCode: string;

  @ApiProperty({ description: 'user list' })
  data: UserList;

  @ApiProperty({ description: 'message' })
  message: string;
}
