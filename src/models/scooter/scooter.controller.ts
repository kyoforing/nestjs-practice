import { Controller, Get, Post, Put, Delete, Query, Body, Param } from '@nestjs/common';
import { ScooterService } from './scooter.service';
import { ResponseHepler, ResponseFormat } from '../../helper/format';
import { ApiResponse, ApiCreatedResponse, ApiTags, ApiQuery, ApiBody, ApiParam } from '@nestjs/swagger';
import * as ScooterApiDocs from '../../swagger/scooter.swagger';
import * as CommonApiDocs from '../../swagger/common.swagger';

const successStatusCode = () => 200;

@Controller()
export class ScooterController {
  constructor(private readonly scooterService: ScooterService) {}

  @Get('/v1/api/scooters')
  @ApiTags('Scooter')
  @ApiQuery(CommonApiDocs.PageParam)
  @ApiQuery(CommonApiDocs.LimitParam)
  @ApiQuery(CommonApiDocs.QueryParam)
  @ApiResponse({ status: 200, description: 'Scooter list', type: ScooterApiDocs.GetScootersResponse})
  @ApiResponse({ status: 400, description: 'Bad Request', type: CommonApiDocs.BadRequestResponse})
  async getScooters(@Query() params): Promise<ResponseFormat> {
    const Scooters = await this.scooterService.getScooters(params);
    const responseHelper = new ResponseHepler(successStatusCode());

    return responseHelper.response(Scooters);
  }

  @Get('/v1/api/scooter/:id')
  @ApiTags('Scooter')
  @ApiParam(ScooterApiDocs.ScooterID)
  @ApiResponse({ status: 200, description: 'Scooter information', type: ScooterApiDocs.GetScooterResponse})
  @ApiResponse({ status: 400, description: 'Bad Request', type: CommonApiDocs.BadRequestResponse})
  async getScooter(@Param() params): Promise<ResponseFormat> {
    const Scooter = await this.scooterService.getScooter(params.id);
    const responseHelper = new ResponseHepler(successStatusCode());

    return responseHelper.response(Scooter);
  }

  @Post('/v1/api/scooter')
  @ApiTags('Scooter')
  @ApiBody({ type: ScooterApiDocs.CreateScooterDto })
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: ScooterApiDocs.AddScooterResponse})
  @ApiResponse({ status: 400, description: 'Bad Request', type: CommonApiDocs.BadRequestResponse})
  async addScooter(@Body() body): Promise<ResponseFormat> {
    const Scooter = await this.scooterService.addScooter(body);
    const responseHelper = new ResponseHepler(successStatusCode());

    return responseHelper.response(Scooter);
  }

  @Put('/v1/api/scooter/:id')
  @ApiTags('Scooter')
  @ApiParam(ScooterApiDocs.ScooterID)
  @ApiBody({ type: ScooterApiDocs.UpdateScooterDto })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: ScooterApiDocs.UpdateScooterResponse})
  @ApiResponse({ status: 400, description: 'Bad Request', type: CommonApiDocs.BadRequestResponse})
  async updateScooter(@Param() params, @Body() body): Promise<ResponseFormat> {
    const Scooter = await this.scooterService.updateScooter(params.id, body);
    const responseHelper = new ResponseHepler(successStatusCode());

    return responseHelper.response(Scooter);
  }

  @Delete('/v1/api/scooter/:id')
  @ApiTags('Scooter')
  @ApiParam(ScooterApiDocs.ScooterID)
  @ApiResponse({ status: 200, description: 'The record has been successfully deleted.', type: ScooterApiDocs.DeleteScooterResponse})
  @ApiResponse({ status: 400, description: 'Bad Request', type: CommonApiDocs.BadRequestResponse})
  async deleteScooter(@Param() params): Promise<ResponseFormat> {
    await this.scooterService.deleteScooter(params.id);
    const responseHelper = new ResponseHepler(successStatusCode());

    return responseHelper.response('OK');
  }
}

