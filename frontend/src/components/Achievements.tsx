import { motion } from 'framer-motion';

export default function BadgeSystem() {
  const badges = [
    { id: 1, name: 'Market Analyst', earned: true },
    { id: 2, name: 'Risk Manager', earned: false },
    { id: 3, name: 'First Trade', earned: true },
    { id: 4, name: 'Portfolio Builder', earned: false },
    { id: 5, name: 'Data Explorer', earned: true }
  ];

  return (
    <motion.div 
      className="badge-wall"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h3>Your Achievements</h3>
      <div className="badge-grid">
        {badges.map(badge => (
          <motion.div
            key={badge.id}
            className={`badge ${badge.earned ? '' : 'locked'}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            {badge.name}
            {!badge.earned && <div className="lock">Locked</div>}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
