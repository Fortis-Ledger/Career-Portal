"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"

interface StatusUpdaterProps {
  applicationId: string
  currentStatus: string
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
  reviewing: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  interview: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
  offer: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
  withdrawn: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300",
}

const statusLabels = {
  pending: "Pending Review",
  reviewing: "Under Review",
  interview: "Interview Stage",
  offer: "Offer Extended",
  rejected: "Not Selected",
  withdrawn: "Withdrawn",
}

export function StatusUpdater({ applicationId, currentStatus }: StatusUpdaterProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [status, setStatus] = useState(currentStatus)

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", applicationId)
      
      if (error) throw error
      
      setStatus(newStatus)
      alert("Status updated successfully!")
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Badge className={`${statusColors[status as keyof typeof statusColors]} border-0`}>
        {statusLabels[status as keyof typeof statusLabels]}
      </Badge>
      
      <Select 
        onValueChange={handleStatusUpdate}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-48 bg-slate-700/80 border-slate-500 text-white hover:bg-slate-600/80 font-medium">
          <SelectValue placeholder="Update Status" />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-600 text-white shadow-xl">
          <SelectItem value="pending" className="text-white hover:bg-blue-600 hover:text-white cursor-pointer font-medium py-3">
            Pending Review
          </SelectItem>
          <SelectItem value="reviewing" className="text-white hover:bg-blue-600 hover:text-white cursor-pointer font-medium py-3">
            Under Review
          </SelectItem>
          <SelectItem value="interview" className="text-white hover:bg-purple-600 hover:text-white cursor-pointer font-medium py-3">
            Interview Stage
          </SelectItem>
          <SelectItem value="offer" className="text-white hover:bg-green-600 hover:text-white cursor-pointer font-medium py-3">
            Offer Extended
          </SelectItem>
          <SelectItem value="rejected" className="text-white hover:bg-red-600 hover:text-white cursor-pointer font-medium py-3">
            Not Selected
          </SelectItem>
          <SelectItem value="withdrawn" className="text-white hover:bg-gray-600 hover:text-white cursor-pointer font-medium py-3">
            Withdrawn
          </SelectItem>
        </SelectContent>
      </Select>
      
      {isUpdating && (
        <span className="text-slate-300 text-sm">Updating...</span>
      )}
    </div>
  )
}
