import { Response, Request, NextFunction } from "express";
import { json } from "body-parser";

export interface NewData {
    name: string,
    js: string,
    width: number,
    height: number
}

export interface NewErrors {
    name?: string
    js?: string
}

export interface EditData {
    name: string,
    js: string,
    width: number,
    height: number
}

export interface EditErrors {
    name?: string,
    js?: string
}

export class GameValidator {
    new?: (req: Request, res: Response, next: NextFunction) => void
    edit?: (req: Request, res: Response, next: NextFunction) => void
}