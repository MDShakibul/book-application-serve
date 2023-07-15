import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { bookSearchableFields } from './book.constant';
import { IBook, IBookFilters, Review } from './book.interface';
import { Book } from './book.model';
import { isValid, isDate, startOfYear, endOfYear } from 'date-fns';

const addBook = async (payload: IBook): Promise<Partial<IBook> | null> => {
  const result = await Book.create(payload);
  return result;
};

const updateBook = async (
  id: string,
  payload: Partial<IBook>
): Promise<IBook | null | undefined> => {
  const result = await Book.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
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
  bookId: string
): Promise<IBook | null | undefined> => {
  const book = await Book.findById(bookId);

  if (!book) {
    throw new ApiError(404, 'Book not found');
  }
  return book;
};
const deleteBook = async (
  bookId: string
): Promise<IBook | null | undefined> => {
  const book = await Book.findByIdAndDelete(bookId);

  if (!book) {
    throw new ApiError(404, 'Book not found');
  }
  return book;
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
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const count = await Book.countDocuments();

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};


export const BookService = {
  addBook,
  addComment,
  getSingleBook,
  deleteBook,
  updateBook,
  getAllBooks
};
