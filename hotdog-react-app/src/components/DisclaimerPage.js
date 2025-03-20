import React from 'react';
import { Link } from 'react-router-dom';

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto text-center mt-10">
      <h1 className="text-2xl font-bold">Disclaimer</h1>
      <p className="my-4">This application uses AI to detect hot dogs. Results may vary!</p>
      <Link className="inline-block bg-blue-500 text-white py-2 px-4 rounded" to="/hotdog">Proceed to App</Link>
    </div>
  );
}