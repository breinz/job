import { Response, Request, NextFunction } from "express";

export interface NewData {
    name: string,
    description: string
}

export class TravelValidator {
    new?: (req: Request, res: Response, next: NextFunction) => void
    edit?: (req: Request, res: Response, next: NextFunction) => void
}