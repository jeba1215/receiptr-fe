/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PrivateAuthenticationService {
    /**
     * User Logout
     * Logs out the current user by revoking all their refresh tokens. Requires valid JWT session token.
     * @returns void
     * @throws ApiError
     */
    public static logout(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/private/logout',
            errors: {
                401: `Unauthorized - invalid or missing JWT token`,
            },
        });
    }
}
