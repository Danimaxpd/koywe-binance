export function handleError(context: string, error: any): void {
  console.error(`${context}: ${error}`);
  throw error;
}
