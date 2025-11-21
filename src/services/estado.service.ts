import { Response } from "express";
import { getEstados } from "../repositories/estado.repository";
import { AuthRequest } from "../middlewares/auth.middleware";

export const listEstados = async ( req:AuthRequest,res: Response) => {
    try {
        const estados = await getEstados();
        console.log('estados on service:',estados);
        res.status(200).json(estados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}