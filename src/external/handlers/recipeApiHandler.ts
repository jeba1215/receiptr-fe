/**
 * RecipeApiHandler - Handles individual recipe related API calls
 * This class encapsulates single recipe operations and mapping
 */

import type { Receipt } from '../../models/Receipt';
import { ReceiptsService } from '../api';
import { mapReceiptDtoToReceipt } from '../mappers';

export class RecipeApiHandler {
  /**
   * Retrieves a specific receipt by ID
   */
  async getReceipt(id: number, currentUserId: string): Promise<Receipt> {
    const userIdDto = { value: currentUserId };

    const response = await ReceiptsService.getReceipt(id, userIdDto);
    return mapReceiptDtoToReceipt(response);
  }

  /**
   * Deletes a specific receipt by ID
   */
  async deleteReceipt(id: number, currentUserId: string): Promise<void> {
    const userIdDto = { value: currentUserId };

    await ReceiptsService.deleteReceipt(id, userIdDto);
  }
}
