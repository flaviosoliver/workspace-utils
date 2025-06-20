'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { Minus, Square, X, Maximize2, Minimize2 } from 'lucide-react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Widget } from '@/types';

interface WindowProps {
  widget: Widget;
  children: ReactNode;
}

export default function Window({ widget, children }: WindowProps) {
  const { 
    closeWidget, 
    minimizeWidget, 
    maximizeWidget, 
    updateWidgetPosition, 
    updateWidgetSize, 
    bringToFront 
  } = useWorkspace();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const windowRef = useRef<HTMLDivElement>(null);

  // Handle mouse down on title bar for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.window-title')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - widget.position.x,
        y: e.clientY - widget.position.y,
      });
      bringToFront(widget.id);
    }
  };

  // Handle mouse down on resize handle
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: widget.size.width,
      height: widget.size.height,
    });
    bringToFront(widget.id);
  };

  // Handle mouse move for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, e.clientX - dragOffset.x);
        const newY = Math.max(0, e.clientY - dragOffset.y);
        
        updateWidgetPosition(widget.id, { x: newX, y: newY });
      }
      
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        const newWidth = Math.max(200, resizeStart.width + deltaX);
        const newHeight = Math.max(150, resizeStart.height + deltaY);
        
        updateWidgetSize(widget.id, { width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, widget.id, updateWidgetPosition, updateWidgetSize]);

  const windowStyle = widget.isMaximized
    ? {
        position: 'fixed' as const,
        left: 64,
        top: 0,
        width: 'calc(100vw - 64px)',
        height: '100vh',
        zIndex: widget.zIndex,
      }
    : {
        position: 'absolute' as const,
        left: widget.position.x,
        top: widget.position.y,
        width: widget.size.width,
        height: widget.size.height,
        zIndex: widget.zIndex,
      };

  return (
    <div
      ref={windowRef}
      style={windowStyle}
      className="bg-gray-800 border border-gray-600 rounded-lg shadow-2xl overflow-hidden select-none"
      onClick={() => bringToFront(widget.id)}
    >
      {/* Title Bar */}
      <div
        className="bg-gray-700 px-4 py-2 flex items-center justify-between cursor-move border-b border-gray-600"
        onMouseDown={handleMouseDown}
      >
        <div className="window-title flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-white text-sm font-medium ml-2">{widget.title}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWidget(widget.id);
            }}
            className="w-6 h-6 rounded hover:bg-gray-600 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWidget(widget.id);
            }}
            className="w-6 h-6 rounded hover:bg-gray-600 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          >
            {widget.isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWidget(widget.id);
            }}
            className="w-6 h-6 rounded hover:bg-red-600 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden" style={{ height: 'calc(100% - 40px)' }}>
        {children}
      </div>

      {/* Resize Handle */}
      {!widget.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-500"></div>
        </div>
      )}
    </div>
  );
}

