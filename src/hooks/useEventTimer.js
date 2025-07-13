import { useState, useEffect } from 'react';

export const useEventTimer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEventActive, setIsEventActive] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState('');
  const [eventStatus, setEventStatus] = useState('waiting');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Get current day of week (0 = Sunday, 6 = Saturday)
      const dayOfWeek = now.getDay();
      const currentHour = now.getHours();
      
      // Check if it's Saturday (6) and between 18:00 and 22:00
      const isSaturday = dayOfWeek === 6;
      const isEventTime = currentHour >= 18 && currentHour < 22;
      
      const isActive = isSaturday && isEventTime;
      setIsEventActive(isActive);

      if (isActive) {
        setEventStatus('live');
        const endTime = new Date(now);
        endTime.setHours(22, 0, 0, 0);
        const timeLeft = Math.max(0, endTime - now);
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        setTimeUntilNext(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setEventStatus('ended');
        
        // Calculate time until next Saturday 18:00
        const nextSaturday = new Date(now);
        let daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
        
        // If today is Saturday but event time has passed, next Saturday is in 7 days
        if (dayOfWeek === 6 && currentHour >= 22) {
          daysUntilSaturday = 7;
        }
        
        // If today is Saturday and before 18:00, event is today
        if (dayOfWeek === 6 && currentHour < 18) {
          daysUntilSaturday = 0;
        }
        
        nextSaturday.setDate(now.getDate() + daysUntilSaturday);
        nextSaturday.setHours(18, 0, 0, 0);
        
        const timeLeft = Math.max(0, nextSaturday - now);
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        if (days > 0) {
          setTimeUntilNext(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeUntilNext(`${hours}h ${minutes}m ${seconds}s`);
        }
        
        setEventStatus(dayOfWeek === 6 && currentHour < 18 ? 'starting-soon' : 'waiting');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return {
    isEventActive,
    timeUntilNext,
    eventStatus,
    currentTime,
  };
};