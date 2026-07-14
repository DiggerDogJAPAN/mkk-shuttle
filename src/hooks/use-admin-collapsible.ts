import { useState, useCallback } from 'react'

export interface AdminCollapsibleControllerProps {
  expandAllSignal: number
  collapseAllSignal: number
}

export function useAdminCollapsibleController() {
  const [expandAllSignal, setExpandAllSignal] = useState(0)
  const [collapseAllSignal, setCollapseAllSignal] = useState(0)

  const expandAll = useCallback(() => {
    setExpandAllSignal(s => s + 1)
  }, [])

  const collapseAll = useCallback(() => {
    setCollapseAllSignal(s => s + 1)
  }, [])

  return {
    expandAll,
    collapseAll,
    controllerProps: {
      expandAllSignal,
      collapseAllSignal,
    },
  }
}
