import { Router } from 'express';
import { PostController } from '../controllers/PostController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();
const postController = new PostController();
const auth = new AuthMiddleware();

router.get('/posts', postController.list);
router.get('/posts/:id', postController.show);

router.post('/posts', auth.authenticateToken, postController.create);
router.put('/posts/:id', auth.authenticateToken, postController.update);
router.delete('/posts/:id', auth.authenticateToken, postController.delete);

export default router;
