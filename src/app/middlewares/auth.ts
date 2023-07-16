import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import config from '../../config';
import { Secret } from 'jsonwebtoken';

const auth = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get authorization token
    const token = req.headers.authorization;
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Your are not authorized');
    }


    //verify token
    let verifiedUser = null;
    verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

    req.user = verifiedUser; // _id, email

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
