import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import GlobalResponse from 'src/application-core/wrapper/global-response';

@Injectable()
export default class GlobalResponseMiddleware implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse();
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    return next.handle().pipe(
      map((data) => {
        if (typeof data === 'string') {
          return new GlobalResponse(null, data, []);
          //cuando solo regresas un string como respuesta
        } else {
          return new GlobalResponse(data, 'Ok', []);
          //cuando regresas un objecto
        }
      }),
    );
  }
}
