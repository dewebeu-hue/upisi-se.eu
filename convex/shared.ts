export const ACTIVE_STATUS = "active";
export const DELETED_STATUS = "deleted";

export function now(): number {
  return Date.now();
}

export function createDeletedTimestamp(): number {
  return now();
}
