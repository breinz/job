import { UserModel } from "src/user/model";

declare global {
    namespace Express {
        export interface Request {
            current_user?: UserModel;
        }
    }
}