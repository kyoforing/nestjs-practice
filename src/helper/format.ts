export class ResponseHepler {
    statusCode: number;
    errorCode: string;

    constructor(statusCode: number, errorCode?: string) {
        this.statusCode = statusCode;
        this.errorCode = errorCode || '0';
    }

    response (data?: any, message?: string) {
        switch(this.statusCode) {
            case 200: return this.success(data, message);
            case 403: return this.forbidden(data, message);
            default: return this.badRequest(data, message);
        }
    }

    private success(data: any = null, message: any = 'OK'): ResponseFormat {
        const { statusCode = 200, errorCode } = this;
        return { statusCode, errorCode, data, message }
    }

    private badRequest(data: any = null, message: any = 'Bad Request'): ResponseFormat {
        const { statusCode = 400, errorCode } = this;
        return { statusCode, errorCode, data, message }
    }

    private forbidden(data: any = null, message: any = 'Forbidden'): ResponseFormat {
        const { statusCode = 403, errorCode } = this;
        return { statusCode, errorCode, data, message }
    }
}

export type ResponseFormat = {
    statusCode: number,
    errorCode: string,
    data: any,
    message: any
}