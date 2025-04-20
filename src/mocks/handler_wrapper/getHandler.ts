import { http, HttpResponse, JsonBodyType } from "msw";

export function createGetHandler<T extends JsonBodyType>(
  path: string,
  resolver: (req: { params: Record<string, unknown> }) => T | HttpResponse
) {
  return http.get(path, async (req) => {
    const result = resolver({ params: req.params });
    return result instanceof HttpResponse
      ? result
      : HttpResponse.json<T>(result);
  });
}
