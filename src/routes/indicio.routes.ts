import { Router } from "express";
import { crearIndicio, listIndiciosByExpedient } from "../services/indicio.service";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/roles.middleware";
import { Roles } from "../utils/roles";

const router = Router();
router.post("/", authenticate,authorize(Roles.EDITOR,Roles.COORDINADOR), crearIndicio);
router.get("/:no_expediente", authenticate, authorize(Roles.EDITOR,Roles.COORDINADOR), listIndiciosByExpedient);

export default router;
