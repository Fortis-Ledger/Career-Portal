// Application configuration
export const config = {
  // Base URLs
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://career.fortisledger.io',
  
  // OAuth URLs
  oauth: {
    redirectUrl: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://career.fortisledger.io',
    callbackUrl: process.env.NEXT_PUBLIC_OAUTH_CALLBACK_URL || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://career.fortisledger.io'}/auth/callback`,
    profileUrl: process.env.NEXT_PUBLIC_OAUTH_PROFILE_URL || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://career.fortisledger.io'}/profile`,
  },
  
  // Supabase URLs
  supabase: {
    redirectUrl: process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://career.fortisledger.io',
  }
}

// Helper functions
export const getOAuthCallbackUrl = () => config.oauth.callbackUrl
export const getOAuthProfileUrl = () => config.oauth.profileUrl
export const getSiteUrl = () => config.siteUrl
