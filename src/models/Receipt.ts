/**
 * Internal Receipt domain model
 * This is the application's internal representation of a Receipt
 */
export interface Receipt {
  readonly id: number;
  description: string;
  amount: number;
  createdAt: Date;
}
