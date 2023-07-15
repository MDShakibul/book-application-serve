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

router.patch(
  '/:id',
  validateRequest(BookValidation.updateBookZodSchema),
  BookController.updateBook
);
router.get('/:id', BookController.getSingleBook);
router.delete('/:id', BookController.deleteBook);

router.post(
  '/create-comment/:id',
  validateRequest(BookValidation.createCommentZodSchema),
  BookController.addComment
);
router.get('/', BookController.getAllBook);

export const BookRoutes = router;
