export function extractHeader(req: Request, header: string): string {
  return req.headers[header];
}
