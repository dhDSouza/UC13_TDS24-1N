import { Router } from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { AuthController } from "../controllers/AuthController";

const router = Router();
const authMiddleware = new AuthMiddleware();
const controller = new AuthController();

router.post("/login", controller.login);
router.get("/me", authMiddleware.authenticateToken, controller.me);
router.post("/logout", authMiddleware.authenticateToken, controller.logout);

export default router;