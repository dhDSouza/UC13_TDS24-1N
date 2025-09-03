import { Router } from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { UserController } from "../controllers/UserController";

const router = Router();
const auth = new AuthMiddleware();
const controller = new UserController();

// Apenas usuários autenticados podem editar ou deletar
router.put('/users/:id', auth.authenticateToken, controller.update);
router.delete('/users/:id', auth.authenticateToken, controller.delete);

// Apenas admins podem listar todos
router.get('/users', auth.authenticateToken, auth.isAdmin, controller.listAll);
router.get('/users/posts', auth.authenticateToken, auth.isAdmin, controller.list);

// Mostrar próprio perfil
router.get('/users/me', auth.authenticateToken, controller.show);


export default router;