import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type Review = {
    body: string;
    userEmail: string;
    createdAt: string;
  };

export type IBook = {
  title: string;
  author: string;
  genre: string;
  publicationDate: Date;
  review?: Review[];
  addBy: Types.ObjectId | IUser;
  finishedBy?: string[];
  isComplete: false | true;
};

export type BookModel = Model<IBook, Record<string, unknown>>;

export type IBookFilters = {
  searchTerm?: string;
  genre?: string;
  publicationYear?: Date;
};