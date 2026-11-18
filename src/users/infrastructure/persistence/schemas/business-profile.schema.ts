//? Imports de codigo
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//? Imports de usuario
import {
  Address,
  AddressSchema,
  MediaFile,
  MediaFileSchema,
} from '@common/infrastructure/persistence/schemas';

import { DanceStyleEnum, BusinessTypeEnum } from '@users/domain/enums';
import { Phone, PhoneSchema } from '@users/infrastructure/persistence/schemas/phone.schema';

@Schema({
  _id: true,
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: false, getters: false },
})
export class BusinessProfile {
  //? Datos de la empresa
  @Prop({ required: true, type: String, trim: true })
  name: string;

  @Prop({ required: false, type: String, trim: true })
  description?: string;

  @Prop({ required: true, type: String, enum: BusinessTypeEnum })
  type: BusinessTypeEnum;

  @Prop({ required: false, type: MediaFileSchema, default: {} })
  avatar?: MediaFile;

  @Prop({ required: false, type: String, trim: true })
  taxId?: string;

  //? Datos de contacto
  @Prop({ required: true, type: String, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, type: PhoneSchema, default: {} })
  phone: Phone;

  //? Datos de direccion
  @Prop({ required: true, type: AddressSchema, default: {} })
  address: Address;

  //? Informacion de viaje
  @Prop({ required: true, type: Boolean, default: false })
  availableToTravel: boolean;

  @Prop({ required: true, type: Boolean, default: false })
  ownTransportation: boolean;

  //? Datos de estilos
  @Prop({ required: false, type: [String], enum: DanceStyleEnum, default: [] })
  offeredStyles?: DanceStyleEnum[];

  //? Campos de auditoría
  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ required: true, type: Date })
  updatedAt: Date;
}

export const BusinessProfileSchema = SchemaFactory.createForClass(BusinessProfile);
