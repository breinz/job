import { Request, Response, NextFunction } from "express";

export declare namespace Signup {
    interface Errors {
        login?: string,
        email?: string,
        password?: string,
        password2?: string,
    }
    interface Data {
        login: string,
        email: string,
        password: string,
        password2: string
    }
}

export declare namespace Login {
    interface Data {
        email: string,
        password: string
    }
}

export interface Validator {
    loggedIn?: (req: Request, res: Response, next: NextFunction) => void,
    notLoggedIn?: (req: Request, res: Response, next: NextFunction) => void,
    signup?: (req: Request, res: Response, next: NextFunction) => void
}