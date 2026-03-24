import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Leemos el token desde las cookies (seteadas por Zustand form/cookie en Next)
  const token = request.cookies.get('meys_token')?.value;

  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith('/login');
  const isProtectedAppRoute = pathname.startsWith('/super-admin') || pathname.startsWith('/company') || pathname.startsWith('/dashboard');

  // Caso 1: Intentan entrar a una ruta protegida sin token
  if (!token && isProtectedAppRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Caso 2: Tienen token (ya logueados) e intentan ver la página de login
  if (token && isAuthPage) {
    // Redireccionará siempre a su dashboard principal, inicialmente super-admin 
    // Tarea 5: Manejar redirección inteligente basada en el rol.
    return NextResponse.redirect(new URL('/super-admin/dashboard', request.url));
  }

  // Sin impedimentos, dejamos pasar a la App.
  return NextResponse.next();
}

// Opcional: Regex matcher para que el middleware actúe solo en las rutas clave.
export const config = {
  matcher: ['/super-admin/:path*', '/company/:path*', '/dashboard/:path*', '/login'],
};
