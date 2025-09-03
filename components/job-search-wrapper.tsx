"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { JobSearch, SearchFilters } from "./job-search"
import { useCallback } from "react"

interface JobSearchWrapperProps {
  skills: Array<{ id: string; name: string; category: string }>
}

export function JobSearchWrapper({ skills }: JobSearchWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize filters from URL parameters
  const initialFilters: SearchFilters = {
    query: searchParams.get('q') || '',
    skillIds: searchParams.get('skills')?.split(',').filter(Boolean) || [],
    employmentTypes: searchParams.get('employment')?.split(',').filter(Boolean) || [],
    experienceLevels: searchParams.get('experience')?.split(',').filter(Boolean) || [],
    isRemoteOnly: searchParams.get('remote') === 'true',
    salaryMin: parseInt(searchParams.get('salary') || '0'),
  }

  const handleSearch = useCallback((filters: SearchFilters) => {
    // Build URL search parameters
    const params = new URLSearchParams()
    
    if (filters.query.trim()) {
      params.set('q', filters.query.trim())
    }
    
    if (filters.skillIds.length > 0) {
      params.set('skills', filters.skillIds.join(','))
    }
    
    if (filters.employmentTypes.length > 0) {
      params.set('employment', filters.employmentTypes.join(','))
    }
    
    if (filters.experienceLevels.length > 0) {
      params.set('experience', filters.experienceLevels.join(','))
    }
    
    if (filters.isRemoteOnly) {
      params.set('remote', 'true')
    }
    
    if (filters.salaryMin > 0) {
      params.set('salary', filters.salaryMin.toString())
    }

    // Navigate to jobs page with search parameters
    const queryString = params.toString()
    const url = queryString ? `/jobs?${queryString}` : '/jobs'
    router.push(url)
  }, [router])

  return <JobSearch skills={skills} onSearch={handleSearch} initialFilters={initialFilters} />
}
