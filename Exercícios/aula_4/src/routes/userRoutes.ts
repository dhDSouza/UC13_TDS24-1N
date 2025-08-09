import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();
const controller = new UserController();

// Rotas dos exercícios
router.get('/users/busca', controller.getByName);
router.post('/login', controller.login);

// Rotas do exemplo da aula
router.get('/users', controller.list);
router.get('/users/:id', controller.getById);
router.post('/users', controller.create);
router.put('/users/:id', controller.update);
router.delete('/users/:id', controller.delete);

export default router;