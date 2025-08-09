import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();

const controller = new UserController();

router.get("/users", controller.listAllUsers);
router.post("/users", controller.createUser);
router.put("/users/:id", controller.updateUser);
router.delete("/users/:id", controller.deleteUser);

export default router;
