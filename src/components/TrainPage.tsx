import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export function TrainPage() {
  const [isTraining, setIsTraining] = useState(false);
  const [currentGesture, setCurrentGesture] = useState(0);

  const gestures = [
    { sign: '👋', name: 'Hello', description: 'Wave your hand' },
    { sign: '👍', name: 'Good', description: 'Thumbs up' },
    { sign: '✌️', name: 'Peace', description: 'Victory sign' },
    { sign: '🤟', name: 'I Love You', description: 'Sign language ILY' },
    { sign: '👌', name: 'OK', description: 'OK gesture' },
  ];

  const startTraining = () => {
    setIsTraining(true);
    setCurrentGesture(0);
  };

  const nextGesture = () => {
    if (currentGesture < gestures.length - 1) {
      setCurrentGesture(currentGesture + 1);
    } else {
      setIsTraining(false);
      setCurrentGesture(0);
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto px-4 pt-6">
      <h1 className="text-gray-800 mb-6">Training Mode</h1>

      <AnimatePresence mode="wait">
        {!isTraining ? (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1.1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="text-9xl mb-8"
            >
              🤟
            </motion.div>
            <h2 className="text-gray-800 mb-4 text-center">Ready to Practice?</h2>
            <p className="text-gray-600 text-center mb-8 max-w-sm">
              Follow along with sign language gestures and improve your skills
            </p>
            <Button
              onClick={startTraining}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-6 rounded-2xl shadow-lg text-lg"
            >
              Start Training Session
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="training"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="space-y-6"
          >
            {/* Progress */}
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm text-purple-600">
                  {currentGesture + 1} / {gestures.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentGesture + 1) / gestures.length) * 100}%` }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Gesture Display */}
            <motion.div
              key={currentGesture}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
                className="text-9xl text-center mb-6"
              >
                {gestures[currentGesture].sign}
              </motion.div>
              <h2 className="text-white text-center mb-2">
                {gestures[currentGesture].name}
              </h2>
              <p className="text-white/80 text-center">
                {gestures[currentGesture].description}
              </p>
            </motion.div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-gray-800 mb-4">Practice This Gesture</h3>
              <ul className="space-y-3">
                <InstructionItem text="Watch the gesture carefully" />
                <InstructionItem text="Copy the hand movement" />
                <InstructionItem text="Practice until comfortable" />
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => setIsTraining(false)}
                variant="outline"
                className="flex-1 py-6 rounded-2xl"
              >
                <ArrowLeft className="mr-2" size={20} />
                Exit
              </Button>
              <Button
                onClick={nextGesture}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 py-6 rounded-2xl"
              >
                {currentGesture < gestures.length - 1 ? 'Next' : 'Finish'}
                <CheckCircle className="ml-2" size={20} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InstructionItem({ text }: { text: string }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3"
    >
      <div className="w-2 h-2 rounded-full bg-purple-500" />
      <span className="text-gray-600">{text}</span>
    </motion.li>
  );
}
