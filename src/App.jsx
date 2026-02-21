import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CharacterProvider } from './context/CharacterContext';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Processing from './pages/Processing';
import Results from './pages/Results';
import Practice from './pages/Practice';

export default function App() {
  return (
    <CharacterProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/processing" element={<Processing />} />
        <Route path="/results" element={<Results />} />
        <Route path="/practice" element={<Practice />} />
        </Routes>
      </BrowserRouter>
    </CharacterProvider>
  );
}
