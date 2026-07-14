"use client"

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { AdminCollapsibleControllerProps } from '@/hooks/use-admin-collapsible'
import { cn } from '@/lib/utils'

interface AdminCollapsibleSectionProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  count?: number
  countLabel?: string
  defaultOpen?: boolean
  isEditing?: boolean
  controller?: AdminCollapsibleControllerProps
  children: React.ReactNode
}

export function AdminCollapsibleSection({
  title,
  subtitle,
  count,
  countLabel,
  defaultOpen = false,
  isEditing = false,
  controller,
  children,
}: AdminCollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  // Force open if a child record is being edited
  useEffect(() => {
    if (isEditing) {
      setIsOpen(true)
    }
  }, [isEditing])

  // Listen to the expand/collapse all controller
  useEffect(() => {
    if (controller?.expandAllSignal && controller.expandAllSignal > 0) {
      setIsOpen(true)
    }
  }, [controller?.expandAllSignal])

  useEffect(() => {
    // Only allow collapsing if we are not actively editing a record in this group
    if (controller?.collapseAllSignal && controller.collapseAllSignal > 0 && !isEditing) {
      setIsOpen(false)
    }
  }, [controller?.collapseAllSignal, isEditing])

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => {
          // If editing, we optionally prevent collapse or just allow it? 
          // The prompt says "Keep that group open until editing is finished or cancelled."
          if (!isEditing) {
            setIsOpen(!isOpen)
          }
        }}
        className={cn(
          "w-full flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50/80 px-6 py-4 hover:bg-slate-100/80 focus-visible:outline-none focus-visible:bg-slate-100/80 transition-colors gap-2 text-left",
          isOpen && "border-b border-slate-200",
          isEditing && "cursor-default hover:bg-slate-50/80 focus-visible:bg-slate-50/80" // Remove hover feedback if locked open
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h3 className="font-bold text-slate-900 text-base">{title}</h3>
          {subtitle && <span className="text-sm text-slate-500 font-medium">{subtitle}</span>}
        </div>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 text-slate-500">
          {count !== undefined && countLabel && (
            <span className="text-sm font-medium">
              {count} {countLabel}
            </span>
          )}
          <ChevronDown 
            className={cn(
              "w-5 h-5 transition-transform duration-200 shrink-0",
              isOpen ? "rotate-180" : "",
              isEditing ? "opacity-50" : ""
            )} 
          />
        </div>
      </button>

      <div 
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
