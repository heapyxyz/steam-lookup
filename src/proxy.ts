import { NextResponse, type NextRequest } from "next/server"
import { rateLimit } from "@daveyplate/next-rate-limit"

export async function proxy(request: NextRequest) {
  const response = NextResponse.next()

  return (request.method === "POST" ||
    request.url.indexOf("/profiles/") > -1) &&
    process.env.NODE_ENV === "production"
    ? await rateLimit({
        request,
        response,
        sessionLimit: 10,
        ipLimit: 10,
        sessionWindow: 30,
        ipWindow: 30,
      })
    : response
}

export const config = {
  matcher: ["/:path*"],
}
