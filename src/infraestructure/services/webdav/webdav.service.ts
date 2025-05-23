import { Injectable } from '@nestjs/common';
import { AuthType, createClient, WebDAVClient } from 'webdav';

@Injectable()
export class WebdavService {
  private readonly webdavClient: WebDAVClient;

  constructor() {
    this.webdavClient = createClient(process.env.WEBDAV_URL, {
      authType: AuthType.Password,
      username: process.env.WEBDAV_USERNAME,
      password: process.env.WEBDAV_PASSWORD,
    });
  }

  async onModuleInit() {
    try {
      const contents = await this.webdavClient.getDirectoryContents(
        process.env.WEBDAV_PATH || '/',
      );
      console.log('Contenido WebDAV:', contents);
    } catch (error) {
      console.error('Error al obtener el contenido WebDAV:', error.message);
      if (error.response) {
        console.error('Detalles de la respuesta:', error.response);
      }
    }
  }
}
