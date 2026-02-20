/**
 * Custom hook for managing 3D scene elements
 */

import { useState, useCallback } from 'react';

export type ElementType = 'cube' | 'sphere' | 'cylinder' | 'plane';
export type MaterialType = 'standard' | 'metallic' | 'glass';

export interface SceneElement {
  id: string;
  type: ElementType;
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  color: string;
  material: MaterialType;
}

export function useSceneElements() {
  const [elements, setElements] = useState<SceneElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const addElement = useCallback((type: ElementType) => {
    const newElement: SceneElement = {
      id: `element-${Date.now()}`,
      type,
      position: [0, 0, -5],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      color: '#8b5cf6',
      material: 'standard',
    };
    
    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<SceneElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  }, []);

  const removeElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedElementId(null);
  }, []);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  return {
    elements,
    selectedElement,
    selectedElementId,
    addElement,
    updateElement,
    removeElement,
    setSelectedElementId,
  };
}
