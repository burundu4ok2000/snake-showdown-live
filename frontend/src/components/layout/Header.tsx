import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Gamepad2, Trophy, Users, LogIn, LogOut, User, BookOpen, Sword } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { LanguageSelector } from '@/components/ui/LanguageSelector';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="glass sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity">
          <Gamepad2 className="w-6 h-6" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Snake Arena</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" asChild>
            <Link to="/" className="gap-2">
              <Gamepad2 className="w-4 h-4" />
              {t('nav.home')}
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/leaderboard" className="gap-2">
              <Trophy className="w-4 h-4" />
              {t('nav.leaderboard')}
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/how-to-play" className="gap-2">
              <BookOpen className="w-4 h-4" />
              {t('nav.howToPlay')}
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/rpg" className="gap-2">
              <Sword className="w-4 h-4" />
              RPG Mode
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/spectate" className="gap-2">
              <Users className="w-4 h-4" />
              {t('nav.spectate')}
            </Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          <SoundToggle />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 border-white/10 bg-white/5 hover:bg-white/10">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-primary" />
                  </div>
                  {user?.username}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-white/10">
                <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-primary/20" onClick={() => navigate('/profile')}>
                  <User className="w-4 h-4" />
                  {t('nav.profile')}
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-primary/20" asChild>
                  <Link to="/leaderboard">
                    <Trophy className="w-4 h-4" />
                    {t('nav.myScores')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="gap-2 text-destructive cursor-pointer focus:bg-destructive/10" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Link to="/auth" className="gap-2">
                <LogIn className="w-4 h-4" />
                {t('nav.signIn')}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
