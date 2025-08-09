/**
 * RecipeListApiHandler - Handles recipe list related API calls
 * This class encapsulates all recipe listing operations and mapping
 */

import type { CreateReceiptData } from '../../models/CreateReceipt';
import type { Receipt } from '../../models/Receipt';
import { ReceiptsService } from '../api';
import { mapReceiptDtoToReceipt } from '../mappers';

export class RecipeListApiHandler {
  /**
   * Retrieves all receipts for the authenticated user
   */
  async getAllReceipts(): Promise<Receipt[]> {
    const response = await ReceiptsService.getAllReceipts();

    // Handle both single receipt and array responses
    if (Array.isArray(response)) {
      return response.map(mapReceiptDtoToReceipt);
    } else {
      return [mapReceiptDtoToReceipt(response)];
    }
  }

  /**
   * Creates a new receipt
   */
  async createReceipt(receiptData: CreateReceiptData, currentUserId: string): Promise<Receipt> {
    const createReceiptRequest = {
      description: receiptData.description,
      amount: receiptData.amount,
    };

    const userIdDto = { value: currentUserId };

    const response = await ReceiptsService.createReceipt({
      request: createReceiptRequest,
      currentUserId: userIdDto,
    });

    return mapReceiptDtoToReceipt(response);
  }

  /**
   * Health check for receipts service
   */
  async healthCheck(): Promise<string> {
    return await ReceiptsService.healthCheck();
  }
}
