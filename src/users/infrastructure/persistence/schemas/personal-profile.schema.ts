//? Imports de codigo
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//? Imports de usuario
import {
  Address,
  AddressSchema,
  MediaFile,
  MediaFileSchema,
} from '@common/infrastructure/persistence/schemas';
import { DanceStyleEnum, SpecialtyEnum } from '@users/domain/enums';

@Schema({
  _id: false,
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: false, getters: false },
})
export class PersonalProfile {
  //? Datos de personales
  @Prop({ required: false, type: String, trim: true })
  headline?: string;

  @Prop({ required: false, type: String, trim: true })
  biography?: string;

  @Prop({ required: false, type: String, unique: true, trim: true })
  alias?: string;

  @Prop({ required: false, type: MediaFileSchema, default: {} })
  avatar?: MediaFile;

  //? Datos de direccion
  @Prop({ required: true, type: AddressSchema, default: {} })
  address: Address;

  //? Informacion de viaje
  @Prop({ required: true, type: Boolean, default: false })
  availableToTravel: boolean;

  @Prop({ required: true, type: Boolean, default: false })
  ownTransportation: boolean;

  //? Datos de estilo
  @Prop({ required: true, type: [String], enum: SpecialtyEnum, default: [] })
  specialties: SpecialtyEnum[];

  @Prop({ required: true, type: [String], enum: DanceStyleEnum, default: [] })
  danceStyles: DanceStyleEnum[];

  //? Campos de auditoría
  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ required: true, type: Date })
  updatedAt: Date;
}

export const PersonalProfileSchema = SchemaFactory.createForClass(PersonalProfile);
