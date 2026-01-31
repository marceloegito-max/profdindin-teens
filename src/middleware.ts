import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirecionar para dashboard correto baseado no role
    if (path === '/dashboard' && token?.role) {
      switch (token.role) {
        case 'TEEN':
          return NextResponse.next(); // Já está no lugar certo
        case 'PROFESSOR':
          return NextResponse.redirect(new URL('/dashboard/professor', req.url));
        case 'RESPONSIBLE':
          return NextResponse.redirect(new URL('/dashboard/responsible', req.url));
        case 'ADMIN':
          return NextResponse.redirect(new URL('/dashboard/admin', req.url));
      }
    }

    // Proteger rotas do professor
    if (path.startsWith('/dashboard/professor')) {
      if (token?.role !== 'PROFESSOR' && token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Proteger rotas do responsável
    if (path.startsWith('/dashboard/responsible')) {
      if (token?.role !== 'RESPONSIBLE' && token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Proteger rotas do admin
    if (path.startsWith('/dashboard/admin')) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/professor/:path*',
    '/api/responsible/:path*',
    '/api/admin/:path*',
  ],
};
