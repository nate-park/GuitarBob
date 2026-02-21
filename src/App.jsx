import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CharacterProvider } from './context/CharacterContext';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Processing from './pages/Processing';
import Results from './pages/Results';
import Practice from './pages/Practice';
import Visualizer from './pages/Visualizer';
import Chords from './pages/Chords';
import CharacterShop from './pages/CharacterShop';
import Tuner from './pages/Tuner';

export default function App() {
  return (
    <CharacterProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<CharacterShop />} />
          <Route path="/tuner" element={<Tuner />} />
          <Route path="/chords" element={<Chords />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/results" element={<Results />} />
          <Route path="/practice" element={<Visualizer />} />
          <Route path="/visualizer" element={<Practice />} />
        </Routes>
      </BrowserRouter>
    </CharacterProvider>
  );
}
