import { Router } from "express";
import { changeExpedientStatus, 
    createNewExpedient,
    getAccesibleExpedients,
     getExpedientDetails,
    getExpedientHistoryByRange } from "../services/expedient.service";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/roles.middleware";
import { Roles } from "../utils/roles";
const router = Router();
router.post("/", authenticate,authorize(Roles.EDITOR,Roles.COORDINADOR), createNewExpedient);
router.get("/", authenticate, getAccesibleExpedients);
router.get("/:no_expedient", authenticate, getExpedientDetails);
router.patch("/status", authenticate,authorize(Roles.COORDINADOR), changeExpedientStatus);
router.post("/history/", authenticate,authenticate,authorize(Roles.COORDINADOR), getExpedientHistoryByRange);

export default router;
