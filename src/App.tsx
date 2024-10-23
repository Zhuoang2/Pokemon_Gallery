import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ListView from './components/ListView';
import GalleryView from './components/GalleryView';
import DetailView from './components/DetailView';

const App: React.FC = () => {
  return (
    // <Routes basename = {process.env.PUBLIC_URL}>
    <Routes>
      <Route path="/" element={<ListView />} />
      <Route path="/gallery" element={<GalleryView />} />
      <Route path="/pokemon/:name" element={<DetailView />} />
    </Routes>
    // </Routes>
  );
};

export default App;

