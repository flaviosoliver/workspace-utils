'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Widget, WidgetType, Position, Size } from '@/types';

interface WorkspaceContextType {
  widgets: Widget[];
  activeWidgets: string[];
  openWidget: (type: WidgetType) => void;
  closeWidget: (id: string) => void;
  minimizeWidget: (id: string) => void;
  maximizeWidget: (id: string) => void;
  updateWidgetPosition: (id: string, position: Position) => void;
  updateWidgetSize: (id: string, size: Size) => void;
  bringToFront: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error(
      'useWorkspace deve ser usado dentro de um WorkspaceProvider'
    );
  }
  return context;
}

interface WorkspaceProviderProps {
  children: ReactNode;
}

const defaultWidgetSizes: Record<WidgetType, Size> = {
  water: { width: 350, height: 640 },
  tasks: { width: 560, height: 640 },
  timer: { width: 350, height: 550 },
  pomodoro: { width: 350, height: 820 },
  todo: { width: 620, height: 420 },
  notes: { width: 600, height: 400 },
  music: { width: 473, height: 430 },
  dataGenerator: { width: 550, height: 600 },
  aiChat: { width: 400, height: 350 },
  settings: { width: 700, height: 520 },
};

const widgetTitles: Record<WidgetType, string> = {
  tasks: 'Tarefas Diárias',
  timer: 'Timer',
  pomodoro: 'Pomodoro',
  todo: 'To-Do',
  notes: 'Anotações',
  music: 'Player de Música',
  dataGenerator: 'Gerador de Dados',
  aiChat: 'Chat IA',
  water: 'Água',
  settings: 'Configurações',
};

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [activeWidgets, setActiveWidgets] = useState<string[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1000);

  const generateWidgetId = (type: WidgetType): string => {
    return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const openWidget = (type: WidgetType) => {
    const existingWidget = widgets.find(
      (w) => w.type === type && !w.isMinimized
    );

    if (existingWidget) {
      bringToFront(existingWidget.id);
      return;
    }

    const id = generateWidgetId(type);
    const defaultSize = defaultWidgetSizes[type];

    const offset = widgets.length * 30;
    const position: Position = {
      x: 100 + offset,
      y: 100 + offset,
    };

    const newWidget: Widget = {
      id,
      type,
      title: widgetTitles[type],
      position,
      size: defaultSize,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
    };

    setWidgets((prev) => [...prev, newWidget]);
    setActiveWidgets((prev) => [...prev, id]);
    setNextZIndex((prev) => prev + 1);
  };

  const closeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    setActiveWidgets((prev) => prev.filter((wId) => wId !== id));
  };

  const minimizeWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    setActiveWidgets((prev) => prev.filter((wId) => wId !== id));
  };

  const maximizeWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              isMaximized: !w.isMaximized,
              isMinimized: false,
            }
          : w
      )
    );

    if (!activeWidgets.includes(id)) {
      setActiveWidgets((prev) => [...prev, id]);
    }

    bringToFront(id);
  };

  const updateWidgetPosition = (id: string, position: Position) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position } : w))
    );
  };

  const updateWidgetSize = (id: string, size: Size) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, size } : w)));
  };

  const bringToFront = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex } : w))
    );
    setNextZIndex((prev) => prev + 1);
  };

  const value = {
    widgets,
    activeWidgets,
    openWidget,
    closeWidget,
    minimizeWidget,
    maximizeWidget,
    updateWidgetPosition,
    updateWidgetSize,
    bringToFront,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}
