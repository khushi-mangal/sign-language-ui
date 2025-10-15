import { motion } from 'motion/react';
import { BookOpen, Play, Award, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';

export function LearnPage() {
  const lessons = [
    { id: 1, title: 'Sign Language Basics', icon: '📚', progress: 100, lessons: 5 },
    { id: 2, title: 'Alphabet A-Z', icon: '🔤', progress: 75, lessons: 26 },
    { id: 3, title: 'Numbers & Counting', icon: '🔢', progress: 50, lessons: 10 },
    { id: 4, title: 'Daily Conversations', icon: '💬', progress: 25, lessons: 15 },
    { id: 5, title: 'Advanced Phrases', icon: '🎯', progress: 0, lessons: 20 },
  ];

  const achievements = [
    { name: 'First Steps', icon: '🎖️', unlocked: true },
    { name: 'Quick Learner', icon: '⚡', unlocked: true },
    { name: 'Master', icon: '👑', unlocked: false },
  ];

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 pt-6 pb-6">
      <h1 className="text-gray-800 mb-6">Learning Center</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard icon={<BookOpen size={20} />} label="Lessons" value="12" color="bg-blue-500" />
        <StatCard icon={<Award size={20} />} label="Badges" value="5" color="bg-yellow-500" />
        <StatCard icon={<TrendingUp size={20} />} label="Streak" value="7d" color="bg-green-500" />
      </div>

      {/* Lessons */}
      <div className="mb-6">
        <h2 className="text-gray-800 mb-4">Your Lessons</h2>
        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {lesson.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-800 mb-1">{lesson.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{lesson.lessons} lessons</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${lesson.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                    />
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 rounded-xl"
                >
                  <Play size={16} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-gray-800 mb-4">Achievements</h2>
        <div className="grid grid-cols-3 gap-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: achievement.unlocked ? 1.1 : 1 }}
              className={`rounded-2xl p-4 text-center ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-400 shadow-md'
                  : 'bg-gray-200'
              }`}
            >
              <div className="text-3xl mb-2 filter" style={{ filter: achievement.unlocked ? 'none' : 'grayscale(100%)' }}>
                {achievement.icon}
              </div>
              <p className={`text-xs ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                {achievement.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white"
      >
        <h3 className="mb-2">💡 Learning Tip</h3>
        <p className="text-sm opacity-90">
          Practice for just 10 minutes daily to build muscle memory and improve your signing skills!
        </p>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${color} rounded-2xl p-4 text-white shadow-md text-center`}
    >
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-xl mb-1">{value}</div>
      <div className="text-xs opacity-90">{label}</div>
    </motion.div>
  );
}
