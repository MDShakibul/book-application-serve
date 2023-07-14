import express from 'express';
import validateRequest from '../../middlewares/validationRequest';
import { BookValidation } from './book.validation';
import { BookController } from './book.controller';

const router = express.Router();


router.patch(
  '/add-book',
  validateRequest(BookValidation.createBookZodSchema),
  BookController.addBook
);


export const BookRoutes = router;
