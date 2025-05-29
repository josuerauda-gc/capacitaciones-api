import { Injectable } from '@nestjs/common';
import { ImagesDto } from 'src/application-core/dto/general/images-dto';
import { AuthType, createClient, WebDAVClient } from 'webdav';
import { Base64ConverterService } from '../base64-converter/base64-converter.service';
import { NotFoundException } from 'src/application-core/exception/not-found-exception';

@Injectable()
export class WebdavService {
  private readonly webdavClient: WebDAVClient;

  constructor(private readonly base64ConverterService: Base64ConverterService) {
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
    } catch (error) {
      console.error('Error al obtener el contenido WebDAV:', error.message);
      if (error.response) {
        console.error('Detalles de la respuesta:', error.response);
      }
    }
  }

  async saveImage(evaluationCode: string, image: ImagesDto): Promise<boolean> {
    const existsFolder = await this.webdavClient.exists(evaluationCode);
    if (!existsFolder) {
      await this.webdavClient.createDirectory(evaluationCode);
    }

    const path = `${process.env.WEBDAV_PATH || '/'}${evaluationCode}/${image.name}`;
    const blobToBase64Image = await this.base64ConverterService.blobToBase64(
      image.blobFile,
    );
    await this.webdavClient.putFileContents(path, blobToBase64Image, {
      overwrite: true,
    });

    return true;
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

    return new Blob([arrayBuffer]);
  }

  async deleteImage(evaluationCode: string, imageName: string): Promise<void> {
    const path = `${evaluationCode}/${imageName}`;
    await this.webdavClient.deleteFile(path);
  }
}
