import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const DEFAULT_SUPABASE_URL = 'https://nvzvktpngsqzxecsryhe.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_t7P_rwRT4sPsTXtMg1zjOg_asdse8oZ';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname.startsWith('/login');
  const isPublicAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/logo.png' ||
    pathname.includes('.');

  // Don't intercept static assets or API routes
  if (isPublicAsset) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // Check user session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 1. If not authenticated and NOT on login page -> Redirect to /login
    if (!user && !isLoginPage) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      return NextResponse.redirect(loginUrl);
    }

    // 2. If authenticated and ON login page -> Redirect to dashboard /
    if (user && isLoginPage) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = '/';
      return NextResponse.redirect(homeUrl);
    }
  } catch (err) {
    // If Supabase is unreachable, allow graceful pass-through
  }

  return supabaseResponse;
}
