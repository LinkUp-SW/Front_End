import { http, HttpResponse, JsonBodyType } from "msw";

export function createPostHandler<T extends JsonBodyType, B extends JsonBodyType = Record<string, unknown>>(
  path: string,
  resolver: (req: { params: Record<string, unknown>; body: B }) => T | HttpResponse
) {
  return http.post(path, async ({ request, params }) => {
    console.log(`[MSW] Intercepted POST ${request.url}`);
    
    // Parse the request body
    let body = {} as B;
    try {
      body = await request.json() as B;
    } catch (error) {
      console.error("[MSW] Failed to parse request body:", error);
    }
    
    // Call the resolver with params and body
    const result = resolver({ params, body });
    
    // Return the appropriate response
    return result instanceof HttpResponse
      ? result
      : HttpResponse.json<T>(result);
  });
}