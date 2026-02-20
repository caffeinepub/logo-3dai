/**
 * Panel for inserting 3D scene elements
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Box, Circle, Cylinder as CylinderIcon, Square, Trash2 } from 'lucide-react';
import { ElementType, SceneElement } from '../hooks/useSceneElements';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ElementInserterProps {
  elements: SceneElement[];
  selectedElementId: string | null;
  onAddElement: (type: ElementType) => void;
  onSelectElement: (id: string) => void;
  onRemoveElement: (id: string) => void;
}

export default function ElementInserter({
  elements,
  selectedElementId,
  onAddElement,
  onSelectElement,
  onRemoveElement,
}: ElementInserterProps) {
  const elementTypes: { type: ElementType; icon: any; label: string }[] = [
    { type: 'cube', icon: Box, label: 'Cube' },
    { type: 'sphere', icon: Circle, label: 'Sphere' },
    { type: 'cylinder', icon: CylinderIcon, label: 'Cylinder' },
    { type: 'plane', icon: Square, label: 'Plane' },
  ];

  return (
    <Card className="shadow-soft border-2 border-border">
      <CardHeader className="bg-gradient-to-r from-teal-400/10 to-purple-400/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
            <Box className="w-5 h-5 text-white" />
          </div>
          Scene Elements
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Add 3D shapes to your scene
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Element Type Selector */}
        <div className="grid grid-cols-2 gap-2">
          {elementTypes.map(({ type, icon: Icon, label }) => (
            <Button
              key={type}
              onClick={() => onAddElement(type)}
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:bg-teal-500/10 hover:border-teal-500"
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          ))}
        </div>

        {/* Elements List */}
        {elements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Added Elements</h4>
            <ScrollArea className="h-48 rounded-lg border border-border p-2">
              <div className="space-y-2">
                {elements.map((element) => {
                  const elementType = elementTypes.find((t) => t.type === element.type);
                  const Icon = elementType?.icon || Box;
                  
                  return (
                    <div
                      key={element.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedElementId === element.id
                          ? 'bg-teal-500/20 border-2 border-teal-500'
                          : 'bg-muted/50 hover:bg-muted border-2 border-transparent'
                      }`}
                      onClick={() => onSelectElement(element.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: element.color + '40' }}
                        >
                          <Icon className="w-4 h-4" style={{ color: element.color }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground capitalize">
                            {element.type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {element.material}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveElement(element.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
