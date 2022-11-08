import React from 'react';
import DateController from './DateHandler/DateController';

function App(props) {
  return (
    <div className="App">
      <header className="header-content">
        header
      </header>
      <main className='main-content'>
        <DateController />
      </main>
      <footer className='footer-content'>
        footer
      </footer>
    </div>
  );
}

export default App;