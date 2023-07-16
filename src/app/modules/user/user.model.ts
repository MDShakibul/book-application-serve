import { Schema, model } from 'mongoose';
import { IRetunUserExist, IUser, IUserMethods, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    wishList: [{ book_id: { type: String } }],
    continueList: [{ book_id: { type: String } }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});


userSchema.methods.isUserExist = async function (
  email: string
): Promise<IRetunUserExist | null> {
  return await User.findOne({ email }, { _id: 1, password: 1, email: 1 });
};

userSchema.methods.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

export const User = model<IUser, UserModel>('User', userSchema);
