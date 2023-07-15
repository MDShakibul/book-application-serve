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
router.get(
    '/:id',
    BookController.getSingleBook
  );

router.post(
  '/create-comment/:id',
  validateRequest(BookValidation.createCommentZodSchema),
  BookController.addComment
);



export const BookRoutes = router;
