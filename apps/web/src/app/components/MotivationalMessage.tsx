import { useEffect, useState } from 'react';

const fitnessQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "Take care of your body. It's the only place you have to live. - Jim Rohn",
  'The difference between try and triumph is just a little umph!',
  'Strength does not come from physical capacity. It comes from an indomitable will. - Mahatma Gandhi',
  'The hardest lift of all is lifting your butt off the couch.',
  'Your health is an investment, not an expense.',
  'The only way to define your limits is by going beyond them. - Arthur C. Clarke',
  "Fitness is not a destination. It's a way of life.",
  'The body achieves what the mind believes.',
  "You don't have to be extreme, just consistent.",
  'Success starts with self-discipline.',
  "Respect your body. It's the only one you get.",
  "Don't wish for it, work for it.",
  'The pain you feel today will be the strength you feel tomorrow.',
];

export function MotivationalMessage() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * fitnessQuotes.length);
      return fitnessQuotes[randomIndex];
    };

    const initialQuote = getRandomQuote();
    if (initialQuote) {
      setQuote(initialQuote);
    }

    const intervalId = setInterval(() => {
      const newQuote = getRandomQuote();
      if (newQuote) {
        setQuote(newQuote);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg shadow-md">
      <p className="text-green-800 dark:text-green-100 font-medium">{quote}</p>
    </div>
  );
}
