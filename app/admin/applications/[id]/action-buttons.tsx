"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Mail, MessageSquare, Clock, MapPin, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ActionButtonsProps {
  applicationId: string
  applicantEmail: string
  applicantName: string
}

export function ActionButtons({ applicationId, applicantEmail, applicantName }: ActionButtonsProps) {
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showNotesForm, setShowNotesForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  // Schedule Interview
  const handleScheduleInterview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const date = formData.get("date") as string
    const time = formData.get("time") as string
    const type = formData.get("type") as string
    const notes = formData.get("notes") as string

    try {
      // Here you would typically:
      // 1. Save interview details to database
      // 2. Send email to applicant
      // 3. Update application status
      
      console.log("Interview scheduled:", { date, time, type, notes })
      
      // Update application status to interview
      const { error } = await supabase
        .from("applications")
        .update({ 
          status: "interview",
          notes: `Interview scheduled for ${date} at ${time}. Type: ${type}. Notes: ${notes}`
        })
        .eq("id", applicationId)

      if (error) throw error

      alert("Interview scheduled successfully!")
      setShowScheduleForm(false)
    } catch (error) {
      console.error("Error scheduling interview:", error)
      alert("Failed to schedule interview")
    } finally {
      setIsLoading(false)
    }
  }

  // Send Email
  const handleSendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'custom',
          data: {
            to: applicantEmail,
            subject: subject,
            message: message,
            applicantName: applicantName
          }
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send email')
      }

      alert("Email sent successfully!")
      setShowEmailForm(false)
    } catch (error) {
      console.error("Error sending email:", error)
      alert(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Add Notes
  const handleAddNotes = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const notes = formData.get("notes") as string

    try {
      // Update application with notes
      const { error } = await supabase
        .from("applications")
        .update({ notes })
        .eq("id", applicationId)

      if (error) throw error

      alert("Notes added successfully!")
      setShowNotesForm(false)
    } catch (error) {
      console.error("Error adding notes:", error)
      alert("Failed to add notes")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
          onClick={() => setShowScheduleForm(!showScheduleForm)}
        >
          <Clock className="w-4 h-4 mr-2" />
          Schedule Interview
        </Button>
        <Button
          variant="outline"
          className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
          onClick={() => setShowEmailForm(!showEmailForm)}
        >
          <Mail className="w-4 h-4 mr-2" />
          Send Email
        </Button>
        <Button
          variant="outline"
          className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
          onClick={() => setShowNotesForm(!showNotesForm)}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Add Notes
        </Button>
      </div>

      {/* Schedule Interview Form */}
      {showScheduleForm && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Schedule Interview</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScheduleInterview} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-slate-300">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="text-slate-300">Time</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    required
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="type" className="text-slate-300">Interview Type</Label>
                <select
                  id="type"
                  name="type"
                  required
                  className="w-full p-2 bg-slate-700/50 border border-slate-600 text-white rounded-md"
                >
                  <option value="phone">Phone Call</option>
                  <option value="video">Video Call</option>
                  <option value="in-person">In Person</option>
                </select>
              </div>
              <div>
                <Label htmlFor="notes" className="text-slate-300">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any additional notes for the interview..."
                  className="bg-slate-700/50 border-slate-600 text-white"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                  {isLoading ? "Scheduling..." : "Schedule Interview"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowScheduleForm(false)}
                  className="bg-slate-700/50 border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Send Email Form */}
      {showEmailForm && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Send Email to {applicantName}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <Label htmlFor="subject" className="text-slate-300">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Email subject..."
                  required
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-slate-300">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your message to the applicant..."
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  rows={5}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                  {isLoading ? "Sending..." : "Send Email"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEmailForm(false)}
                  className="bg-slate-700/50 border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Add Notes Form */}
      {showNotesForm && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Add Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddNotes} className="space-y-4">
              <div>
                <Label htmlFor="notes" className="text-slate-300">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Add your notes about this application..."
                  required
                  className="bg-slate-700/50 border-slate-600 text-white"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                  {isLoading ? "Adding..." : "Add Notes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNotesForm(false)}
                  className="bg-slate-700/50 border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
