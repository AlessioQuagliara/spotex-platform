// Libreria React per le rotte
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Import di Componenti grafici
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
// Import dei componenti delle pagine
import { Layout } from './components/Layout';
// Import delle pagine 
import Home from './pages/Home';
import ChiSiamo from './pages/ChiSiamo';
import Contatti from './pages/Contatti';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignIn from './pages/SignIn';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';

import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<ChiSiamo />} />
          <Route path="/contact" element={<Contatti />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
        </Route>
          <Route path="/NotFound" element={<NotFound />} />
          <Route path="/ServerError" element={<ServerError />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
