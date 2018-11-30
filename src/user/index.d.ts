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