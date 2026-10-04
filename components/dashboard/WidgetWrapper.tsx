'use client';

import React, { useState } from 'react';
import { WidgetInstance, WIDGET_CATALOG, useDashboardStore } from '@/store/dashboardStore';
import { GripVertical, Minus, Maximize2, X, MoreVertical } from 'lucide-react';

interface WidgetWrapperProps {
  widget: WidgetInstance;
  index: number;
  children: React.ReactNode;
  isDragOver?: boolean;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent, index: number) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
}

export function WidgetWrapper({
  widget,
  index,
  children,
  isDragOver = false,
  isDragging = false,
  onDragStart,
  onDragOver,
  onDrop,
}: WidgetWrapperProps) {
  const {
    isCustomizeMode,
    removeWidget,
    toggleMinimizeWidget,
    resizeWidget,
  } = useDashboardStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const meta = WIDGET_CATALOG[widget.type];
  const title = widget.title || meta?.title || widget.type;
  const subtitle = meta?.subtitle;

  // Responsive column span classes
  const getColSpanClass = (span: number) => {
    switch (span) {
      case 12:
        return 'col-span-12';
      case 10:
        return 'col-span-12 lg:col-span-10';
      case 9:
        return 'col-span-12 lg:col-span-9';
      case 8:
        return 'col-span-12 lg:col-span-8';
      case 7:
        return 'col-span-12 lg:col-span-7';
      case 6:
        return 'col-span-12 lg:col-span-6';
      case 5:
        return 'col-span-12 sm:col-span-6 lg:col-span-5';
      case 4:
        return 'col-span-12 sm:col-span-6 lg:col-span-4';
      case 3:
        return 'col-span-12 sm:col-span-6 lg:col-span-3';
      default:
        return 'col-span-12 lg:col-span-6';
    }
  };

  const handleColResize = (delta: number) => {
    const newSpan = Math.max(3, Math.min(12, widget.colSpan + delta));
    resizeWidget(widget.id, newSpan);
  };

  return (
    <div
      draggable={isCustomizeMode}
      onDragStart={(e) => onDragStart && onDragStart(e, index)}
      onDragOver={(e) => onDragOver && onDragOver(e, index)}
      onDrop={(e) => onDrop && onDrop(e, index)}
      className={`group relative flex flex-col rounded-lg bg-[#0D131D] border transition-all duration-150 ${
        isDragOver
          ? 'border-[#E11D48] ring-2 ring-[#E11D48]/80 ring-offset-2 ring-offset-[#070B12] scale-[0.99] shadow-xl'
          : isCustomizeMode
          ? 'border-[#E11D48]/50 shadow-lg shadow-[#E11D48]/5 cursor-move'
          : 'border-[#202A38] hover:border-[#202A38]/90'
      } ${isDragging ? 'opacity-40' : 'opacity-100'} ${getColSpanClass(widget.colSpan)}`}
    >
      {/* WIDGET HEADER */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#202A38]/70 select-none">
        <div className="flex items-center gap-2 overflow-hidden">
          {/* Drag Handle in Customize Mode */}
          {isCustomizeMode && (
            <div className="p-0.5 text-[#E11D48] cursor-grab active:cursor-grabbing hover:bg-white/[0.05] rounded">
              <GripVertical className="w-4 h-4" />
            </div>
          )}

          <div className="truncate">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-[#F9FAFB] tracking-tight truncate">
                {title}
              </h3>
              {meta?.category && (
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/[0.04] text-[#64748B] border border-white/[0.03]">
                  {meta.category}
                </span>
              )}
            </div>
            {subtitle && !widget.isMinimized && (
              <p className="text-[10px] text-[#64748B] truncate leading-tight">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-1 shrink-0">
          {isCustomizeMode ? (
            /* Customize Mode Controls */
            <div className="flex items-center gap-1 bg-[#111925] px-1.5 py-0.5 rounded border border-[#202A38]">
              <span className="text-[10px] font-mono text-[#94A3B8] pr-1">
                {widget.colSpan}/12
              </span>
              <button
                title="Decrease width"
                onClick={() => handleColResize(-2)}
                disabled={widget.colSpan <= 3}
                className="w-4 h-4 flex items-center justify-center text-xs font-mono text-[#94A3B8] hover:text-white disabled:opacity-30 rounded hover:bg-white/[0.1]"
              >
                -
              </button>
              <button
                title="Increase width"
                onClick={() => handleColResize(2)}
                disabled={widget.colSpan >= 12}
                className="w-4 h-4 flex items-center justify-center text-xs font-mono text-[#94A3B8] hover:text-white disabled:opacity-30 rounded hover:bg-white/[0.1]"
              >
                +
              </button>
              <button
                title="Remove widget"
                onClick={() => removeWidget(widget.id)}
                className="p-1 ml-1 text-[#F43F5E] hover:bg-[#F43F5E]/15 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Normal Mode Controls */
            <div className="flex items-center gap-1">
              <button
                title={widget.isMinimized ? 'Expand widget' : 'Minimize widget'}
                onClick={() => toggleMinimizeWidget(widget.id)}
                className="p-1 text-[#64748B] hover:text-[#F9FAFB] hover:bg-white/[0.05] rounded transition-colors"
              >
                {widget.isMinimized ? (
                  <Maximize2 className="w-3.5 h-3.5" />
                ) : (
                  <Minus className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Three-dot dropdown menu */}
              <div className="relative">
                <button
                  title="Widget Options"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-1 text-[#64748B] hover:text-[#F9FAFB] hover:bg-white/[0.05] rounded transition-colors"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {isMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <div
                      className="absolute right-0 top-full mt-1 w-44 z-50 rounded-md bg-[#111925] border border-[#202A38] shadow-xl py-1 text-xs font-mono"
                    >
                    <button
                      onClick={() => {
                        toggleMinimizeWidget(widget.id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-[#94A3B8] hover:text-[#F9FAFB] hover:bg-white/[0.06] flex items-center gap-2"
                    >
                      <Minus className="w-3.5 h-3.5" />
                      {widget.isMinimized ? 'Restore' : 'Minimize'}
                    </button>

                    <div className="px-3 py-1 text-[10px] text-[#64748B] uppercase tracking-wider border-t border-[#202A38]/50 mt-1 pt-1">
                      Width ({widget.colSpan}/12)
                    </div>
                    <div className="grid grid-cols-4 gap-1 px-3 py-1">
                      {[3, 4, 6, 8, 12].slice(0, 4).map((span) => (
                        <button
                          key={span}
                          onClick={() => {
                            resizeWidget(widget.id, span);
                            setIsMenuOpen(false);
                          }}
                          className={`text-center py-0.5 text-[10px] rounded ${
                            widget.colSpan === span
                              ? 'bg-[#E11D48] text-white font-bold'
                              : 'bg-white/[0.05] text-[#94A3B8] hover:bg-white/[0.1]'
                          }`}
                        >
                          {span}c
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-[#202A38]/50 my-1" />

                    <button
                      onClick={() => {
                        removeWidget(widget.id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-[#F43F5E] hover:bg-[#F43F5E]/10 flex items-center gap-2"
                    >
                      <X className="w-3.5 h-3.5" /> Remove Widget
                    </button>
                  </div>
                </>
              )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WIDGET BODY */}
      {!widget.isMinimized && (
        <div className="p-3.5 sm:p-4 flex-1 overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}
