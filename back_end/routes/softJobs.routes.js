import { Router } from "express";
import { controller } from "../controllers/softJobs.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();

router.post('/usuarios', controller.registerUser);
router.post('/login', controller.login);
router.get('/usuarios', verifyToken, controller.getUsers);

export default router;
