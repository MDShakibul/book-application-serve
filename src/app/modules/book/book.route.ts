import express from 'express';
import validateRequest from '../../middlewares/validationRequest';
import { BookValidation } from './book.validation';
import { BookController } from './book.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.patch(
  '/add-book',
  validateRequest(BookValidation.createBookZodSchema),
  auth(),
  BookController.addBook
);

router.patch(
  '/:id',
  validateRequest(BookValidation.updateBookZodSchema),
  auth(),
  BookController.updateBook
);
router.post('/add-wish-list/:id', auth(), BookController.setWishList);
router.post('/add-continue-list/:id', auth(), BookController.setRunningList);

router.get('/get-wish-list', auth(), BookController.getWishList);
router.get('/:id', auth(), BookController.getSingleBook);
router.delete('/:id', auth(), BookController.deleteBook);

router.post(
  '/create-comment/:id',
  validateRequest(BookValidation.createCommentZodSchema),
  auth(),
  BookController.addComment
);
router.post('/completed/:id', auth(), BookController.completed);
router.get('/', BookController.getAllBook);

export const BookRoutes = router;
