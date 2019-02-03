import { Response, Request, NextFunction } from "express";
import { json } from "body-parser";

export interface NewData {
    title: string,
    tags: string,
    description: string,
    pic: string
}

export interface NewErrors {
    title?: string,
}

/*export interface NewPicData {
    title: string,
    tags:string,
    description: string
}*/

export interface EditData {
    title: string,
    tags: string,
    description: string
}

export interface EditErrors {
    title?: string,
}

export class WorkValidator {
    new?: (req: Request, res: Response, next: NextFunction) => void
    edit?: (req: Request, res: Response, next: NextFunction) => void
}