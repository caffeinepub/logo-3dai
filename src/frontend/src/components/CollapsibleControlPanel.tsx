import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CollapsibleControlPanelProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function CollapsibleControlPanel({
  title,
  defaultOpen = false,
  children,
}: CollapsibleControlPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="border-2 border-border rounded-2xl overflow-hidden transition-all duration-200 relative">
      <CardHeader className="p-0">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 rounded-none"
        >
          <span className="text-base font-semibold text-foreground">{title}</span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground transition-transform" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform" />
          )}
        </Button>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="p-4 pt-2 animate-in slide-in-from-top-2 duration-200">
          {children}
        </CardContent>
      )}
    </Card>
  );
}
