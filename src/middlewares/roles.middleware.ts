import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const authorize =
  (...allowedRoles: number[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "No tienes permisos" });
    }

    next();
  };
