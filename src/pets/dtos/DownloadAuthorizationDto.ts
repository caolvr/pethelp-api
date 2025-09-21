export class DownloadAuthorizationDto {
  authorizationToken!: string; // token específico para downloads com prefixo
  bucketId!: string;
  fileNamePrefix!: string; // prefixo autorizado
}
