"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { getOAuthCallbackUrl } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

interface SocialAuthButtonsProps {
  redirectTo?: string
  disabled?: boolean
}

export function SocialAuthButtons({ redirectTo = "/profile", disabled = false }: SocialAuthButtonsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(provider)

    try {
      const supabase = createClient()
      console.log(`Attempting ${provider} OAuth login...`)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getOAuthCallbackUrl()
        }
      })

      console.log(`${provider} OAuth response:`, { data, error })

      if (error) {
        console.error(`${provider} OAuth error details:`, error)
        alert(`${provider} OAuth Error: ${error.message}`)
        throw error
      }
    } catch (error) {
      console.error(`${provider} OAuth error:`, error)
      setIsLoading(null)
    }
  }

  return (
    <div className="space-y-4 mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => handleOAuthLogin('google')}
          disabled={disabled || isLoading !== null}
          className="h-11"
        >
          {isLoading === 'google' ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          ) : (
            <FcGoogle className="w-5 h-5" />
          )}
          <span className="ml-2">Google</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleOAuthLogin('github')}
          disabled={disabled || isLoading !== null}
          className="h-11"
        >
          {isLoading === 'github' ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          ) : (
            <Github className="w-5 h-5" />
          )}
          <span className="ml-2">GitHub</span>
        </Button>
      </div>
    </div>
  )
}
