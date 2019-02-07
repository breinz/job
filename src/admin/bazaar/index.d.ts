import { Response, Request, NextFunction } from "express";
import { json } from "body-parser";

export interface NewData {
    title: string,
    link: string,
    parent: string,
    description: string,
    url: string
}

export interface NewErrors {
    title?: string,
}

export interface EditData {
    title: string,
    link: string,
    parent: string,
    description: string,
    url: string
}

export interface EditErrors {
    title?: string,
    parent?: string
}

export class BazaarValidator {
    new?: (req: Request, res: Response, next: NextFunction) => void
    edit?: (req: Request, res: Response, next: NextFunction) => void
}