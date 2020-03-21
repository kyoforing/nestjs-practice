import { HttpException } from '@nestjs/common';

export const assertion = (statusCode, message, errorCode) => {
    throw new HttpException({ message, errorCode }, statusCode);
}