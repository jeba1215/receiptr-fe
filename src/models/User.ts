/**
 * Internal User domain model
 * This is the application's internal representation of a User
 */
export interface User {
  readonly id: string;
  email: string;
  createdAt: Date;
  createdBy: string;
  lastEditedAt: Date;
  lastEditedBy: string;
}
