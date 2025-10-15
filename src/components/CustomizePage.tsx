import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Palette, Sparkles, Settings } from 'lucide-react';

export function CustomizePage() {
  const [customizing, setCustomizing] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('purple');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');

  const themes = [
    { id: 'purple', name: 'Purple Dream', gradient: 'from-purple-500 to-pink-500' },
    { id: 'blue', name: 'Ocean Blue', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'green', name: 'Forest Green', gradient: 'from-green-500 to-emerald-500' },
    { id: 'orange', name: 'Sunset', gradient: 'from-orange-500 to-red-500' },
  ];

  const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 pt-6">
      {!customizing ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-[70vh]"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="mb-8"
          >
            <Sparkles className="text-purple-600" size={80} />
          </motion.div>

          <h1 className="text-gray-800 mb-4 text-center">Customize Your Experience</h1>
          <p className="text-gray-600 text-center mb-8 max-w-sm">
            Personalize your learning journey with custom themes and difficulty settings
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setCustomizing(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-6 rounded-2xl shadow-lg text-lg"
            >
              <Palette className="mr-2" size={24} />
              Start Customize
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-gray-800 mb-6">Customization Settings</h1>

          {/* Theme Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="text-purple-600" size={24} />
              <h2 className="text-gray-800">Choose Theme</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => (
                <motion.button
                  key={theme.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`relative overflow-hidden rounded-xl p-4 transition-all ${
                    selectedTheme === theme.id ? 'ring-4 ring-purple-600' : ''
                  }`}
                >
                  <div className={`bg-gradient-to-br ${theme.gradient} rounded-lg h-20 mb-2`} />
                  <p className="text-sm text-gray-700">{theme.name}</p>
                  {selectedTheme === theme.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1"
                    >
                      <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                        ✓
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="text-purple-600" size={24} />
              <h2 className="text-gray-800">Difficulty Level</h2>
            </div>
            <div className="space-y-2">
              {difficulties.map((difficulty) => (
                <motion.button
                  key={difficulty}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDifficulty(difficulty.toLowerCase())}
                  className={`w-full p-4 rounded-xl transition-all ${
                    selectedDifficulty === difficulty.toLowerCase()
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {difficulty}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-gray-800 mb-4">Additional Settings</h2>
            <div className="space-y-4">
              <ToggleOption label="Sound Effects" enabled={true} />
              <ToggleOption label="Haptic Feedback" enabled={true} />
              <ToggleOption label="Auto-Progress" enabled={false} />
            </div>
          </div>

          {/* Save Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => setCustomizing(false)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 py-6 rounded-2xl shadow-lg"
            >
              Save Changes
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function ToggleOption({ label, enabled }: { label: string; enabled: boolean }) {
  const [isEnabled, setIsEnabled] = useState(enabled);

  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700">{label}</span>
      <motion.button
        onClick={() => setIsEnabled(!isEnabled)}
        className={`w-14 h-8 rounded-full transition-colors ${
          isEnabled ? 'bg-purple-600' : 'bg-gray-300'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ x: isEnabled ? 24 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-6 h-6 bg-white rounded-full mt-1"
        />
      </motion.button>
    </div>
  );
}
