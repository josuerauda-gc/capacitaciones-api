export interface ConsulData {
  host: string;
  port: string;
  id: string;
  name: string;
  appHost: string;
  appPort: string;
}

export interface EnvironmentData {
  consul: ConsulData;
}

export const ENVIRONMENT_DATA: EnvironmentData = {
  consul: {
    host: process.env.CONSUL_HOST,
    port: process.env.CONSUL_PORT,
    id: process.env.SERVICE_ID,
    name: process.env.SERVICE_NAME,
    appHost: process.env.APP_HOST,
    appPort: process.env.APP_PORT,
  },
};
