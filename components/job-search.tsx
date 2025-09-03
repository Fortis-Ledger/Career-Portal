"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface JobSearchProps {
  onSearch: (filters: SearchFilters) => void
  skills: Array<{ id: string; name: string; category: string }>
  initialFilters?: SearchFilters
}

export interface SearchFilters {
  query: string
  skillIds: string[]
  employmentTypes: string[]
  experienceLevels: string[]
  isRemoteOnly: boolean
  salaryMin: number
}

const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
]

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead" },
  { value: "executive", label: "Executive" },
]

export function JobSearch({ onSearch, skills, initialFilters }: JobSearchProps) {
  const pathname = usePathname()
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {
    query: "",
    skillIds: [],
    employmentTypes: [],
    experienceLevels: [],
    isRemoteOnly: false,
    salaryMin: 0,
  })

  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const [showFilters, setShowFilters] = useState(false)

  // Fetch job suggestions based on query
  const fetchSuggestions = async (query: string) => {
    if (query.length < 1) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoadingSuggestions(true)
    try {
      const supabase = createClient()
      const { data: jobs } = await supabase
        .from("jobs")
        .select(`
          title,
          companies (name)
        `)
        .eq("is_active", true)
        .or(`title.ilike.%${query}%,companies.name.ilike.%${query}%`)
        .limit(8)

      const jobSuggestions = jobs?.map(job => job.title) || []
      const companySuggestions = jobs?.map(job => (job.companies as any)?.name).filter(Boolean) as string[] || []
      
      const allSuggestions = [...new Set([...jobSuggestions, ...companySuggestions])]
        .filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6)

      setSuggestions(allSuggestions)
      setShowSuggestions(allSuggestions.length > 0)
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  // Debounced search suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.query) {
        fetchSuggestions(filters.query)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [filters.query])

  // Handle clicking outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = () => {
    setShowSuggestions(false)
    onSearch(filters)
  }

  // Real-time search as user types - only trigger on query changes
  useEffect(() => {
    // Only trigger real-time search if not on home page
    if (pathname !== '/') {
      const timeoutId = setTimeout(() => {
        // Only trigger search if query has changed or is empty (to show all jobs)
        onSearch(filters)
      }, 300) // 300ms delay for real-time search

      return () => clearTimeout(timeoutId)
    }
  }, [filters.query, onSearch, pathname]) // Include pathname in dependencies

  const handleSuggestionClick = (suggestion: string) => {
    setFilters(prev => ({ ...prev, query: suggestion }))
    setShowSuggestions(false)
    onSearch({ ...filters, query: suggestion })
  }

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: "",
      skillIds: [],
      employmentTypes: [],
      experienceLevels: [],
      isRemoteOnly: false,
      salaryMin: 0,
    }
    setFilters(clearedFilters)
    onSearch(clearedFilters)
  }

  const toggleSkill = (skillId: string) => {
    setFilters((prev) => ({
      ...prev,
      skillIds: prev.skillIds.includes(skillId)
        ? prev.skillIds.filter((id) => id !== skillId)
        : [...prev.skillIds, skillId],
    }))
  }

  const toggleEmploymentType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      employmentTypes: prev.employmentTypes.includes(type)
        ? prev.employmentTypes.filter((t) => t !== type)
        : [...prev.employmentTypes, type],
    }))
  }

  const toggleExperienceLevel = (level: string) => {
    setFilters((prev) => ({
      ...prev,
      experienceLevels: prev.experienceLevels.includes(level)
        ? prev.experienceLevels.filter((l) => l !== level)
        : [...prev.experienceLevels, level],
    }))
  }

  const activeFiltersCount =
    filters.skillIds.length +
    filters.employmentTypes.length +
    filters.experienceLevels.length +
    (filters.isRemoteOnly ? 1 : 0) +
    (filters.salaryMin > 0 ? 1 : 0)

  // Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, typeof skills>,
  )

  return (
    <div className="space-y-4">
      {/* Main search bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
          <Input
            ref={searchInputRef}
            placeholder="Search jobs, companies, or skills..."
            value={filters.query}
            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
            className="pl-10"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onFocus={() => filters.query && suggestions.length > 0 && setShowSuggestions(true)}
          />
          
          {/* Autocomplete Suggestions */}
          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
            >
              {isLoadingSuggestions ? (
                <div className="px-4 py-2 text-sm text-gray-500">Loading suggestions...</div>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-3 h-3 text-gray-400" />
                      <span>{suggestion}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">No suggestions found</div>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSearch}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-1 sm:flex-none"
          >
            <Search className="w-4 h-4 sm:hidden mr-2" />
            Search
          </Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative flex-1 sm:flex-none">
            <Filter className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Filters</span>
            <span className="sm:hidden">Filter</span>
            {activeFiltersCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-blue-600">{activeFiltersCount}</Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.skillIds.map((skillId) => {
            const skill = skills.find((s) => s.id === skillId)
            return skill ? (
              <Badge key={skillId} variant="secondary" className="gap-1">
                {skill.name}
                <X className="w-3 h-3 cursor-pointer" onClick={() => toggleSkill(skillId)} />
              </Badge>
            ) : null
          })}
          {filters.employmentTypes.map((type) => (
            <Badge key={type} variant="secondary" className="gap-1">
              {EMPLOYMENT_TYPES.find((t) => t.value === type)?.label}
              <X className="w-3 h-3 cursor-pointer" onClick={() => toggleEmploymentType(type)} />
            </Badge>
          ))}
          {filters.experienceLevels.map((level) => (
            <Badge key={level} variant="secondary" className="gap-1">
              {EXPERIENCE_LEVELS.find((l) => l.value === level)?.label}
              <X className="w-3 h-3 cursor-pointer" onClick={() => toggleExperienceLevel(level)} />
            </Badge>
          ))}
          {filters.isRemoteOnly && (
            <Badge variant="secondary" className="gap-1">
              Remote Only
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => setFilters((prev) => ({ ...prev, isRemoteOnly: false }))}
              />
            </Badge>
          )}
          {filters.salaryMin > 0 && (
            <Badge variant="secondary" className="gap-1">
              Min ${filters.salaryMin.toLocaleString()}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters((prev) => ({ ...prev, salaryMin: 0 }))} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Expanded filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Employment Type */}
              <div>
                <h4 className="font-medium mb-3">Employment Type</h4>
                <div className="space-y-2">
                  {EMPLOYMENT_TYPES.map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={filters.employmentTypes.includes(type.value)}
                        onCheckedChange={() => toggleEmploymentType(type.value)}
                      />
                      <label htmlFor={type.value} className="text-sm">
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <h4 className="font-medium mb-3">Experience Level</h4>
                <div className="space-y-2">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <div key={level.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={level.value}
                        checked={filters.experienceLevels.includes(level.value)}
                        onCheckedChange={() => toggleExperienceLevel(level.value)}
                      />
                      <label htmlFor={level.value} className="text-sm">
                        {level.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remote Work */}
              <div>
                <h4 className="font-medium mb-3">Work Location</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remote-only"
                    checked={filters.isRemoteOnly}
                    onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, isRemoteOnly: !!checked }))}
                  />
                  <label htmlFor="remote-only" className="text-sm">
                    Remote only
                  </label>
                </div>
              </div>
            </div>

            {/* Minimum Salary */}
            <div>
              <h4 className="font-medium mb-3">Minimum Salary</h4>
              <Select
                value={filters.salaryMin.toString()}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, salaryMin: Number.parseInt(value) }))}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select minimum salary" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No minimum</SelectItem>
                  <SelectItem value="50000">$50,000+</SelectItem>
                  <SelectItem value="75000">$75,000+</SelectItem>
                  <SelectItem value="100000">$100,000+</SelectItem>
                  <SelectItem value="125000">$125,000+</SelectItem>
                  <SelectItem value="150000">$150,000+</SelectItem>
                  <SelectItem value="200000">$200,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Skills */}
            <div>
              <h4 className="font-medium mb-3">Skills</h4>
              <div className="space-y-4">
                {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h5 className="text-sm font-medium text-muted-foreground mb-2">{category}</h5>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <Badge
                          key={skill.id}
                          variant={filters.skillIds.includes(skill.id) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary/80"
                          onClick={() => toggleSkill(skill.id)}
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
