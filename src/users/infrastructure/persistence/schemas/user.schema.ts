//? Imports de codigo
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//? Imports de usuario
import { Collections, SystemRoleEnum } from '@common/domain/enums';
import { Phone, PhoneSchema } from '@common/infrastructure/persistence/schemas';

import { ProfileTypeEnum, UserStatus } from '@users/domain/enums';
import {
  BusinessProfile,
  BusinessProfileSchema,
} from '@users/infrastructure/persistence/schemas/business-profile.schema';
import {
  PersonalProfile,
  PersonalProfileSchema,
} from '@users/infrastructure/persistence/schemas/personal-profile.schema';

@Schema({
  collection: Collections.USERS,
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: false, getters: false },
})
export class Users extends Document {
  @Prop({ required: true, type: String, unique: true, trim: true })
  uid: string;

  @Prop({ required: true, type: String, trim: true })
  name: string;

  @Prop({ required: true, type: String, trim: true })
  lastName: string;

  //? Datos de contacto
  @Prop({ required: true, type: String, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: false, type: PhoneSchema, default: {} })
  phone?: Phone;

  //? Tipo de perfil
  @Prop({ required: true, type: String, enum: ProfileTypeEnum })
  activeProfileType: ProfileTypeEnum;

  //? Información de la cuenta
  @Prop({ required: false, type: PersonalProfileSchema, default: {} })
  personalProfile?: PersonalProfile;

  @Prop({ required: false, type: [BusinessProfileSchema], default: [] })
  businessProfiles?: BusinessProfile[];

  //? Roles y estado del usuario
  @Prop({ required: true, type: String, enum: SystemRoleEnum, default: SystemRoleEnum.USER })
  role: SystemRoleEnum;

  @Prop({ required: true, type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  //? Campos de auditoría
  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ required: true, type: Date })
  updatedAt: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);

//* Comparación del alias sin distinguir mayúsculas (compartida por el índice y la consulta previa)
export const ALIAS_COLLATION = { locale: 'es', strength: 2 };

//* Índices únicos dispersos (sparse) para campos opcionales y subdocumentos
//* El teléfono se identifica siempre completo: varios países comparten prefijo (ej. US y CA con +1)
UsersSchema.index(
  { 'phone.cca2': 1, 'phone.code': 1, 'phone.number': 1 },
  { unique: true, sparse: true },
);
//* Índice parcial: `sparse` no basta porque el alias vacío se guarda como `null` y `null` sí se indexa
//* `strength: 2` ignora mayúsculas ("Vale" = "vale") pero no las tildes. La consulta previa debe usar la misma
UsersSchema.index(
  { 'personalProfile.alias': 1 },
  {
    unique: true,
    partialFilterExpression: { 'personalProfile.alias': { $gt: '' } },
    collation: ALIAS_COLLATION,
  },
);
UsersSchema.index({ 'businessProfiles.email': 1 }, { unique: true, sparse: true });
UsersSchema.index(
  {
    'businessProfiles.phone.cca2': 1,
    'businessProfiles.phone.code': 1,
    'businessProfiles.phone.number': 1,
  },
  { unique: true, sparse: true },
);
