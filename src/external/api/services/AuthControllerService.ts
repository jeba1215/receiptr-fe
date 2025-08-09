/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserCommand } from '../models/CreateUserCommand';
import type { LoginCommand } from '../models/LoginCommand';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthControllerService {
    /**
     * @deprecated
     * @param requestBody
     * @returns User OK
     * @throws ApiError
     */
    public static login1(
        requestBody: LoginCommand,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns User OK
     * @throws ApiError
     */
    public static createUser1(
        requestBody: CreateUserCommand,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/createUser',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
