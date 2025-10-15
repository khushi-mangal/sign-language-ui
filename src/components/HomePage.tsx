import { useState } from 'react';
import { Menu, Search, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Dialog, DialogContent } from './ui/dialog';
import avatarImage from 'figma:asset/bd4fd731d6d5a262af7a1d2fbf698bacb417ea97.png';

export function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState('');

  const videos = [
    { id: 1, title: 'Learn A-Z', thumbnail: 'sign language alphabet', duration: '5:30' },
    { id: 2, title: 'Basic Greetings', thumbnail: 'greeting gestures', duration: '3:45' },
    { id: 3, title: 'Numbers 1-10', thumbnail: 'hand counting', duration: '4:20' },
    { id: 4, title: 'Common Phrases', thumbnail: 'communication hands', duration: '6:15' },
  ];

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 pb-4">
      {/* Header */}
      <div className="pt-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          {/* Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            <Menu className="text-gray-700" size={28} />
          </motion.button>

          {/* Right Side: Status, Search, Avatar */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="flex flex-col items-end gap-1">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOnline(!isOnline)}
                  className="cursor-pointer"
                >
                  {isOnline ? (
                    <Check className="text-green-500" size={16} />
                  ) : (
                    <X className="text-red-500" size={16} />
                  )}
                </motion.div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md hover:shadow-lg transition-shadow"
                >
                  <Search size={18} className="text-purple-600" />
                  <span className="text-sm text-gray-600">Search</span>
                </motion.button>
              </div>

              {/* Avatar */}
              <Avatar className="w-12 h-12 border-2 border-purple-300 shadow-md">
                <AvatarImage src={avatarImage} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-6 shadow-lg mb-6"
      >
        <h2 className="text-gray-800 mb-4">Your Progress</h2>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <StatCard label="Level" value={selectedLevel} color="bg-purple-500" />
          <StatCard label="Customize" value="3" color="bg-blue-500" />
          <StatCard label="Accuracy" value="87%" color="bg-green-500" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Overall Progress</span>
            <span>Level {selectedLevel}/5</span>
          </div>
          <Progress value={selectedLevel * 20} className="h-2" />
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            className="w-full h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl shadow-lg"
            onClick={() => window.location.href = '#train'}
          >
            Start Training
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            className="w-full h-16 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-2xl shadow-lg"
          >
            Customize
          </Button>
        </motion.div>
      </div>

      {/* Level Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6"
      >
        <h3 className="text-gray-800 mb-4">Select Level</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <motion.button
              key={level}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedLevel(level)}
              className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                selectedLevel === level
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg scale-110'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{level}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Video Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-gray-800 mb-4">Learning Videos</h3>
        <div className="space-y-4">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedVideo(video.title);
                setVideoOpen(true);
              }}
              className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-4 p-4">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-4xl">🤟</span>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-gray-800 mb-1">{video.title}</h4>
                  <p className="text-sm text-gray-500">{video.duration}</p>
                  <div className="mt-2">
                    <span className="inline-block bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full">
                      Level {Math.ceil(video.id / 2)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Instructions for adding videos */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>To add your own videos:</strong><br/>
            1. Place your video files in <code className="bg-white px-1 rounded">/public</code> folder<br/>
            2. Reference them like: <code className="bg-white px-1 rounded">/your-video.mp4</code><br/>
            3. Update the video src in the VideoDialog component
          </p>
        </div>
      </motion.div>

      {/* Menu Sheet */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[280px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <MenuItem icon="🏠" label="Home" />
            <MenuItem icon="📊" label="Progress" />
            <MenuItem icon="⚙️" label="Settings" />
            <MenuItem icon="ℹ️" label="About" />
            <MenuItem icon="📧" label="Contact" />
          </div>
        </SheetContent>
      </Sheet>

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-md">
          <div className="p-4">
            <h3 className="text-gray-800 mb-4">Search Lessons</h3>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Type to search..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            <div className="mt-4 text-sm text-gray-500">
              {searchText ? `Searching for "${searchText}"...` : 'Start typing to search'}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-md">
          <div className="p-4">
            <h3 className="text-gray-800 mb-4">{selectedVideo}</h3>
            <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">▶️</div>
                <p className="text-sm">Video Player</p>
                <p className="text-xs text-gray-400 mt-2">
                  Add your video file path here:<br/>
                  <code className="bg-gray-800 px-2 py-1 rounded mt-1 inline-block">
                    src="/your-video.mp4"
                  </code>
                </p>
              </div>
              {/* 
                To add real video:
                <video controls className="w-full rounded-xl">
                  <source src="/your-video.mp4" type="video/mp4" />
                </video>
              */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${color} rounded-2xl p-4 text-white shadow-md`}
    >
      <div className="text-2xl mb-1">{value}</div>
      <div className="text-xs opacity-90">{label}</div>
    </motion.div>
  );
}

function MenuItem({ icon, label }: { icon: string; label: string }) {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-gray-700">{label}</span>
    </motion.div>
  );
}
