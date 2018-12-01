import { Response, Request, NextFunction } from "express";

export interface NewData {
    name: string
}

export interface NewErrors {
    name?: string
}

export interface EditData {
    name: string,
    width: number,
    height: number
}

export interface EditErrors {
    name?: string
}

export class GameValidator {
    new?: (req: Request, res: Response, next: NextFunction) => void
    edit?: (req: Request, res: Response, next: NextFunction) => void
}