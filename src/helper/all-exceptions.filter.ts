import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ResponseHepler } from '../helper/format';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.BAD_REQUEST;
        const responseHelper = new ResponseHepler(status, exception.response ? exception.response.errorCode : 'unknown');

        console.log(exception);

        response.status(status).json(responseHelper.response(null, exception.message))
    }
}