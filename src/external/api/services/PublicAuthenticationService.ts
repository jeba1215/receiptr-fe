/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserCommand } from '../models/CreateUserCommand';
import type { LoginCommand } from '../models/LoginCommand';
import type { LoginResponse } from '../models/LoginResponse';
import type { RefreshTokenRequest } from '../models/RefreshTokenRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PublicAuthenticationService {
    /**
     * Refresh JWT Tokens
     * Uses a refresh token to generate a new session/refresh token pair. Implements token rotation for security.
     * @param requestBody
     * @returns LoginResponse Tokens refreshed successfully
     * @throws ApiError
     */
    public static refresh(
        requestBody: RefreshTokenRequest,
    ): CancelablePromise<LoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/public/refresh',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid or expired refresh token`,
            },
        });
    }
    /**
     * User Login
     * Authenticates a user with email/password and returns JWT token pair (session + refresh tokens)
     * @param requestBody
     * @returns LoginResponse Login successful, returns JWT tokens
     * @throws ApiError
     */
    public static login(
        requestBody: LoginCommand,
    ): CancelablePromise<LoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/public/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication failed - invalid credentials`,
            },
        });
    }
    /**
     * User Registration
     * Creates a new user account and automatically logs them in, returning JWT tokens
     * @param requestBody
     * @returns LoginResponse User created successfully, returns JWT tokens
     * @throws ApiError
     */
    public static createUser(
        requestBody: CreateUserCommand,
    ): CancelablePromise<LoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/public/createUser',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid user data or user already exists`,
            },
        });
    }
    /**
     * @returns string OK
     * @throws ApiError
     */
    public static health(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/public/health',
        });
    }
}
