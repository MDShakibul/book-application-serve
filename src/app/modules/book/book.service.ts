import { IBook } from "./book.interface";
import { Book } from "./book.model";

const addBook = async (payload: IBook): Promise<Partial<IBook> | null> => {
  const result = await Book.create(payload);
  return result;
};



export const BookService = {
    addBook,
};
