/**
 * Security configuration for HTTP cookies
 * Centralizes cookie security settings for consistency across the application
 */

interface CookieSecurityConfig {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    path: string;
    maxAge?: number;
}

/**
 * Get secure cookie configuration for refresh tokens
 * @param maxAge - Optional max age in milliseconds
 * @returns Cookie configuration object
 */
export const getSecureRefreshTokenConfig = (maxAge?: number): CookieSecurityConfig => {
    const isProduction = process.env.NODE_ENV === 'production';
    const forceHttps = process.env.FORCE_HTTPS === 'true';
    
    return {
        httpOnly: true,                              // Prevent XSS attacks
        secure: isProduction || forceHttps,          // HTTPS only in production or when forced
        sameSite: 'strict',                         // Prevent CSRF attacks
        path: '/api/users',                         // Restrict to user API routes only
        ...(maxAge && { maxAge })                   // Add maxAge if provided
    };
};

/**
 * Security recommendations for different environments
 */
export const SECURITY_RECOMMENDATIONS = {
    DEVELOPMENT: {
        message: '🔧 Development Mode - Cookies sent over HTTP (less secure)',
        recommendations: [
            'Set FORCE_HTTPS=true to test HTTPS-only cookies',
            'Use HTTPS proxy (nginx/cloudflare) for realistic testing',
            'Never use development settings in production'
        ]
    },
    PRODUCTION: {
        message: '🛡️ Production Mode - Cookies are HTTPS-only (secure)',
        requirements: [
            'Must use HTTPS in production',
            'Consider adding Domain restriction',
            'Monitor for cookie security headers'
        ]
    }
};

/**
 * Log security status for debugging
 */
export const logCookieSecurityStatus = (): void => {
    const isProduction = process.env.NODE_ENV === 'production';
    const forceHttps = process.env.FORCE_HTTPS === 'true';
    
    if (isProduction) {
        console.log('🛡️ [SECURITY] Production mode - HTTPS-only cookies enabled');
    } else if (forceHttps) {
        console.log('🔧 [SECURITY] Development mode - HTTPS-only cookies forced');
    } else {
        console.log('⚠️  [SECURITY] Development mode - HTTP cookies allowed (less secure)');
        console.log('💡 [SECURITY] Set FORCE_HTTPS=true to test secure cookies in development');
    }
};
