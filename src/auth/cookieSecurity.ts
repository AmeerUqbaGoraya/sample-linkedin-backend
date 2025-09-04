interface CookieSecurityConfig {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    path: string;
    domain?: string;
    maxAge?: number;
}

export const getSecureRefreshTokenConfig = (maxAge?: number): CookieSecurityConfig => {
    const cookieDomain = process.env.COOKIE_DOMAIN;
    
    const config: CookieSecurityConfig = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/api/users',
        ...(maxAge && { maxAge })
    };
    
    if (cookieDomain) {
        config.domain = cookieDomain;
    }
    
    return config;
};

export const SECURITY_REQUIREMENTS = {
    PRODUCTION: [
        'Must use HTTPS (secure: true enforced)',
        'Set COOKIE_DOMAIN to your production domain',
        'Use strong JWT secrets (32+ characters)',
        'Monitor for security vulnerabilities',
        'Consider rate limiting for auth endpoints'
    ]
};
