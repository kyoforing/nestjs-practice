import { ApiProperty } from '@nestjs/swagger';

export const PageParam = {
  name: "page",
  description: "current page",
  required: false,
  type: Number
};

export const LimitParam = {
  name: "limit",
  description: "display rows per page",
  required: false,
  type: Number
};

export const QueryParam = {
  name: "q",
  description: "search data by keyword",
  required: false,
  type: String
};

export class PageInfo {
  @ApiProperty({ description: 'current page' })
  page: number;

  @ApiProperty({ description: 'total pages' })
  pages: number;

  @ApiProperty({ description: 'data count per page' })
  limit: number;

  @ApiProperty({ description: 'total data count' })
  count: number;
}