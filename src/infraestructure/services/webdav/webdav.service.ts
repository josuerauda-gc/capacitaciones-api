import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ImagesDto } from 'src/application-core/dto/general/images-dto';
import { AuthType, createClient, WebDAVClient } from 'webdav';
import { NotFoundException } from 'src/application-core/exception/not-found-exception';

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
      if (contents) {
        console.log(
          'Se conectó correctamente al servidor por medio de WebDAV 🌐',
        );
      }
      const imgTest = fs.readFileSync(`${__dirname}/mip.jpg`);
      await this.saveImage('test', {
        idImg: 0,
        name: 'mip.jpg',
        base64: Buffer.from(imgTest).toString('base64'),
      });
      const imageSaved = await this.getImage('test', 'mip.jpg');
      console.log('Imagen guardada y obtenida correctamente:', imageSaved);
      // await this.deleteImage('test', 'mip.jpg');
    } catch (error) {
      console.error('Error al obtener el contenido WebDAV:', error.message);
      if (error.response) {
        console.error('Detalles de la respuesta:', error.response);
      }
    }
  }

  async saveImage(evaluationCode: string, image: ImagesDto): Promise<boolean> {
    const initialPath = `${process.env.WEBDAV_PATH || '/'}`;
    const existsFolder = await this.webdavClient.exists(
      `${initialPath}${evaluationCode}`,
    );
    if (!existsFolder) {
      await this.webdavClient.createDirectory(
        `${initialPath}${evaluationCode}`,
      );
    }
    const typeImage = image.name.split('.').pop();
    if (!['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG'].includes(typeImage)) {
      throw new NotFoundException(
        `El tipo de imagen ${typeImage} no es válido. Solo se permiten jpg, jpeg y png.`,
      );
    }
    const pathImage = `${initialPath}${evaluationCode}/${image.name}`;
    const cleanBase64 = image.base64.replace(
      /^data:(image|application)\/[a-zA-Z0-9+.-]+;base64,/,
      '',
    );
    return await this.webdavClient.putFileContents(
      pathImage,
      await Buffer.from(cleanBase64, 'base64'),
      {
        overwrite: true,
        headers: {
          'Content-Type': `image/${typeImage.toLowerCase()}`,
        },
      },
    );
  }

  async getImage(evaluationCode: string, imageName: string): Promise<string> {
    const pathImage = `${process.env.WEBDAV_PATH || '/'}${evaluationCode}/${imageName}`;
    const exists = await this.webdavClient.exists(pathImage);
    if (!exists) {
      console.log(
        `Imagen no encontrada ${pathImage}, retornando imagen por defecto`,
      );
      const noImageFound = fs.readFileSync(`${__dirname}/noimage.jpg`);
      return `data:image/jpeg;base64,${Buffer.from(noImageFound).toString('base64')}`;
    }
    const fileContents = (await this.webdavClient.getFileContents(pathImage, {
      format: 'binary',
    })) as Buffer;
    if (!fileContents) {
      console.log(
        `Imagen no encontrada ${pathImage}, retornando imagen por defecto`,
      );
      const noImageFound = fs.readFileSync(`${__dirname}/noimage.jpg`);
      return `data:image/jpeg;base64,${Buffer.from(noImageFound).toString('base64')}`;
    }
    const arrayBuffer = fileContents.buffer.slice(
      fileContents.byteOffset,
      fileContents.byteOffset + fileContents.byteLength,
    );
    const typeImage = imageName.split('.').pop();
    if (!['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG'].includes(typeImage)) {
      throw new NotFoundException(
        `El tipo de imagen ${typeImage} no es válido. Solo se permiten jpg, jpeg y png.`,
      );
    }
    return `data:image/${typeImage.toLowerCase()};base64,${Buffer.from(arrayBuffer).toString('base64')}`;
  }

  async deleteImage(evaluationCode: string, imageName: string): Promise<void> {
    const path = `${process.env.WEBDAV_PATH || '/'}${evaluationCode}/${imageName}`;
    await this.webdavClient.deleteFile(path);
  }
}
