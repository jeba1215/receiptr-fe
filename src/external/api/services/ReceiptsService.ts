/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateReceiptRequest } from '../models/CreateReceiptRequest';
import type { ReceiptResponse } from '../models/ReceiptResponse';
import type { UserId } from '../models/UserId';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReceiptsService {
    /**
     * Get All Receipts
     * Retrieves all receipts for the authenticated user
     * @returns ReceiptResponse Receipts retrieved successfully
     * @throws ApiError
     */
    public static getAllReceipts(): CancelablePromise<ReceiptResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/private/receipts',
        });
    }
    /**
     * @param requestBody
     * @returns ReceiptResponse OK
     * @throws ApiError
     */
    public static createReceipt(
        requestBody: {
            request?: CreateReceiptRequest;
            currentUserId?: UserId;
        },
    ): CancelablePromise<ReceiptResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/private/receipts',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param currentUserId
     * @returns ReceiptResponse OK
     * @throws ApiError
     */
    public static getReceipt(
        id: number,
        currentUserId: UserId,
    ): CancelablePromise<ReceiptResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/private/receipts/{id}',
            path: {
                'id': id,
            },
            query: {
                'currentUserId': currentUserId,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static deleteReceipt(
        id: number,
        requestBody?: UserId,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/private/receipts/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns string OK
     * @throws ApiError
     */
    public static healthCheck(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/private/receipts/health',
        });
    }
}
