import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ImagesDto } from 'src/application-core/dto/general/images-dto';
import { AuthType, createClient, WebDAVClient } from 'webdav';
import { NotFoundException } from 'src/application-core/exception/not-found-exception';
import { ValidationException } from 'src/application-core/exception/validation-exception';

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
      const imgTest = fs.readFileSync(
        'src/infraestructure/services/webdav/mip.jpg',
      );
      await this.saveImage('test', {
        idImg: 0,
        name: 'mip.jpg',
        blobFile: new Blob([imgTest]),
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
    if (image.blobFile instanceof Blob === false) {
      throw new ValidationException(
        'El archivo de imagen debe ser una instancia de Blob.',
      );
    }
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
    const path = `${initialPath}${evaluationCode}/${image.name}`;
    return await this.webdavClient.putFileContents(
      path,
      await image.blobFile.arrayBuffer(),
      {
        overwrite: true,
        headers: {
          'Content-Type': `image/${typeImage.toLowerCase()}`,
        },
      },
    );
  }

  async getImage(evaluationCode: string, imageName: string): Promise<Blob> {
    const path = `${process.env.WEBDAV_PATH || '/'}${evaluationCode}/${imageName}`;
    const fileContents = (await this.webdavClient.getFileContents(path, {
      format: 'binary',
    })) as Buffer;
    if (!fileContents) {
      throw new NotFoundException(`No se encontró la imagen: ${imageName}`);
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
    return new Blob([arrayBuffer], {
      type: `image/${typeImage.toLowerCase()}`,
    });
  }

  async deleteImage(evaluationCode: string, imageName: string): Promise<void> {
    const path = `${process.env.WEBDAV_PATH || '/'}${evaluationCode}/${imageName}`;
    await this.webdavClient.deleteFile(path);
  }
}
