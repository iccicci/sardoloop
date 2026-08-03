import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { Home } from "./Home";
import { Reworked } from "./Reworked";
import { Sardoloop } from "./Sardoloop";

const SlashGuard = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();

  return pathname !== "/" && pathname.endsWith("/") ? <Navigate to={pathname.replace(/\/+$/, "")} replace /> : <>{children}</>;
};

const App = () => <BrowserRouter>
  <SlashGuard>
    <Routes>
      {/*
      <Route caseSensitive path="/privacy" element={<PrivacyPolicy />} />
      */}
      <Route caseSensitive path="/it" element={<Home lang="it" />} />
      <Route caseSensitive path="/en" element={<Home lang="en" />} />
      <Route caseSensitive path="/it/rielaborato" element={<Reworked lang="it" />} />
      <Route caseSensitive path="/en/reworked" element={<Reworked lang="en" />} />
      <Route caseSensitive path="/it/originale" element={<Sardoloop lang="it" />} />
      <Route caseSensitive path="/en/original" element={<Sardoloop lang="en" />} />
      <Route path="/en/*" element={<Navigate to="/en/original" replace />} />
      <Route path="/*" element={<Navigate to="/it/originale" replace />} />
    </Routes>
  </SlashGuard>
</BrowserRouter>;

export default App;
