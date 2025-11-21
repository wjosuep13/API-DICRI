import { Response } from 'express';
import {
    createExpedient,
    getExpedientDetail,
    getExpedients,
    changeStatusExpedient,
    getExpedientStatusHistoryOnRange
} from '../repositories/expedient.repository';

import { AuthRequest } from '../middlewares/auth.middleware';

export const createNewExpedient = async (req: AuthRequest, res: Response) => {
    const expedientData = req.body;
    try {
        const newExpedient = await createExpedient(expedientData, req.user!.userId);
        if (!newExpedient) {
            return res.status(400).json({ message: 'Failed to create expedient' });
        }
        return res.status(201).json(newExpedient);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAccesibleExpedients = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    try {
        const expedients = await getExpedients(userId, userRole);
        return res.status(200).json(expedients);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getExpedientDetails = async (req: AuthRequest, res: Response) => {
    if (!req.params.no_expedient) {
        return res.status(400).json({ message: 'Expedient ID is required' });
    }

    const expedientId = Number(req.params.no_expedient);
    try {
        const expedientDetail = await getExpedientDetail(expedientId);
        if (!expedientDetail) {
            return res.status(404).json({ message: 'Expedient not found' });
        }
        return res.status(200).json(expedientDetail);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const changeExpedientStatus = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { no_expediente, nuevo_estado, descripcion } = req.body;
        const result = await changeStatusExpedient(no_expediente, nuevo_estado, userId, descripcion);
        if (result) {
            return res.status(200).json({ message: 'Expedient status updated successfully' });
        } else {
            return res.status(400).json({ message: 'Failed to update expedient status' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }

};


export const getExpedientHistoryByRange = async (req:AuthRequest,res:Response) => {
    
    const { id_estado, fecha_inicio, fecha_fin } = req.body;

    try {
        

    
        const result = await getExpedientStatusHistoryOnRange(fecha_inicio!, fecha_fin!, id_estado);
        return res.status(200).json(result);
        
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }


}

