import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dashboard } from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { AppProvider } from "@/contexts/AppContext";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GamepadIcon, Zap, LogIn } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <GamepadIcon className="h-12 w-12 text-primary" />
                <Zap className="h-6 w-6 text-accent absolute -top-1 -right-1" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">LoL Automation</h1>
            <p className="text-muted-foreground mb-6">
              Automate your League of Legends replays and YouTube uploads
            </p>
            <Button onClick={() => navigate('/auth')} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <Dashboard />;
};

export default Index;
