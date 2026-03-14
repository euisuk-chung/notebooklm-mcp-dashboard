import { useState, useCallback, useRef } from "react";

export function useBulkSelect(allIds: string[] = []) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [rangeMode, setRangeMode] = useState(false);
  const rangeStartRef = useRef<string | null>(null);

  const toggle = useCallback(
    (id: string) => {
      if (rangeMode) {
        if (rangeStartRef.current === null) {
          // First click in range mode: mark start
          rangeStartRef.current = id;
          setSelectedIds((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
          });
        } else {
          // Second click in range mode: select range
          const startIndex = allIds.indexOf(rangeStartRef.current);
          const endIndex = allIds.indexOf(id);
          if (startIndex !== -1 && endIndex !== -1) {
            const from = Math.min(startIndex, endIndex);
            const to = Math.max(startIndex, endIndex);
            setSelectedIds((prev) => {
              const next = new Set(prev);
              for (let i = from; i <= to; i++) {
                next.add(allIds[i]);
              }
              return next;
            });
          }
          rangeStartRef.current = null;
          setRangeMode(false);
        }
      } else {
        // Normal toggle
        setSelectedIds((prev) => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          return next;
        });
      }
    },
    [allIds, rangeMode]
  );

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(allIds));
  }, [allIds]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
    rangeStartRef.current = null;
    setRangeMode(false);
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const toggleRangeMode = useCallback(() => {
    setRangeMode((prev) => {
      if (!prev) {
        rangeStartRef.current = null;
      }
      return !prev;
    });
  }, []);

  return {
    selectedIds,
    toggle,
    selectAll,
    deselectAll,
    isSelected,
    selectedCount: selectedIds.size,
    rangeMode,
    toggleRangeMode,
    rangeStart: rangeStartRef.current,
  };
}
