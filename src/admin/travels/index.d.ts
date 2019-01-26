import { Response, Request, NextFunction } from "express";
import { json } from "body-parser";

export interface NewData {
    name: string,
    title: string,
    parent: string,
    description: string
}

export interface NewErrors {
    name?: string,
    parent?: string
}

export interface NewPicData {
    name: string,
    description: string
}

export interface EditData {
    name: string,
    title: string,
    parent: string,
    description: string
}

export interface EditErrors {
    name?: string,
    parent?: string
}

export class TravelValidator {
    new?: (req: Request, res: Response, next: NextFunction) => void
    edit?: (req: Request, res: Response, next: NextFunction) => void
}