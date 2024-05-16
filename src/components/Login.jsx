import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from './../auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Call login function from auth.js
    const success = login(username, password);
    if (success) {
      // Redirect to dashboard or any other page
      window.location.href = '/dashboard'; // Redirect to dashboard page
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="h-screen bg-cover" style={{ backgroundImage: `url('../src/assets/images/cancer-banner.jpg')` }}>
      <div className="flex justify-center items-center h-full bg-white bg-opacity-90">
        <div className='grid grid-flow-col grid-cols-2'>
          <div className="h-screen bg-contain bg-no-repeat bg-center w-full shadow-lg" style={{ backgroundImage: `url('../src/assets/images/cancer-banner.jpg')` }}>
          </div>
          <div className="text-center mx-auto flex flex-col justify-center my-auto p-16">
            <Link to="/" className="text-3xl font-bold mb-4">Cancer Burden Analysis in Germany <br/>(2008-2019): Insights</Link>
            <h3 className="text-xl font-bold mb-8 my-3">Insights into Disability-Adjusted Life Years (DALYs)"</h3>
            <h2 className="text-3xl font-semibold mb-4 mt-8">Login</h2>
            <div className='flex flex-row justify-center'>
            <input className="w-64 py-2 px-4 mx-2 mb-4 rounded border" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className="w-64 py-2 px-4 mx-2 mb-4 rounded border" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            
            
            </div>
            {error && <p className="text-purple-500 mb-4">{error}</p>}
            <button className="bg-purple-500 w-auto my-3 mx-auto hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg" onClick={handleLogin}>Login</button>
            <div className=' border-purple-800 bg-purple-300 rounded-lg p-3'>
              <h3>Username: admin</h3>
              <h3>Password: password</h3>
            </div>
          </div>

        </div>



      </div>
    </div>
  );
};

export default Login;
