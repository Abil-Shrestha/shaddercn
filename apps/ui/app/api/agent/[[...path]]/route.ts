import { handleSessionRequest } from "@/lib/generative/sessions";

export const runtime = "nodejs";
export const maxDuration = 60;

async function handle(
  request: Request,
  context: { params: Promise<{ path?: string[] }> },
) {
  return handleSessionRequest(request, (await context.params).path);
}

export { handle as GET, handle as POST, handle as DELETE };
