import { useState } from 'react';
import { Home, GraduationCap, Palette, BookOpen } from 'lucide-react';
import { HomePage } from './components/HomePage';
import { TrainPage } from './components/TrainPage';
import { CustomizePage } from './components/CustomizePage';
import { LearnPage } from './components/LearnPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 pb-20">
      {/* Main Content */}
      <div className="h-full">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'train' && <TrainPage />}
        {activeTab === 'customize' && <CustomizePage />}
        {activeTab === 'learn' && <LearnPage />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <NavItem
            icon={<Home size={24} />}
            label="HOME"
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <NavItem
            icon={<GraduationCap size={24} />}
            label="TRAIN"
            active={activeTab === 'train'}
            onClick={() => setActiveTab('train')}
          />
          <NavItem
            icon={<Palette size={24} />}
            label="CUSTOMIZE"
            active={activeTab === 'customize'}
            onClick={() => setActiveTab('customize')}
          />
          <NavItem
            icon={<BookOpen size={24} />}
            label="LEARN"
            active={activeTab === 'learn'}
            onClick={() => setActiveTab('learn')}
          />
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all ${
        active ? 'text-purple-600' : 'text-gray-400'
      }`}
    >
      <div className={`transition-transform ${active ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </button>
  );
}
