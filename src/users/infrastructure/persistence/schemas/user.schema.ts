//? Imports de codigo
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//? Imports de usuario
import { Collections } from '@common/infrastructure/enums';
import { UserStatus } from '@users/domain/enums/user-status.enum';

@Schema({
  collection: Collections.USERS,
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: false, getters: false },
})
export class Users extends Document {
  @Prop({ required: true, type: String, unique: true })
  uid: string;

  @Prop({ required: false, type: String })
  name: string;

  @Prop({ required: false, type: String })
  lastName: string;

  @Prop({ required: true, type: String, enum: UserStatus })
  status: UserStatus;

  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ required: true, type: Date })
  updatedAt: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
