import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TourStep = {
  title: string;
  content: string;
  target: string;
};

const OnboardingTour: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: TourStep[] = [
    {
      title: "Welcome to Gödel Terminal",
      content: "Let's learn markets through play!",
      target: "#main-terminal"
    },
    {
      title: "Your First Trade",
      content: "Try buying some stocks to begin",
      target: "#trade-button"
    }
  ];

  return (
    <AnimatePresence>
      {steps.map((step, index) => (
        currentStep === index && (
          <motion.div 
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="tour-step"
          >
            <h3>{step.title}</h3>
            <p>{step.content}</p>
            <button onClick={() => setCurrentStep(prev => (prev + 1) % steps.length)}>
              {index === steps.length - 1 ? "Finish" : "Next"}
            </button>
          </motion.div>
        )
      ))}
    </AnimatePresence>
  );
};

export default OnboardingTour;
