import { extractHeaders } from '@common/infrastructure/helpers';
import { LoggerMetadata } from '@logger/domain/entities';

export class RequestExtractorUtil {
  public static extractData(request: any, error?: any): LoggerMetadata {
    const headers = request.headers;
    const [apiKey, userAgent, ip, ip2, referer, appVersion, authorization] = extractHeaders(
      request,
      [
        'x-api-key',
        'user-agent',
        'client-ip',
        'x-forwarded-for',
        'referer',
        'app-version',
        'authorization',
      ],
    );

    const method = request.method;
    const content = method === 'GET' ? 'query' : 'body';
    const body = request[content];

    return {
      url: [request.url, request.baseUrl].join(''),
      ip: ip || ip2 || request.ip || 'unknown',
      request: body,
      headers,
      method,
      userAgent,
      referer,
      appVersion,
      apiKey,
      error,
    };
  }
}
