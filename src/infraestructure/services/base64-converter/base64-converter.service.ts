import { Injectable } from '@nestjs/common';

@Injectable()
export class Base64ConverterService {
  public async blobToBase64(blob: Blob): Promise<string> {
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString('base64');
    return base64String;
  }

  public base64ToBuffer(base64String: string): ArrayBuffer {
    const matches = base64String.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!matches) throw new Error('Formato base64 inválido');

    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    return buffer;
  }

  public base64ToBlob(base64String: string): Blob {
    const matches = base64String.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!matches) throw new Error('Formato base64 inválido');

    const base64Data = matches[2];
    const byteCharacters = Buffer.from(base64Data, 'base64');
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters[i];
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: matches[1] });
  }

  public base64Type(base64String: string): string {
    const matches = base64String.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!matches) throw new Error('Formato base64 inválido');

    const mimeType = matches[1]; // ej. image/png
    return mimeType;
  }
}
