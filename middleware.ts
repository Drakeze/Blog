

import { clerkMiddleware } from "@clerk/nextjs/server"

export default clerkMiddleware()

export const config = {
  matcher: [
    // Run middleware on all routes except:
    // - static files (_next)
    // - public files (images, icons, etc.)
    "/((?!_next|.*\\..*).*)",
  ],
}