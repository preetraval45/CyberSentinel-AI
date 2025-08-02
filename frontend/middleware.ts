import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/login', '/register']
const roleRoutes = {
  '/admin': 'SuperAdmin',
  '/user-panel': 'User',
  '/limited-access': 'LimitedUser'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for auth token
  const token = request.cookies.get('access_token')?.value
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Decode JWT to get role (simple base64 decode for payload)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const userRole = payload.role
    
    // Check role-based access
    for (const [route, requiredRole] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(route)) {
        const roleHierarchy = { 'SuperAdmin': 3, 'User': 2, 'LimitedUser': 1 }
        const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
        const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0
        
        if (userLevel < requiredLevel) {
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
      }
    }
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}