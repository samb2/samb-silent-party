import express from 'express';
import { NotFoundError, ErrorHandlerMiddleware } from 'irolegroup';
import MainController from '../controllers/Main.controller';

const router = express.Router();

router.get('/', MainController.main);
router.get('/stream/:music', MainController.stream);
router.get('/admin', MainController.admin);
router.get('/admin2', MainController.admin2);
router.get('/admin/manage', MainController.manage);

// Error 404
router.all('*', () => {
    throw new NotFoundError();
});
router.use(ErrorHandlerMiddleware);

export { router };
