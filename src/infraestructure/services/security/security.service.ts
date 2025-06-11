import { Injectable } from '@nestjs/common';
import axios from 'axios';
import NotAuthorizedException from 'src/application-core/exception/not-auhorized-exception';
import ConsulService from '../consul/consul.service';
import { AxiosResponse } from 'src/application-core/wrapper/axios-response';
import { ExpiredTokenException } from 'src/application-core/exception/expired-token-exception';
import ISecurity from 'src/application-core/interfaces/i-security';
import EmployedRequest from 'src/application-core/wrapper/employed-request';

@Injectable()
export default class SecurityService implements ISecurity {
  constructor(private readonly consulService: ConsulService) {}

  async GetUserData(token: string) {
    try {
      const securityName = process.env.SECURITY_SERVICE || '';
      const microData = await this.consulService.GetServiceData(securityName);
      const security = microData;
      const host: string = process.env.DEV
        ? process.env.APP_HOST || 'localhost'
        : security.host;
      const port = process.env.DEV ? 88 : security.port;
      // const url = `http://${host}:${port}/user/data`;
      const url = `http://localhost:${port}/user/data`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const req: AxiosResponse = response.data;

      if (!req.success) {
        if (req.errors !== null && req.errors.length > 0) {
          throw new Error(req.errors.toString());
        }
      }

      const employedData: EmployedRequest = req.data;
      return employedData;
    } catch (error: any) {
      console.log(error);
      if (error.response.status) {
        switch (error.response.status) {
          case 401: {
            const errors: string[] = error.response.data.errors;
            //console.log(errors);
            throw new ExpiredTokenException(errors);
          }
          case 403: {
            const errors = error.response.data.errors;
            throw new NotAuthorizedException(errors);
          }
          default: {
            const errors = error.response.data.errors
              ? error.response.data.errors
              : ['Error desconocido en la obtencion de credenciales'];
            throw new Error(errors.toString());
          }
        }
      }
      throw new Error('Error al obtener los datos de seguridad de empleado');
    }
  }
}
