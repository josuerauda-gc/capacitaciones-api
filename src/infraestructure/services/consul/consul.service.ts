import { Injectable } from '@nestjs/common';
import * as Consul from 'consul';
import {
  ConsulData,
  ENVIRONMENT_DATA,
} from 'src/application-core/interfaces/i-consul';

interface Checking {
  http: string;
  tcp: string;
  interval: string;
  timeout: string;
  ttl: string;
}

interface ServiceRegistered {
  id: string;
  name: string;
  address: string;
  port: number;
  check: Checking;
}

@Injectable()
export default class ConsulService {
  private readonly consulData: ConsulData = ENVIRONMENT_DATA.consul;

  private async isServiceRegistered(
    serviceName: string,
    consulClient: Consul.Consul,
  ): Promise<boolean> {
    try {
      const services = await consulClient.agent.service.list();
      return Object.keys(services).includes(serviceName);
    } catch (error) {
      console.error('Error checking service registration:', error);
      throw error;
    }
  }

  async RegisterService(consulData: ConsulData): Promise<void> {
    try {
      const conn = new Consul({
        host: this.consulData.host,
        port: this.consulData.port,
        promisify: true,
      });
      const isRegistered: boolean = await this.isServiceRegistered(
        this.consulData.name,
        conn,
      );

      if (isRegistered === true) {
        await conn.agent.service.deregister(this.consulData.id);
      } //valida si el servicio ya esta registrado / lo desregistra

      const serviceData: ServiceRegistered = {
        id: this.consulData.id,
        name: this.consulData.name,
        address: this.consulData.appHost,
        port: Number(this.consulData.appPort),
        check: {
          http: `http://${this.consulData.appHost}:${this.consulData.appPort}/health`,
          tcp: `${this.consulData.appHost}:${this.consulData.appPort}`,
          interval: '10s',
          timeout: '5s',
          ttl: '60s',
        },
      }; //datos de configuracion del servicio

      // console.log(serviceData);

      await conn.agent.service.register(serviceData);
      console.log('Servicio Registrado Exitosamente en Consul 📄');
    } catch (error) {
      console.error(error);
      console.warn('servicio no registrado, intentando nuevamente el registro');
      setTimeout(async () => await this.RegisterService(consulData), 10000);
    }
  }

  async GetServiceData(serviceName: string): Promise<ConsulData> {
    try {
      const conn = new Consul({
        host: this.consulData.host,
        port: this.consulData.port,
        promisify: true,
      });
      const services: any = await conn.catalog.service.nodes(serviceName);
      // console.log(services);
      const service = services[0];
      // console.log(`Servicio ${serviceName}: `, service);
      return {
        host: service.ServiceAddress,
        port: service.ServicePort.toString(),
        id: service.ID,
        name: service.ServiceName,
        appHost: service.ServiceAddress,
        appPort: service.ServicePort.toString(),
      };
    } catch (error) {
      console.error('Error getting service data:', error);
      throw [`Error al obtener servicio ${serviceName}`, error];
    }
  }
}
