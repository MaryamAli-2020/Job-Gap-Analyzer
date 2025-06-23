import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AppHeaderProps = {
  onReset: () => void;
};

export function AppHeader({ onReset }: AppHeaderProps) {
  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
            <Briefcase className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-bold text-primary-foreground tracking-tight">
              Career Compass
            </h1>
          </div>
          <Button variant="ghost" onClick={onReset}>Upload New Resume</Button>
        </div>
      </div>
    </header>
  );
}
