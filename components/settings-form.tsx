"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Globe,
  Mail,
  Shield,
  Database,
  Palette,
  Bell,
  FileText,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface SettingsData {
  portal_name: string
  portal_description: string
  company_website: string
  contact_email: string
  primary_color: string
  secondary_color: string
  logo_url: string
  dark_mode: boolean
  smtp_host: string
  smtp_port: string
  smtp_username: string
  smtp_password: string
  email_notifications: boolean
  require_email_verification: boolean
  enable_2fa: boolean
  public_registration: boolean
  session_timeout: number
  max_file_size: number
  auto_application_confirmation: boolean
  allow_multiple_applications: boolean
  application_deadline: number
  required_fields: string
  notify_new_applications: boolean
  notify_new_registrations: boolean
  daily_summary: boolean
  notification_email: string
}

export default function SettingsForm() {
  const [settings, setSettings] = useState<SettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else {
        setMessage({ type: 'error', text: 'Failed to load settings' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error loading settings' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        const result = await response.json()
        setMessage({ type: 'success', text: result.message || 'Settings saved successfully!' })
      } else {
        const error = await response.json()
        if (error.setupRequired) {
          setMessage({ 
            type: 'error', 
            text: `${error.error} Please run this SQL script in your Supabase dashboard: ${error.script}` 
          })
        } else {
          setMessage({ type: 'error', text: error.error || error.message || 'Failed to save settings' })
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving settings' })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    fetchSettings()
    setMessage({ type: 'success', text: 'Settings reset to saved values' })
  }

  const handlePreview = () => {
    // Open portal in new tab with current settings applied
    window.open('/', '_blank')
  }

  const updateSetting = (key: keyof SettingsData, value: any) => {
    if (!settings) return
    setSettings({ ...settings, [key]: value })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center text-red-400 py-8">
        Failed to load settings. Please try again.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/20 border-green-500/30 text-green-300' 
            : 'bg-red-500/20 border-red-500/30 text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* General Settings */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Globe className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="portal-name" className="text-slate-300">Portal Name</Label>
              <Input
                id="portal-name"
                value={settings.portal_name}
                onChange={(e) => updateSetting('portal_name', e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portal-description" className="text-slate-300">Portal Description</Label>
              <Textarea
                id="portal-description"
                value={settings.portal_description}
                onChange={(e) => updateSetting('portal_description', e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-website" className="text-slate-300">Company Website</Label>
              <Input
                id="company-website"
                value={settings.company_website}
                onChange={(e) => updateSetting('company_website', e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email" className="text-slate-300">Contact Email</Label>
              <Input
                id="contact-email"
                value={settings.contact_email}
                onChange={(e) => updateSetting('contact_email', e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Branding & Appearance */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Palette className="w-5 h-5" />
              Branding & Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color" className="text-slate-300">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={settings.primary_color}
                  onChange={(e) => updateSetting('primary_color', e.target.value)}
                  className="w-16 h-10 bg-slate-700/50 border-slate-600"
                />
                <Input
                  value={settings.primary_color}
                  onChange={(e) => updateSetting('primary_color', e.target.value)}
                  className="flex-1 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color" className="text-slate-300">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={settings.secondary_color}
                  onChange={(e) => updateSetting('secondary_color', e.target.value)}
                  className="w-16 h-10 bg-slate-700/50 border-slate-600"
                />
                <Input
                  value={settings.secondary_color}
                  onChange={(e) => updateSetting('secondary_color', e.target.value)}
                  className="flex-1 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo-url" className="text-slate-300">Logo URL</Label>
              <Input
                id="logo-url"
                value={settings.logo_url}
                onChange={(e) => updateSetting('logo_url', e.target.value)}
                placeholder="https://example.com/logo.png"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-slate-300">Enable Dark Mode</Label>
              <Switch 
                id="dark-mode" 
                checked={settings.dark_mode}
                onCheckedChange={(checked) => updateSetting('dark_mode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Mail className="w-5 h-5" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host" className="text-slate-300">SMTP Host</Label>
              <Input
                id="smtp-host"
                value={settings.smtp_host}
                onChange={(e) => updateSetting('smtp_host', e.target.value)}
                placeholder="smtp.gmail.com"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port" className="text-slate-300">SMTP Port</Label>
              <Input
                id="smtp-port"
                value={settings.smtp_port}
                onChange={(e) => updateSetting('smtp_port', e.target.value)}
                placeholder="587"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-username" className="text-slate-300">SMTP Username</Label>
              <Input
                id="smtp-username"
                value={settings.smtp_username}
                onChange={(e) => updateSetting('smtp_username', e.target.value)}
                placeholder="your-email@gmail.com"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-password" className="text-slate-300">SMTP Password</Label>
              <div className="relative">
                <Input
                  id="smtp-password"
                  type={showPassword ? "text" : "password"}
                  value={settings.smtp_password}
                  onChange={(e) => updateSetting('smtp_password', e.target.value)}
                  placeholder="••••••••"
                  className="bg-slate-700/50 border-slate-600 text-white pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-slate-300">Enable Email Notifications</Label>
              <Switch 
                id="email-notifications" 
                checked={settings.email_notifications}
                onCheckedChange={(checked) => updateSetting('email_notifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="require-email-verification" className="text-slate-300">Require Email Verification</Label>
              <Switch 
                id="require-email-verification" 
                checked={settings.require_email_verification}
                onCheckedChange={(checked) => updateSetting('require_email_verification', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-2fa" className="text-slate-300">Enable Two-Factor Authentication</Label>
              <Switch 
                id="enable-2fa" 
                checked={settings.enable_2fa}
                onCheckedChange={(checked) => updateSetting('enable_2fa', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="public-registration" className="text-slate-300">Allow Public Registration</Label>
              <Switch 
                id="public-registration" 
                checked={settings.public_registration}
                onCheckedChange={(checked) => updateSetting('public_registration', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-timeout" className="text-slate-300">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                value={settings.session_timeout}
                onChange={(e) => updateSetting('session_timeout', parseInt(e.target.value) || 60)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-file-size" className="text-slate-300">Max File Upload Size (MB)</Label>
              <Input
                id="max-file-size"
                type="number"
                value={settings.max_file_size}
                onChange={(e) => updateSetting('max_file_size', parseInt(e.target.value) || 10)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Application Settings */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="w-5 h-5" />
              Application Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-application-confirmation" className="text-slate-300">Auto-send Application Confirmations</Label>
              <Switch 
                id="auto-application-confirmation" 
                checked={settings.auto_application_confirmation}
                onCheckedChange={(checked) => updateSetting('auto_application_confirmation', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-multiple-applications" className="text-slate-300">Allow Multiple Applications per Job</Label>
              <Switch 
                id="allow-multiple-applications" 
                checked={settings.allow_multiple_applications}
                onCheckedChange={(checked) => updateSetting('allow_multiple_applications', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="application-deadline" className="text-slate-300">Default Application Deadline (days)</Label>
              <Input
                id="application-deadline"
                type="number"
                value={settings.application_deadline}
                onChange={(e) => updateSetting('application_deadline', parseInt(e.target.value) || 30)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="required-fields" className="text-slate-300">Required Application Fields</Label>
              <Textarea
                id="required-fields"
                value={settings.required_fields}
                onChange={(e) => updateSetting('required_fields', e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-new-applications" className="text-slate-300">Notify on New Applications</Label>
              <Switch 
                id="notify-new-applications" 
                checked={settings.notify_new_applications}
                onCheckedChange={(checked) => updateSetting('notify_new_applications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-new-registrations" className="text-slate-300">Notify on New User Registrations</Label>
              <Switch 
                id="notify-new-registrations" 
                checked={settings.notify_new_registrations}
                onCheckedChange={(checked) => updateSetting('notify_new_registrations', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-summary" className="text-slate-300">Send Daily Summary Reports</Label>
              <Switch 
                id="daily-summary" 
                checked={settings.daily_summary}
                onCheckedChange={(checked) => updateSetting('daily_summary', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notification-email" className="text-slate-300">Notification Email</Label>
              <Input
                id="notification-email"
                value={settings.notification_email}
                onChange={(e) => updateSetting('notification_email', e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-8 border-t border-slate-700">
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={saving}
            className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={saving}
            className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Changes
          </Button>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {/* System Information */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Database className="w-5 h-5" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Portal Version</p>
              <p className="text-white font-medium">v2.1.0</p>
            </div>
            <div>
              <p className="text-slate-400">Database Status</p>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Connected</Badge>
            </div>
            <div>
              <p className="text-slate-400">Last Backup</p>
              <p className="text-white font-medium">2 hours ago</p>
            </div>
            <div>
              <p className="text-slate-400">Storage Used</p>
              <p className="text-white font-medium">2.4 GB / 10 GB</p>
            </div>
            <div>
              <p className="text-slate-400">Active Sessions</p>
              <p className="text-white font-medium">12</p>
            </div>
            <div>
              <p className="text-slate-400">Uptime</p>
              <p className="text-white font-medium">7 days, 14 hours</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
