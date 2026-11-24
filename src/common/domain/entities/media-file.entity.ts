//? Imports de usuario
import { MediaExtension, MediaMimeType } from '@common/domain/enums';

export interface MediaFileInterface {
  id?: string | null;
  url: string;
  key: string;
  thumbnailUrl?: string | null;
  originalName: string;
  extension: MediaExtension;
  mimeType: MediaMimeType;
  size: number;
  duration?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateMediaFileType = Omit<MediaFileInterface, 'id' | 'createdAt' | 'updatedAt'>;

export class MediaFileEntity {
  private readonly _id: string | null;
  private readonly _url: string;
  private readonly _key: string;
  private readonly _thumbnailUrl: string | null;
  private readonly _originalName: string;
  private readonly _extension: MediaExtension;
  private readonly _mimeType: MediaMimeType;
  private readonly _size: number;
  private readonly _duration: number | null;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(mediaFile: MediaFileInterface) {
    this._id = mediaFile.id ?? null;
    this._url = mediaFile.url;
    this._key = mediaFile.key;
    this._thumbnailUrl = mediaFile.thumbnailUrl ?? null;
    this._originalName = mediaFile.originalName;
    this._extension = mediaFile.extension;
    this._mimeType = mediaFile.mimeType;
    this._size = mediaFile.size;
    this._duration = mediaFile.duration ?? null;
    this._createdAt = mediaFile.createdAt ?? new Date();
    this._updatedAt = mediaFile.updatedAt ?? new Date();
  }

  //? Getters
  public get id(): string | null {
    return this._id;
  }

  public get url(): string {
    return this._url;
  }

  public get key(): string {
    return this._key;
  }

  public get thumbnailUrl(): string | null {
    return this._thumbnailUrl;
  }

  public get originalName(): string {
    return this._originalName;
  }

  public get extension(): MediaExtension {
    return this._extension;
  }

  public get mimeType(): MediaMimeType {
    return this._mimeType;
  }

  public get size(): number {
    return this._size;
  }

  public get duration(): number | null {
    return this._duration;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  //? Methods static
  public static create(mediaFile: CreateMediaFileType): MediaFileEntity {
    return new MediaFileEntity({
      url: mediaFile.url,
      key: mediaFile.key,
      thumbnailUrl: mediaFile.thumbnailUrl ?? null,
      originalName: mediaFile.originalName,
      extension: mediaFile.extension,
      mimeType: mediaFile.mimeType,
      size: mediaFile.size,
      duration: mediaFile.duration ?? null,
    });
  }
}
