import { Response, Request, NextFunction } from "express";
import { json } from "body-parser";
import { SEO } from "..";

export interface NewData extends SEO {
    title: string,
    tags: string,
    description: string,
    pic: string,
}

export interface NewErrors {
    title?: string,
}

/*export interface NewPicData {
    title: string,
    tags:string,
    description: string
}*/

export interface EditData extends SEO {
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