import React from 'react';

export const Hero = () => {
  return (
    <div className='container mx-auto mt-14 px-4'>
      <h1 className='mb-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl'>
        Get your project scheduled with{' '}
        <span className='text-blue-600'>the World's #1 tool</span>
      </h1>
      <p className='text-lg font-normal text-gray-500 sm:text-xl'>
        Plan your projects and schedule the most important tasks with the efficient PERT and CPM tools for free.
      </p>
      <button
        type='button'
        className='mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center'
      >
        Get Started
      </button>

      <div className='container mx-auto mt-14 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
        <a
          href='/'
          className='flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
        >
         
          <div className='flex flex-col justify-between p-4 leading-normal'>
            <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
             Step 1 - Feed Your Project details.
            </h5>
            <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>
              In Step 1, the project details are collected along with the number of modules.
            </p>
          </div>
        </a>

        <a
          href='/'
          className='flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
        >
         
          <div className='flex flex-col justify-between p-4 leading-normal'>
            <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
              Step - 2 Calculation of the duration.
            </h5>
            <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>
             In Step - 2, the calculation of duration will be done using optimistic, most likely and pessimestic values.
            </p>
          </div>
        </a>

        <a
          href='/'
          className='flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
        >
         
          <div className='flex flex-col justify-between p-4 leading-normal'>
            <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
              Step - 3 Critical Path Calculation
            </h5>
            <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>
             Download the PERT Crictical Path graph.
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};
