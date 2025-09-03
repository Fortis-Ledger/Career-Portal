"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileText, Database } from "lucide-react"
import { exportToCSV, exportToJSON, formatDataForExport } from "@/lib/export-utils"

interface ExportButtonProps {
  data: any[]
  filename: string
  type: "applications" | "users" | "jobs"
  className?: string
}

export function ExportButton({ data, filename, type, className }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: "csv" | "json") => {
    setIsExporting(true)

    try {
      const formattedData = formatDataForExport(data, type)

      if (format === "csv") {
        exportToCSV(formattedData, filename)
      } else {
        exportToJSON(formattedData, filename)
      }
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50 ${className}`}
          disabled={isExporting || data.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-800 border-slate-600">
        <DropdownMenuItem
          onClick={() => handleExport("csv")}
          className="text-slate-300 hover:bg-slate-700 cursor-pointer"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("json")}
          className="text-slate-300 hover:bg-slate-700 cursor-pointer"
        >
          <Database className="w-4 h-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
