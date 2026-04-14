import React, { useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import './Admin.css';

export default function Admin() {
  const { booked, almostBooked, free, addDate, removeDate } = useCalendar();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [newDateBooked, setNewDateBooked] = useState('');
  const [newDateAlmost, setNewDateAlmost] = useState('');
  const [newDateFree, setNewDateFree] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === 'admin' && pass === 'admin1234') setLoggedIn(true);
    else alert('Invalid credentials');
  };

  if (!loggedIn)
    return (
      <div className="admin-wrapper">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} className="admin-login">
          <label>
            Username
            <input value={user} onChange={(e) => setUser(e.target.value)} />
          </label>
          <label>
            Password
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
          </label>
          <button type="submit">Login</button>
        </form>
      </div>
    );

  return (
    <div className="admin-wrapper">
      <h2>Calendar Admin</h2>
      <div className="admin-section">
        <div className="admin-col">
          <h3>Booked Dates</h3>
          <ul>
            {booked.map((d) => (
              <li key={d}>
                {d} <button onClick={() => removeDate('booked', d)}>Remove</button>
              </li>
            ))}
          </ul>
          <input type="date" value={newDateBooked} onChange={(e) => setNewDateBooked(e.target.value)} />
          <button onClick={() => { addDate('booked', newDateBooked); setNewDateBooked(''); }}>Add</button>
        </div>

        <div className="admin-col">
          <h3>Almost Booked</h3>
          <ul>
            {almostBooked.map((d) => (
              <li key={d}>
                {d} <button onClick={() => removeDate('almost', d)}>Remove</button>
              </li>
            ))}
          </ul>
          <input type="date" value={newDateAlmost} onChange={(e) => setNewDateAlmost(e.target.value)} />
          <button onClick={() => { addDate('almost', newDateAlmost); setNewDateAlmost(''); }}>Add</button>
        </div>

        <div className="admin-col">
          <h3>Free Dates</h3>
          <ul>
            {free.map((d) => (
              <li key={d}>
                {d} <button onClick={() => removeDate('free', d)}>Remove</button>
              </li>
            ))}
          </ul>
          <input type="date" value={newDateFree} onChange={(e) => setNewDateFree(e.target.value)} />
          <button onClick={() => { addDate('free', newDateFree); setNewDateFree(''); }}>Add</button>
        </div>
      </div>
    </div>
  );
}
