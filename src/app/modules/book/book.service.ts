import ApiError from '../../../errors/ApiError';
import { IBook, Review } from './book.interface';
import { Book } from './book.model';

const addBook = async (payload: IBook): Promise<Partial<IBook> | null> => {
  const result = await Book.create(payload);
  return result;
};
const addComment = async (
  bookId: string,
  payload: Review
): Promise<Partial<IBook> | null | undefined> => {
  const book = await Book.findById(bookId);

  if (!book) {
    throw new ApiError(404, 'Book not found');
  }

  book?.review?.unshift({
    body: payload.body,
    userEmail: payload.userEmail,
    createdAt: new Date().toISOString(),
  });
  await book.save();
  return book;
};
const getSingleBook = async (
  bookId: string): Promise<IBook | null | undefined> => {
  const book = await Book.findById(bookId);

  if (!book) {
    throw new ApiError(404, 'Book not found');
  }
  return book;
};
const deleteBook = async (
  bookId: string): Promise<IBook | null | undefined> => {
  const book = await Book.findByIdAndDelete(bookId);

  if (!book) {
    throw new ApiError(404, 'Book not found');
  }
  return book;
};

export const BookService = {
  addBook,
  addComment,
  getSingleBook,
  deleteBook
};
