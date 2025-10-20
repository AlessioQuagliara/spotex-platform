// Libreria React per le rotte

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import dei componenti delle pagine

import { Layout } from './components/Layout';

// Import delle pagine 

import Home from './pages/Home';
import ChiSiamo from './pages/ChiSiamo';
import LavoraConNoi from './pages/LavoraConNoi';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';

// Import degli stili

import './App.css'

// Funzione principale dell'applicazione

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<ChiSiamo />} />
          <Route path="/work-with-us" element={<LavoraConNoi />} />
          <Route path="/landing" element={<Landing />} />
        </Route>
          <Route path="/*" element={<NotFound />} />
          <Route path="/server-error" element={<ServerError />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
