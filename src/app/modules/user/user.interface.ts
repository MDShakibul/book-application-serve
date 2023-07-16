import { Model } from 'mongoose';



export type IUser = {
  email: string;
  password: string;
  wishList?: string[];
  continueList?: string[];
};

export type WishList = {
  bookName: string
};

export type IUserResponse = {
  email: string;
  password?: string;
  wishList?: WishList[]; 
  continueList?: WishList[];
  accessToken: string;
  refreshToken?: string;

};




export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type ILoginUser = {
  email: string;
  password: string;
};

export type IRetunUserExist = {
  _id: string;
  email: string;
  password: string;
  
};

export type IRefreshTokenResponse = {
  accessToken: string;
};


export type IUserMethods = {
  isUserExist(email: string): Promise<IRetunUserExist| null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
};

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
