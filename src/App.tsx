import { Navigate, Route, HashRouter, Routes } from 'react-router-dom';
import { AppProvider } from './state/AppContext';
import { ThemeProvider } from './state/ThemeContext';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import SurveyQ1 from './pages/auth/SurveyQ1';
import SurveyQ2 from './pages/auth/SurveyQ2';
import SurveyQ3 from './pages/auth/SurveyQ3';
import SurveyQ4 from './pages/auth/SurveyQ4';
import SurveyQ5 from './pages/auth/SurveyQ5';
import Done from './pages/auth/Done';
import MainLayout from './pages/main/MainLayout';
import Dashboard from './pages/main/Dashboard';
import Report from './pages/main/Report';
import Portfolio from './pages/main/Portfolio';
import Trade from './pages/main/Trade';
import Assets from './pages/main/Assets';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/survey/1" element={<SurveyQ1 />} />
            <Route path="/survey/2" element={<SurveyQ2 />} />
            <Route path="/survey/3" element={<SurveyQ3 />} />
            <Route path="/survey/4" element={<SurveyQ4 />} />
            <Route path="/survey/5" element={<SurveyQ5 />} />
            <Route path="/done" element={<Done />} />

            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/report" element={<Report />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/trade" element={<Trade />} />
              <Route path="/assets" element={<Assets />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </HashRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
