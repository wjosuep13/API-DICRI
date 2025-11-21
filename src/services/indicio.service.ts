import { Response } from "express";
import { Indicio } from "../models/Indicio.model";
import { createIndicio, getIndiciosByExpedient } from "../repositories/indicio.repository";
import { AuthRequest } from "../middlewares/auth.middleware";

export const crearIndicio = async (req: AuthRequest, res: Response): Promise<void> => {
    const indicioData: Indicio = req.body;
    const userId = req.user!.userId;
    try {
        const newIndicio = await createIndicio(indicioData,userId);
        if (!newIndicio) {
            res.status(400).json({ message: 'Failed to create indicio' });
            return;
        }
        res.status(201).json(newIndicio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const listIndiciosByExpedient = async (req: AuthRequest, res: Response): Promise<void> => {
    const no_expediente = Number(req.params.no_expediente);
    try {
        const indicios = await getIndiciosByExpedient(no_expediente);
        res.status(200).json(indicios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}