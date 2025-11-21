import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/roles.middleware";
import { Roles } from "../utils/roles";
import { listEstados } from "../services/estado.service";
const router = Router();
router.get("/", authenticate, authorize(Roles.COORDINADOR), listEstados);

export default router;
