import React from 'react'

export const Footer = () => {
  return (
<div className='container mt-16 mx-auto'>


<footer className="bg-white rounded-lg">
    <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span className="text-sm text-gray-500 sm:text-center ">© 2024 <a href="/" class="hover:underline">Project Scheduler™</a>. All Rights Reserved.
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0">
        <li>
            <a href="/" className="hover:underline me-4 md:me-6">About</a>
        </li>
        <li>
            <a href="/" className="hover:underline me-4 md:me-6">Privacy Policy</a>
        </li>
        <li>
            <a href="/" className="hover:underline me-4 md:me-6">Licensing</a>
        </li>
        <li>
            <a href="/" className="hover:underline">Contact</a>
        </li>
    </ul>
    </div>
</footer>

    </div>
  )
}
