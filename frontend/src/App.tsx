import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

import Dashboard from "./pages/Dashboard";
import NewCase from "./pages/NewCase";
import SearchPatient from "./pages/SearchPatient";
import HistoryPage from "./pages/HistoryPage";
// import CaseHistory from "./pages/CaseHistory";
// import Dilemmas from "./pages/Dilemmas";
// import Analytics from "./pages/Analytics";
// import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cases/new" element={<NewCase />} />
          <Route path="/search" element={<SearchPatient />} />
          <Route path="/history" element={<HistoryPage />} />
          {/* <Route path="/dilemmas" element={<Dilemmas />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/about" element={<About />} />  */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
