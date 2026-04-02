import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});
// Limit middleware execution to private routes only
export const config = {
  matcher: ['/profile', '/bets/:path*'],
};
