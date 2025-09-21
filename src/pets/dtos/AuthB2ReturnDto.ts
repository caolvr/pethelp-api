// DTOs que representam a resposta do Backblaze B2 (authorize-account)

export type B2Capability =
  | 'listBuckets'
  | 'readBucketEncryption'
  | 'listFiles'
  | 'readBucketReplications'
  | 'readBuckets'
  | 'writeFiles'
  | 'readFiles'
  | 'writeBucketEncryption'
  | 'readBucketLogging'
  | 'writeBucketNotifications'
  | 'writeBucketReplications'
  | 'deleteFiles'
  | 'writeBucketLogging'
  | 'shareFiles'
  | 'readBucketNotifications';

export class B2BucketDto {
  id!: string;
  name!: string;
}

export class B2AllowedDto {
  buckets!: B2BucketDto[];
  capabilities!: B2Capability[];
  namePrefix!: string | null;
}

export class StorageApiDto {
  absoluteMinimumPartSize!: number;
  allowed!: B2AllowedDto;
  apiUrl!: string;
  downloadUrl!: string;
  recommendedPartSize!: number;
  s3ApiUrl!: string;
}

export class ApiInfoDto {
  storageApi!: StorageApiDto;
}

export class AuthB2ReturnDto {
  accountId!: string;
  apiInfo!: ApiInfoDto;
  applicationKeyExpirationTimestamp!: number | null;
  authorizationToken!: string;
}
