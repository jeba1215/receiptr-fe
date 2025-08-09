/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Login credentials
 */
export type LoginCommand = {
    authMethod?: LoginCommand.authMethod;
    email?: string;
    password?: string;
};
export namespace LoginCommand {
    export enum authMethod {
        EMAIL_PASSWORD = 'EMAIL_PASSWORD',
    }
}

