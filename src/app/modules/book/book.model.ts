import { Schema, model } from 'mongoose';
import { BookModel, IBook } from './book.interface';

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publicationDate: { type: Date, required: true },
    review: [
      {
        body: { type: String, required: true },
        userEmail: { type: String, required: true },
        createdAt: { type: String, required: true },
      },
    ],
    addBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    finishedBy: { type: [String], required: true },
    isComplete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Book = model<IBook, BookModel>('Book', BookSchema);
