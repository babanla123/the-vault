import { type NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/dashboard", "/upload", "/account", "/my-assets"]
const publicRoutes = ["/", "/about", "/docs"]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const userCookie = request.cookies.get("vault_user")?.value
  const decodedCookie = userCookie ? decodeURIComponent(userCookie) : null

  // console.log("[v0] Middleware - pathname:", pathname, "cookie present:", !!decodedCookie)

  // Check if route requires authentication
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  const isPublic = publicRoutes.some((route) => pathname === route)

  if (isProtected && !decodedCookie) {
    // console.log("[v0] Middleware - redirecting unauthenticated user from:", pathname)
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (isPublic && decodedCookie) {
    // Allow access to public routes even if authenticated
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)",
  ],
}
