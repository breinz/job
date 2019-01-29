import { Response, Request, NextFunction } from "express";
import { json } from "body-parser";

export interface NewData {
    name: string,
    title: string,
    description: string,
    pic: string
}

export interface NewErrors {
    name?: string,
}

export interface NewPicData {
    name: string,
    description: string
}

export interface EditData {
    name: string,
    title: string,
    description: string
}

export interface EditErrors {
    name?: string,
}

export class TravelValidator {
    new?: (req: Request, res: Response, next: NextFunction) => void
    edit?: (req: Request, res: Response, next: NextFunction) => void
}