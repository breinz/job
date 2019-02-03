import { Response, Request, NextFunction } from "express";
import { json } from "body-parser";

export interface NewData {
    content: string,
    source: string
}

export interface NewErrors {
    content?: string,
}

export interface EditData {
    content: string,
    source: string
}

export interface EditErrors {
    content?: string,
}

export class CitationValidator {
    new?: (req: Request, res: Response, next: NextFunction) => void
    edit?: (req: Request, res: Response, next: NextFunction) => void
}