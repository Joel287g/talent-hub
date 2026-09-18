export function extractHeaders(req: Request, headers: string[]): string[] {
  return headers.map((header) => req.headers[header]);
}
