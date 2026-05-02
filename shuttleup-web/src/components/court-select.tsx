"use client"

import * as React from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import type { Court } from "@/lib/types"

interface CourtSelectProps {
  courts: Court[]
  value: string
  onSelect: (courtId: string) => void
  disabled?: boolean
}

/**
 * Searchable court picker with district grouping.
 * Uses a simple dropdown pattern compatible with base-ui.
 */
export function CourtSelect({ courts, value, onSelect, disabled }: CourtSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)

  const selectedCourt = courts.find((c) => c.id === value)

  // Close on click outside
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const filtered = React.useMemo(() => {
    if (!search.trim()) return courts
    const q = search.toLowerCase()
    return courts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q)
    )
  }, [courts, search])

  // Group by district
  const grouped = React.useMemo(() => {
    const map = new Map<string, Court[]>()
    for (const c of filtered) {
      const existing = map.get(c.district) || []
      existing.push(c)
      map.set(c.district, existing)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b, "vi"))
  }, [filtered])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "min-h-10"
        )}
      >
        {selectedCourt ? (
          <span className="flex items-center gap-2 text-left truncate">
            <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
            <span className="truncate">
              {selectedCourt.name}
              <span className="text-muted-foreground ml-1 text-xs">
                — {selectedCourt.district}
              </span>
            </span>
          </span>
        ) : (
          <span className="text-muted-foreground">Select a court...</span>
        )}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          <div className="p-2 border-b">
            <Input
              placeholder="Search court name or district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
              autoFocus
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {grouped.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground text-center">
                No courts found.
              </p>
            ) : (
              grouped.map(([district, districtCourts]) => (
                <div key={district}>
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                    {district}
                  </div>
                  {districtCourts.map((court) => (
                    <button
                      key={court.id}
                      type="button"
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent cursor-pointer text-left",
                        value === court.id && "bg-accent"
                      )}
                      onClick={() => {
                        onSelect(court.id)
                        setOpen(false)
                        setSearch("")
                      }}
                    >
                      <Check
                        className={cn(
                          "h-4 w-4 shrink-0",
                          value === court.id ? "opacity-100 text-emerald-600" : "opacity-0"
                        )}
                      />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{court.name}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {court.address}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
