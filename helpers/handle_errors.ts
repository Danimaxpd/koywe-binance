export function handleError(context: string, error: any): Error {
  console.error(`${context}: ${error}`);
  throw error;
}
