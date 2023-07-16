import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { bookSearchableFields } from './book.constant';
import { IBook, IBookFilters, Review } from './book.interface';
import { Book } from './book.model';
import { isValid, isDate, startOfYear, endOfYear } from 'date-fns';
import { User } from '../user/user.model';
import { IUser } from '../user/user.interface';

const addBook = async (
  payload: IBook,
  userId: string
): Promise<Partial<IBook> | null> => {
  payload.addBy = userId;
  const result = await Book.create(payload);

  return result;
};

const updateBook = async (
  id: string,
  userId: string,
  payload: Partial<IBook>
): Promise<IBook | null | undefined> => {
  const book = await Book.findById(id);
  if (book && book.addBy.toString() !== userId) {
    throw new ApiError(403, 'You are not owner of this book');
  }

  const result = await Book.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const addComment = async (
  bookId: string,
  payload: Review,
  email: string
): Promise<Partial<IBook> | null | undefined> => {
  const book = await Book.findById(bookId);

  if (!book) {
    throw new ApiError(404, 'Book not found');
  }

  book?.review?.unshift({
    body: payload.body,
    userEmail: email,
    createdAt: new Date().toISOString(),
  });
  await book.save();
  return book;
};

const getSingleBook = async (
  bookId: string,
  userId: string
): Promise<IBook | null | undefined> => {
  const book = await Book.findById(bookId);

  if (book && book.addBy.toString() === userId) {
    book.isOwner = true;
  }
  if (!book) {
    throw new ApiError(404, 'Book not found');
  }
  return book;
};

const deleteBook = async (
  bookId: string,
  userId: string
): Promise<IBook | null | undefined> => {
  const book = await Book.findById(bookId);
  if (book && book.addBy.toString() !== userId) {
    throw new ApiError(403, 'You are not owner of this book');
  }

  const deleteBook = await Book.findByIdAndDelete(bookId);

  if (!deleteBook) {
    throw new ApiError(404, 'Book not found');
  }
  return deleteBook;
};

const getAllBooks = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBook[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calulatePagination(paginationOptions);

  const { searchTerm, publicationYear, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: bookSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (publicationYear && isValid(new Date(publicationYear))) {
    const publicationYearStartDate = startOfYear(new Date(publicationYear));
    const publicationYearEndDate = endOfYear(new Date(publicationYear));
    andCondition.push({
      publicationDate: {
        $gte: publicationYearStartDate,
        $lte: publicationYearEndDate,
      },
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortCondition: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const result = await Book.find(whereCondition)
    .populate('addBy')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const count = await Book.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

const setWishList = async (
  bookId: string,
  userId: string
): Promise<IUser | null| undefined | any > => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  //const bookIndex = user?.wishList?.findIndex((book) => book.book_id === bookId);

/*   if (bookIndex !== undefined && bookIndex !== -1) {
    throw new ApiError(401, 'This book already in your wish list');
  } else {
    const book = await Book.findById(bookId);
    if (book) {
      console.log(book.title);
      await User.updateOne(
        { _id: userId },
        { $push: { wishList: { book_name: book.title } } }
      );
    }
  } */

};
const getWishList = async (
  userId: string
): Promise<IUser | null| undefined | any > => {
  const user = await User.findById(userId);

  return user

};


export const BookService = {
  addBook,
  addComment,
  getSingleBook,
  deleteBook,
  updateBook,
  getAllBooks,
  setWishList,
  getWishList,
};
