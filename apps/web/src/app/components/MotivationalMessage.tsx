import { useEffect, useState } from 'react';

export function MotivationalMessage() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    fetch('https://api.quotable.io/random?tags=inspirational|motivation')
      .then((response) => response.json())
      .then((data) => setQuote(data.content))
      .catch((error) => console.error('Error fetching quote:', error));
  }, []);

  return (
    <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg shadow-md">
      <p className="text-green-800 dark:text-green-100 font-medium">{quote}</p>
    </div>
  );
}
