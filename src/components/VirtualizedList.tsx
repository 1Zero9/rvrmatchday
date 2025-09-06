/**
 * Virtualized List Component - Enterprise Scale Performance
 * Efficiently render thousands of items with virtual scrolling
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number, isVisible: boolean) => React.ReactNode;
  getItemKey: (item: T, index: number) => string;
  overscan?: number; // Number of items to render outside visible area
  className?: string;
  onScroll?: (scrollTop: number) => void;
  enableSelection?: boolean;
  selectedItems?: string[];
  onSelectionChange?: (selectedKeys: string[]) => void;
}

export default function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  getItemKey,
  overscan = 5,
  className = "",
  onScroll,
  enableSelection = false,
  selectedItems = [],
  onSelectionChange
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );
    
    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.length - 1, end + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange.start, visibleRange.end]);

  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);
  };

  // Selection handlers
  const handleItemSelect = (itemKey: string, isShiftClick = false, isCtrlClick = false) => {
    if (!enableSelection || !onSelectionChange) return;

    let newSelection = [...selectedItems];

    if (isCtrlClick || isShiftClick) {
      // Multi-select mode
      if (selectedItems.includes(itemKey)) {
        newSelection = selectedItems.filter(key => key !== itemKey);
      } else {
        newSelection = [...selectedItems, itemKey];
      }
    } else {
      // Single select mode
      newSelection = [itemKey];
    }

    onSelectionChange(newSelection);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!enableSelection) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          // TODO: Implement arrow key navigation
          break;
        case 'ArrowUp':
          e.preventDefault();
          // TODO: Implement arrow key navigation
          break;
        case 'a':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const allKeys = items.map((item, index) => getItemKey(item, index));
            onSelectionChange?.(allKeys);
          }
          break;
        case 'Escape':
          onSelectionChange?.([]);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items, enableSelection, onSelectionChange, getItemKey]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Selection Header */}
      {enableSelection && selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-10 bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between"
        >
          <span className="text-sm font-medium text-blue-900">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={() => onSelectionChange?.([])}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear selection
          </button>
        </motion.div>
      )}

      {/* Virtualized Container */}
      <div
        ref={containerRef}
        style={{ height: containerHeight }}
        className="overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        onScroll={handleScroll}
        tabIndex={enableSelection ? 0 : undefined}
      >
        {/* Total height spacer */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* Visible items */}
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            {visibleItems.map((item, index) => {
              const actualIndex = visibleRange.start + index;
              const itemKey = getItemKey(item, actualIndex);
              const isSelected = selectedItems.includes(itemKey);
              const isVisible = actualIndex >= Math.floor(scrollTop / itemHeight) &&
                             actualIndex <= Math.floor(scrollTop / itemHeight) + Math.ceil(containerHeight / itemHeight);

              return (
                <div
                  key={itemKey}
                  style={{ height: itemHeight }}
                  className={`${enableSelection ? 'cursor-pointer' : ''} ${
                    isSelected ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50'
                  }`}
                  onClick={(e) => enableSelection && handleItemSelect(
                    itemKey, 
                    e.shiftKey, 
                    e.ctrlKey || e.metaKey
                  )}
                >
                  {renderItem(item, actualIndex, isVisible)}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Stats (Dev Mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          <div>Rendered: {visibleItems.length} / {items.length}</div>
          <div>Range: {visibleRange.start}-{visibleRange.end}</div>
        </div>
      )}

      {/* Loading Indicator for large datasets */}
      {items.length > 1000 && visibleItems.length < Math.min(50, items.length) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-gray-600">Loading {items.length.toLocaleString()} items...</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <div className="text-4xl mb-4">📋</div>
          <div className="text-lg font-medium mb-2">No items found</div>
          <div className="text-sm">The list is empty or all items have been filtered out</div>
        </div>
      )}
    </div>
  );
}

// Hook for managing large datasets
export function useLargeDataset<T>(
  data: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
  filters: Record<string, any> = {}
) {
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search and filtering
  const filteredData = useMemo(() => {
    setIsLoading(true);
    
    // Use setTimeout to prevent blocking the UI thread
    const timeoutId = setTimeout(() => setIsLoading(false), 100);

    let result = data;

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(item => 
          (item as any)[key]?.toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => 
          (item[field] as string)?.toLowerCase().includes(searchLower)
        )
      );
    }

    return () => {
      clearTimeout(timeoutId);
      return result;
    };
  }, [data, searchTerm, searchFields, filters]);

  return {
    data: typeof filteredData === 'function' ? filteredData() : filteredData,
    isLoading
  };
}