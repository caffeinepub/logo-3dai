import { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const currentYear = new Date().getFullYear();
  
  const getAppIdentifier = () => {
    try {
      return encodeURIComponent(window.location.hostname);
    } catch {
      return 'logo-3dai';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-canva.dim_1920x1080.png)' }}
      />
      
      {/* Soft Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-coral-400/5 via-background to-purple-400/5" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b-2 border-border/50 backdrop-blur-sm bg-card/80">
          <div className="container mx-auto px-4 py-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral-500 to-purple-500 flex items-center justify-center shadow-soft">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  logo.3dai
                </h1>
                <p className="text-xs text-muted-foreground font-medium">Create stunning 3D logo animations</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t-2 border-border/50 backdrop-blur-sm bg-card/80 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>
              © {currentYear} logo.3dai. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${getAppIdentifier()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral-500 hover:text-coral-600 transition-colors font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
