import { Router } from "express";
import { ProductController } from "../controllers/productController";

const router = Router();

const controller = new ProductController();

router.get("/users", controller.listAllProducts);
router.post("/users", controller.createProduct);
router.put("/users/:id", controller.updateProduct);
router.delete("/users/:id", controller.deleteProduct);

export default router;
