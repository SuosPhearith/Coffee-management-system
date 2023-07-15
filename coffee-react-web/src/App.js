import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './page/login/LoginPage';
import ProductPage from './page/product/ProductPage';
import LayoutOne from './conponent/layout/LayoutOne';
import DashboardPage from './page/dashboard/DashboardPage'
import UserPage from './page/user/UserPage'
import SalePage from './page/sale/SalePage'
import ReportPage from './page/report/ReportPage';

function App() {
  const isLogin = (localStorage.getItem("isLogin") === "1")
  const loginAdmin = (localStorage.getItem("role") === "admin")
  const loginEmployee = (localStorage.getItem("role") === "employee")
  const doLoginAdmin = (isLogin && loginAdmin)
  const doLoginEmployee = (isLogin && loginEmployee)
  return (
    <BrowserRouter basename='/coffee-management-system/'>
      {doLoginAdmin && <LayoutOne>
        <Routes>
          <Route path='/' element={<DashboardPage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/sale' element={<SalePage />} />
          <Route path='/product' element={<ProductPage />} />
          <Route path='/user' element={<UserPage />} />
          <Route path='/report' element={<ReportPage />} />
          <Route path='/*' element={<Navigate to='/dashboard' />} />
        </Routes>
      </LayoutOne>}
      {doLoginEmployee && <LayoutOne>
        <Routes>
          <Route path='/*' element={<Navigate to="/sale" />} />
          <Route path='/' element={<Navigate to="/sale" />} />
          <Route path='/sale' element={<SalePage />} />
        </Routes>
      </LayoutOne>}
      {!isLogin && <Routes>
        <Route path='/*' element={<Navigate to="/login" />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>}
    </BrowserRouter>
  );
}

export default App;

