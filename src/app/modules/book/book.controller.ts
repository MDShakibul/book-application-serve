import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { BookService } from './book.service';
import pick from '../../../shared/pick';
import { bookFilterableFields } from './book.constant';
import { paginationFields } from '../../../constants/pagination';
import { IBook } from './book.interface';
import { IResUser } from '../../../interfaces/resuser';

const addBook = catchAsync(async (req: Request, res: Response) => {
  const { ...bookData } = req.body;
  const { _id: userId, ...userInfo } = req.user as IResUser;

  const result = await BookService.addBook(bookData, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book added successfully',
    data: result,
  });
});

const updateBook = catchAsync(async (req: Request, res: Response) => {
  const { ...data } = req.body;
  const { _id: userId, ...userInfo } = req.user as IResUser;
  const result = await BookService.updateBook(req.params.id,userId, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book updated successfully',
    data: result,
  });
});

const addComment = catchAsync(async (req: Request, res: Response) => {
  const { ...commentData } = req.body;
  const { _id: userId, iat,exp,userEmailNumber } = req.user as IResUser;
  const result = await BookService.addComment(req.params.id, commentData, userEmailNumber);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment post successfully',
    data: result,
  });
});

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const { _id: userId, ...userInfo } = req.user as IResUser;
  const result = await BookService.getSingleBook(req.params.id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book retrieved successfully',
    data: result,
  });
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id: userId, ...userInfo } = req.user as IResUser;
  const result = await BookService.deleteBook(req.params.id, userId) ;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book delete successfully',
    data: null,
  });
});

const getAllBook = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BookService.getAllBooks(filters, paginationOptions);

  sendResponse<IBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const setWishList = catchAsync(async (req: Request, res: Response) => {
  const { _id: userId, ...userInfo } = req.user as IResUser;
  const result = await BookService.setWishList(req.params.id, userId) ;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Add Wish List successfully',
    data: result,
  });
});
const getWishList = catchAsync(async (req: Request, res: Response) => {
  const { _id: userId, ...userInfo } = req.user as IResUser;
  const result = await BookService.getWishList(userId) ;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Add Wish List successfully',
    data: result,
  });
});



export const BookController = {
  addBook,
  addComment,
  getSingleBook,
  deleteBook,
  updateBook,
  getAllBook,
  setWishList,
  getWishList,
};
