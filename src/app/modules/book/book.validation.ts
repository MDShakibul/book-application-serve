import { z } from 'zod';

const createBookZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    author: z.string({ required_error: 'Author is required' }),
    genre: z.string({ required_error: 'Genre is required' }),
    publicationDate: z.string({
      required_error: 'Publication Date is required',
    }),
    addBy: z.string({ required_error: 'User is required' }),
  }),
});
const createCommentZodSchema = z.object({
  body: z.object({
    body: z.string({
      required_error: 'Comment is required',
    }),
    userEmail: z
      .string({
        required_error: 'Email is required',
      })
      .email(),
  }),
});

export const BookValidation = {
  createBookZodSchema,
  createCommentZodSchema,
};
