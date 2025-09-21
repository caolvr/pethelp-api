import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthB2ReturnDto } from '../dtos/AuthB2ReturnDto';
import { UrlUploadDto } from '../dtos/UrlUploadDto';
import { DownloadAuthorizationDto } from '../dtos/DownloadAuthorizationDto';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class BlackbazeService {
  private readonly logger = new Logger(BlackbazeService.name);
  private cachedAuth?: { data: AuthB2ReturnDto; fetchedAt: number };
  private cacheTtlMs = 1000 * 60 * 50;

  constructor(private readonly configService: ConfigService) {}

  async authorizeAccount(forceRefresh = false): Promise<AuthB2ReturnDto> {
    if (
      !forceRefresh &&
      this.cachedAuth &&
      Date.now() - this.cachedAuth.fetchedAt < this.cacheTtlMs
    ) {
      return this.cachedAuth.data;
    }

    const keyId = this.configService.get<string>('B2_KEY_ID');
    const appKey = this.configService.get<string>('B2_APP_KEY');

    if (!keyId || !appKey) {
      this.logger.error(
        'Missing B2_KEY_ID or B2_APP_KEY environment variables',
      );
      throw new InternalServerErrorException(
        'Backblaze credentials not configured',
      );
    }

    const url = 'https://api.backblazeb2.com/b2api/v4/b2_authorize_account';
    const basicAuth = Buffer.from(`${keyId}:${appKey}`).toString('base64');

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${basicAuth}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        this.logger.error(`Backblaze auth failed: ${res.status} ${text}`);
        throw new InternalServerErrorException(
          'Failed to authorize Backblaze account',
        );
      }

      const raw: any = await res.json();

      const mapped: AuthB2ReturnDto = {
        accountId: raw.accountId,
        apiInfo: raw.apiInfo,
        applicationKeyExpirationTimestamp:
          raw.applicationKeyExpirationTimestamp ?? null,
        authorizationToken: raw.authorizationToken,
      };

      if (!mapped.accountId || !mapped.authorizationToken || !mapped.apiInfo) {
        this.logger.error('Backblaze auth response missing required fields');
        throw new InternalServerErrorException(
          'Invalid Backblaze authorization response',
        );
      }

      this.cachedAuth = { data: mapped, fetchedAt: Date.now() };
      return mapped;
    } catch (err) {
      this.logger.error('Error authorizing Backblaze', err as any);
      throw new InternalServerErrorException('Backblaze authorization error');
    }
  }

  async getUploadUrl(): Promise<UrlUploadDto> {
    const auth = await this.authorizeAccount();

    const apiUrl = auth.apiInfo?.storageApi?.apiUrl;
    if (!apiUrl) {
      this.logger.error('apiUrl não encontrado na autorização Backblaze');
      throw new InternalServerErrorException('apiUrl não encontrado');
    }
    const bucketId =
      this.configService.get<string>('B2_BUCKET_ID') ||
      process.env.B2_BUCKET_ID;
    if (!bucketId) {
      this.logger.error('B2_BUCKET_ID não configurado');
      throw new InternalServerErrorException('BucketId não configurado');
    }
    const url = `${apiUrl}/b2api/v4/b2_get_upload_url?bucketId=${bucketId}`;

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: auth.authorizationToken,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        this.logger.error(`Erro ao obter upload URL: ${res.status} ${text}`);
        throw new InternalServerErrorException('Falha ao obter URL de upload');
      }

      const raw: any = await res.json();
      const mapped: UrlUploadDto = {
        authorizationToken: raw.authorizationToken,
        bucketId: raw.bucketId,
        uploadUrl: raw.uploadUrl,
      };

      if (!mapped.authorizationToken || !mapped.bucketId || !mapped.uploadUrl) {
        this.logger.error('Resposta inválida de b2_get_upload_url');
        throw new InternalServerErrorException(
          'Resposta inválida de upload URL',
        );
      }

      return mapped;
    } catch (err) {
      this.logger.error('Erro ao chamar b2_get_upload_url', err as any);
      throw new InternalServerErrorException('Erro ao obter upload URL');
    }
  }

  async getDownloadAuthorization(
    validDurationInSeconds: number = 60 * 60,
  ): Promise<DownloadAuthorizationDto> {
    const fileNamePrefix = 'pethelp';
    const auth = await this.authorizeAccount();
    const apiUrl = auth.apiInfo?.storageApi?.apiUrl;
    if (!apiUrl) {
      this.logger.error('apiUrl não encontrado na autorização Backblaze');
      throw new InternalServerErrorException('apiUrl não encontrado');
    }
    const bucketId =
      this.configService.get<string>('B2_BUCKET_ID') ||
      process.env.B2_BUCKET_ID;
    if (!bucketId) {
      this.logger.error('B2_BUCKET_ID não configurado');
      throw new InternalServerErrorException('BucketId não configurado');
    }
    if (validDurationInSeconds < 1 || validDurationInSeconds > 604800) {
      this.logger.warn(
        `validDurationInSeconds ajustado. Valor recebido=${validDurationInSeconds}`,
      );
      validDurationInSeconds = Math.max(
        1,
        Math.min(604800, validDurationInSeconds),
      );
    }
    const body = { bucketId, fileNamePrefix, validDurationInSeconds };
    const url = `${apiUrl}/b2api/v4/b2_get_download_authorization`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: auth.authorizationToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      console.log(res);
      if (!res.ok) {
        const text = await res.text();
        this.logger.error(
          `Erro ao obter download authorization: ${res.status} ${text}`,
        );
        throw new InternalServerErrorException(
          'Falha ao obter autorização de download',
        );
      }
      const raw: any = await res.json();
      const token = raw.authorizationToken;
      if (!token) {
        this.logger.error('Resposta inválida de b2_get_download_authorization');
        throw new InternalServerErrorException(
          'Resposta inválida de download authorization',
        );
      }
      const mapped: DownloadAuthorizationDto = {
        authorizationToken: token,
        bucketId,
        fileNamePrefix,
      };
      return mapped;
    } catch (err) {
      this.logger.error(
        'Erro ao chamar b2_get_download_authorization',
        err as any,
      );
      throw new InternalServerErrorException(
        'Erro ao obter autorização de download',
      );
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const { uploadUrl, authorizationToken } = await this.getUploadUrl();

    const sha1 = crypto.createHash('sha1').update(file.buffer).digest('hex');

    const res = await axios.post(uploadUrl, file.buffer, {
      headers: {
        Authorization: authorizationToken,
        'X-Bz-File-Name': encodeURIComponent(file.originalname),
        'Content-Type': file.mimetype,
        'X-Bz-Content-Sha1': sha1,
      },
    });

    return {
      fileId: res.data.fileId,
      fileName: res.data.fileName,
      url: `https://f004.backblazeb2.com/file/pethelp/${encodeURIComponent(res.data.fileName)}`,
    };
  }
}
