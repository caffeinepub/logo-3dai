import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Image, CheckCircle2 } from 'lucide-react';
import { useLogoUpload } from '../hooks/useLogoUpload';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromptLogoGenerator from './PromptLogoGenerator';
import { WorkflowMode } from '../App';

interface LogoUploaderProps {
  onLogoUploaded: (imageUrl: string) => void;
  workflowMode: WorkflowMode;
}

export default function LogoUploader({ onLogoUploaded, workflowMode }: LogoUploaderProps) {
  const { uploadLogo, isUploading, uploadProgress, previewUrl, error } = useLogoUpload();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = async (file: File) => {
    const url = await uploadLogo(file);
    if (url) {
      onLogoUploaded(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleGeneratedLogo = (imageUrl: string) => {
    onLogoUploaded(imageUrl);
  };

  return (
    <Card className="shadow-soft-lg border-2 border-border">
      <CardHeader className="bg-gradient-to-r from-coral-400/10 to-purple-400/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-foreground text-xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral-500 to-purple-500 flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
          Upload or Generate Your Logo
        </CardTitle>
        <CardDescription className="text-muted-foreground text-base">
          Upload an existing logo or generate one with AI for your {workflowMode} animation
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-8">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted rounded-2xl p-1 mb-6">
            <TabsTrigger value="upload" className="rounded-xl">Upload Logo</TabsTrigger>
            <TabsTrigger value="generate" className="rounded-xl">Generate with AI</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            {!previewUrl ? (
              <div
                className={`border-4 border-dashed rounded-3xl p-12 text-center transition-all ${
                  isDragging
                    ? 'border-coral-500 bg-coral-500/10 scale-105'
                    : 'border-border hover:border-coral-300 hover:bg-coral-500/5'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-6">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-coral-500/20 to-purple-500/20 flex items-center justify-center">
                    <Image className="w-12 h-12 text-coral-500" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground mb-2">
                      Drag and drop your logo here
                    </p>
                    <p className="text-sm text-muted-foreground">or</p>
                  </div>
                  <Button
                    onClick={() => document.getElementById('file-input')?.click()}
                    disabled={isUploading}
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-coral-500 to-purple-500 hover:from-coral-600 hover:to-purple-600 text-white font-semibold px-8"
                  >
                    Browse Files
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports PNG, JPG, and SVG (max 10MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-6 bg-muted/50 rounded-2xl">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white flex items-center justify-center">
                    <img src={previewUrl} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Logo uploaded successfully!</p>
                    <p className="text-sm text-muted-foreground">Ready to animate</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
              </div>
            )}

            {isUploading && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="font-semibold text-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="generate">
            <PromptLogoGenerator 
              onLogoGenerated={handleGeneratedLogo}
              workflowMode={workflowMode}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
