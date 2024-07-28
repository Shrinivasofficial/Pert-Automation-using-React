import React from 'react';

export const Navbar = () => {
  const [showMenu, setShowMenu] = React.useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div>
      <nav className='border-gray-200'>
        <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-6'>
          <a href='/' className='flex items-center space-x-3 rtl:space-x-reverse'>
            <h3 className='text-2xl font-semibold'>Project Scheduler</h3>
          </a>
          <button
            data-collapse-toggle="navbar-default"
            type='button'
            className={`inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-gray-200 ${showMenu ? 'active' : ''}`}
            aria-controls='navbar-default'
            aria-expanded={showMenu}
            onClick={toggleMenu}
          >
            <span className='sr-only'>Open Main Menu</span>
            <svg
              className='w-5 h-5'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 17 14'
            >
              <path
                stroke='black'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M1 1h15M1 7h15M1 13h15'
              ></path>
            </svg>
          </button>
          <div
            className={`w-full md:block md:w-auto ${showMenu ? 'block' : 'hidden'}`}
            id='navbar-default'
          >
            <ul className='font-medium flex flex-col p-6 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white'>
              <li>
                <a
                  href='/'
                  className='block py-2 px-3 text-white bg-blue-400 rounded-lg md:bg-transparent md:text-blue-700 md:p-0'
                  onClick={() => setShowMenu(false)}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href='/pert'
                  className='block py-2 px-3 text-white bg-blue-400 rounded-lg md:bg-transparent md:text-black md:p-0'
                  onClick={() => setShowMenu(false)}
                >
                  PERT
                </a>
              </li>
              <li>
                <a
                  href='/cpm'
                  className='block py-2 px-3 text-white bg-blue-400 rounded-lg md:bg-transparent md:text-black md:p-0'
                  onClick={() => setShowMenu(false)}
                >
                  CPM
                </a>
              </li>
              <li>
                <a
                  href='/contact'
                  className='block py-2 px-3 text-white bg-blue-400 rounded-lg md:bg-transparent md:text-black md:p-0'
                  onClick={() => setShowMenu(false)}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
