import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Box, Layers } from 'lucide-react';
import { WorkflowMode } from '../App';

interface WorkflowSelectorProps {
  onSelectWorkflow: (mode: WorkflowMode) => void;
}

export default function WorkflowSelector({ onSelectWorkflow }: WorkflowSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] gap-8 p-8">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-coral-500 to-purple-500 bg-clip-text text-transparent">
          Choose Your Animation Style
        </h1>
        <p className="text-lg text-muted-foreground">
          Select the type of logo animation you want to create
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* 2D Workflow Card */}
        <Card 
          className="group cursor-pointer transition-all hover:scale-105 hover:shadow-soft-xl border-2 hover:border-coral-500"
          onClick={() => onSelectWorkflow('2D')}
        >
          <CardHeader className="bg-gradient-to-br from-coral-400/10 to-coral-500/5 rounded-t-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-coral-500/20 to-coral-600/10 flex items-center justify-center overflow-hidden">
                <img 
                  src="/assets/generated/2d-workflow-icon.dim_200x200.png" 
                  alt="2D Animation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Layers className="w-6 h-6 text-coral-500" />
              2D Logo Animation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <CardDescription className="text-base text-center">
              Perfect for flat, graphic-focused animations with smooth transitions and 2D effects
            </CardDescription>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-coral-500 font-bold">•</span>
                <span>Flat plane rendering with Z-axis rotation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-coral-500 font-bold">•</span>
                <span>Slide transitions and fade effects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-coral-500 font-bold">•</span>
                <span>2D position and scale controls</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-coral-500 font-bold">•</span>
                <span>Optimized for logo reveals and intros</span>
              </li>
            </ul>
            <Button 
              className="w-full rounded-full bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-semibold"
              size="lg"
            >
              Create 2D Animation
            </Button>
          </CardContent>
        </Card>

        {/* 3D Workflow Card */}
        <Card 
          className="group cursor-pointer transition-all hover:scale-105 hover:shadow-soft-xl border-2 hover:border-teal-500"
          onClick={() => onSelectWorkflow('3D')}
        >
          <CardHeader className="bg-gradient-to-br from-teal-400/10 to-teal-500/5 rounded-t-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-teal-500/20 to-teal-600/10 flex items-center justify-center overflow-hidden">
                <img 
                  src="/assets/generated/3d-workflow-icon.dim_200x200.png" 
                  alt="3D Animation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Box className="w-6 h-6 text-teal-500" />
              3D Logo Animation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <CardDescription className="text-base text-center">
              Full 3D capabilities with camera movements, depth effects, and spatial animations
            </CardDescription>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold">•</span>
                <span>Full 3D transformations and rotations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold">•</span>
                <span>Camera animation with presets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold">•</span>
                <span>Add 3D scene elements and depth effects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold">•</span>
                <span>Advanced lighting and shadows</span>
              </li>
            </ul>
            <Button 
              className="w-full rounded-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold"
              size="lg"
            >
              Create 3D Animation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
