import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
  IUser,
  IUserResponse,
} from './user.interface';
import { User } from './user.model';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

const createUser = async (payload: IUser): Promise<IUserResponse > => {
  const result = await User.create(payload);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //const { password, ...others } = result.toObject();

    // create accesstoken and refresh token
    const { _id, email: userEmailNumber } = result;
    const accessToken = jwtHelpers.createToken(
      { _id, userEmailNumber },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );
    const refreshToken = jwtHelpers.createToken(
      { _id, userEmailNumber },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string
    );

    const resultWithTokens = {
      ...result.toObject(),
      accessToken,
      refreshToken,
    };


  return resultWithTokens;
};



const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const user = new User();
  const isUserExist = await user.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (await user.isPasswordMatched(password, isUserExist?.password) === false) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password does not match');
  }

  // create accesstoken and refresh token
  const { _id, email: userEmailNumber } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { _id, userEmailNumber },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    { _id, userEmailNumber },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  const user = new User();
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  //checking deleted user's token
  const isUserExist = await user.isUserExist(verifiedToken.userPhoneNumber);



  //generate new token
  let newAccessToken = null;
  if (isUserExist) {
    newAccessToken = jwtHelpers.createToken(
      { id: isUserExist._id, email: isUserExist.email },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );
  }  else {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  return {
    accessToken: newAccessToken,
  };
};


export const UserService = {
  createUser,
  loginUser,
  refreshToken,
};
