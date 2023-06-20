import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppContext from './components/AppContext';
import NavBar from './components/NavBar';
import Auth from './pages/AuthPage';
import Home from './pages/HomePage';
import NotFound from './pages/NotFoundPage';
import './App.css';
import Services from './pages/ServicesPage';
import ServicesForm from './pages/ServicesFormPage';

const tokenKey = 'react-context-jwt';

export default function App() {
  const [serverData, setServerData] = useState('');
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [isAuthorizing, setIsAuthorizing] = useState(true);

  useEffect(() => {
    // async function readServerData() {
    //   const resp = await fetch('/api/hello');
    //   const data = await resp.json();

    //   console.log('Data from server:', data);

    //   setServerData(data.message);
    // }

    // readServerData();

    // If user logged in previously on this browser, authorize them
    const auth = localStorage.getItem(tokenKey);
    if (auth) {
      const a = JSON.parse(auth);
      setUser(a.user);
      setToken(a.token);
    }
    setIsAuthorizing(false);
  }, []);

  if (isAuthorizing) return null;

  function handleSignIn(auth) {
    localStorage.setItem(tokenKey, JSON.stringify(auth));
    setUser(auth.user);
    setToken(auth.token);
  }

  function handleSignOut() {
    localStorage.removeItem(tokenKey);
    setUser(undefined);
    setToken(undefined);
  }

  const contextValue = { user, token, handleSignIn, handleSignOut };

  return (
    <div className="App">
      <AppContext.Provider value={contextValue}>
        <Routes>
          <Route path="/" element={<NavBar />}>
            <Route index element={<Home />} />
            <Route path="sign-in" element={<Auth action="sign-in" />} />
            <Route path="sign-up" element={<Auth action="sign-up" />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/services" element={<Services />} />
            <Route path="/servicesform" element={<ServicesForm />} />
          </Route>
          {/* <Route path="/favorites" /> */}
        </Routes>
      </AppContext.Provider>
    </div>
  );
}
