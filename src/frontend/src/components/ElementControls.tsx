/**
 * Properties panel for editing selected scene element
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings2 } from 'lucide-react';
import { SceneElement, MaterialType } from '../hooks/useSceneElements';

interface ElementControlsProps {
  element: SceneElement;
  onUpdate: (id: string, updates: Partial<SceneElement>) => void;
}

export default function ElementControls({ element, onUpdate }: ElementControlsProps) {
  const updatePosition = (axis: number, value: number) => {
    const newPosition: [number, number, number] = [...element.position];
    newPosition[axis] = value;
    onUpdate(element.id, { position: newPosition });
  };

  const updateScale = (axis: number, value: number) => {
    const newScale: [number, number, number] = [...element.scale];
    newScale[axis] = value;
    onUpdate(element.id, { scale: newScale });
  };

  const updateRotation = (axis: number, value: number) => {
    const newRotation: [number, number, number] = [...element.rotation];
    newRotation[axis] = value;
    onUpdate(element.id, { rotation: newRotation });
  };

  return (
    <Card className="shadow-soft border-2 border-border">
      <CardHeader className="bg-gradient-to-r from-purple-400/10 to-coral-400/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
            <Settings2 className="w-5 h-5 text-white" />
          </div>
          Element Properties
        </CardTitle>
        <CardDescription className="text-muted-foreground capitalize">
          Editing {element.type}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="transform" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted rounded-2xl p-1">
            <TabsTrigger value="transform" className="rounded-xl">Transform</TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-xl">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="transform" className="space-y-6 mt-6">
            {/* Position */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Position</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">X</Label>
                  <span className="text-sm font-medium text-purple-500">
                    {element.position[0].toFixed(1)}
                  </span>
                </div>
                <Slider
                  min={-10}
                  max={10}
                  step={0.1}
                  value={[element.position[0]]}
                  onValueChange={([value]) => updatePosition(0, value)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Y</Label>
                  <span className="text-sm font-medium text-purple-500">
                    {element.position[1].toFixed(1)}
                  </span>
                </div>
                <Slider
                  min={-10}
                  max={10}
                  step={0.1}
                  value={[element.position[1]]}
                  onValueChange={([value]) => updatePosition(1, value)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Z</Label>
                  <span className="text-sm font-medium text-purple-500">
                    {element.position[2].toFixed(1)}
                  </span>
                </div>
                <Slider
                  min={-10}
                  max={10}
                  step={0.1}
                  value={[element.position[2]]}
                  onValueChange={([value]) => updatePosition(2, value)}
                />
              </div>
            </div>

            {/* Scale */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Scale</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">X</Label>
                  <span className="text-sm font-medium text-teal-500">
                    {element.scale[0].toFixed(1)}
                  </span>
                </div>
                <Slider
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={[element.scale[0]]}
                  onValueChange={([value]) => updateScale(0, value)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Y</Label>
                  <span className="text-sm font-medium text-teal-500">
                    {element.scale[1].toFixed(1)}
                  </span>
                </div>
                <Slider
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={[element.scale[1]]}
                  onValueChange={([value]) => updateScale(1, value)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Z</Label>
                  <span className="text-sm font-medium text-teal-500">
                    {element.scale[2].toFixed(1)}
                  </span>
                </div>
                <Slider
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={[element.scale[2]]}
                  onValueChange={([value]) => updateScale(2, value)}
                />
              </div>
            </div>

            {/* Rotation */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Rotation</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">X</Label>
                  <span className="text-sm font-medium text-coral-500">
                    {Math.round((element.rotation[0] * 180) / Math.PI)}°
                  </span>
                </div>
                <Slider
                  min={0}
                  max={360}
                  step={1}
                  value={[(element.rotation[0] * 180) / Math.PI]}
                  onValueChange={([value]) => updateRotation(0, (value * Math.PI) / 180)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Y</Label>
                  <span className="text-sm font-medium text-coral-500">
                    {Math.round((element.rotation[1] * 180) / Math.PI)}°
                  </span>
                </div>
                <Slider
                  min={0}
                  max={360}
                  step={1}
                  value={[(element.rotation[1] * 180) / Math.PI]}
                  onValueChange={([value]) => updateRotation(1, (value * Math.PI) / 180)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Z</Label>
                  <span className="text-sm font-medium text-coral-500">
                    {Math.round((element.rotation[2] * 180) / Math.PI)}°
                  </span>
                </div>
                <Slider
                  min={0}
                  max={360}
                  step={1}
                  value={[(element.rotation[2] * 180) / Math.PI]}
                  onValueChange={([value]) => updateRotation(2, (value * Math.PI) / 180)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6 mt-6">
            {/* Color */}
            <div className="space-y-3">
              <Label htmlFor="element-color" className="text-sm font-semibold text-foreground">
                Color
              </Label>
              <div className="flex gap-2">
                <Input
                  id="element-color"
                  type="color"
                  value={element.color}
                  onChange={(e) => onUpdate(element.id, { color: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={element.color}
                  onChange={(e) => onUpdate(element.id, { color: e.target.value })}
                  className="flex-1"
                  placeholder="#8b5cf6"
                />
              </div>
            </div>

            {/* Material */}
            <div className="space-y-3">
              <Label htmlFor="element-material" className="text-sm font-semibold text-foreground">
                Material Type
              </Label>
              <Select
                value={element.material}
                onValueChange={(value: MaterialType) => onUpdate(element.id, { material: value })}
              >
                <SelectTrigger id="element-material">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="metallic">Metallic</SelectItem>
                  <SelectItem value="glass">Glass</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
