/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * User registration data
 */
export type CreateUserCommand = {
    authMethod?: CreateUserCommand.authMethod;
    email?: string;
    password?: string;
};
export namespace CreateUserCommand {
    export enum authMethod {
        EMAIL_PASSWORD = 'EMAIL_PASSWORD',
    }
}

