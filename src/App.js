import React from 'react'
import { Navbar } from './Components/Navbar';
import { Hero } from './Components/Hero';
import { Footer } from './Components/Footer';
import { BrowserRouter,Routes, Route } from 'react-router-dom';

import Pert from './Components/Pert';

export const App = () => {
  return (
    
    <div class="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <Navbar></Navbar>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/pert" element={<Pert />} />
        </Routes>
        </BrowserRouter>
      <Footer></Footer>
    
    </div>

  )
}

export default App;