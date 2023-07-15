import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { BookService } from './book.service';

const addBook = catchAsync(async (req: Request, res: Response) => {
  const { ...bookData } = req.body;
  const result = await BookService.addBook(bookData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book added successfully',
    data: result,
  });
});
const addComment = catchAsync(async (req: Request, res: Response) => {
  const { ...commentData } = req.body;
  const result = await BookService.addComment(req.params.id, commentData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment post successfully',
    data: result,
  });
});
const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.getSingleBook(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book retrieved successfully',
    data: result,
  });
});
const deleteBook = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const result = await BookService.deleteBook(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book delete successfully',
    data: null,
  });
});




export const BookController = {
    addBook,
    addComment,
    getSingleBook,
    deleteBook
};
