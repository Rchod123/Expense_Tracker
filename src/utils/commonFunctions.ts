export const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return {
      greeting: 'Good Morning',
      emoji: ' 🌅',
    };
  }

  if (hour >= 12 && hour < 17) {
    return {
      greeting: 'Good Afternoon',
      emoji: ' ☀️',
    };
  }

  if (hour >= 17 && hour < 21) {
    return {
      greeting: 'Good Evening',
      emoji: ' 🌇',
    };
  }

  return {
    greeting: 'Good Night',
    emoji: ' 🌙',
  };
};