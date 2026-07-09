// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { createServerClient, type CookieOptions } from '@supabase/ssr'

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl

//   if (pathname === '/login') {
//     return NextResponse.next()
//   }

//   if (pathname.startsWith('/admin')) {
//     const response = NextResponse.next()

//     const supabase = createServerClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//       {
//         cookies: {
//           getAll() { return request.cookies.getAll() },
//           setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
//             cookiesToSet.forEach(({ name, value, options }) => {
//               request.cookies.set(name, value)
//               response.cookies.set(name, value, options as any)
//             })
//           },
//         },
//       }
//     )

//     const { data: { session } } = await supabase.auth.getSession()

//     if (!session) {
//       return NextResponse.redirect(new URL('/login', request.url))
//     }

//     return response
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ['/admin/:path*'],
// }




import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/login') {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    // Find the supabase auth token cookie regardless of project ID
    const allCookies = request.cookies.getAll()
    const authCookie = allCookies.find(
      c => c.name.includes('-auth-token') && !c.name.includes('code-verifier')
    )

    if (!authCookie) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // Cookie value is a JSON string — parse it to get access token
      const parsed = JSON.parse(authCookie.value)
      const accessToken = Array.isArray(parsed) ? parsed[0] : parsed?.access_token

      if (!accessToken) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // Decode JWT payload to check expiry
      const payload = JSON.parse(atob(accessToken.split('.')[1]))
      const isExpired = payload.exp * 1000 < Date.now()

      if (isExpired) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // Valid session — allow through
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}