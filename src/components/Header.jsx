import React from 'react';

export default function Header({ headerButtonAction, user }) {
  const displayText = user 
    ? `Sign out`
    : `Sign in`;

  function handleClick(e) {
    e.preventDefault();

    headerButtonAction();
  }

  return (
    <div>
      <h3>Saved Items</h3>

      {user &&
        <p>Welcome, ${user.displayName}</p>
      }

      <button onClick={handleClick}>{displayText}</button>

    </div>
  );
}