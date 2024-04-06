import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Footer from "./component/footer/Footer";
import Header from "./component/header/Header";
import Login from "./component/header/login-pages/Login";
import Register from "./component/header/register/Register";
import Home from "./component/body/home-pages/Home";
import Detail from "./component/Details/Detail";
import RecoveryPassword from "./component/header/recovery-password/RecoveryPassword";
import Profile from "./component/profile/Profile";
import Payment from "./component/payment/Payment";
import { SearchList } from "./component/header/search/searchlist/SearchList";
import ChangePassword from "./component/change-password/ChangePassword";
import HomeAdmin from "./admin-page/homeadmin/HomeAdmin";
import Request from "./component/Details/request/Request";
import { CSSTransition } from "react-transition-group";
import TransactionHistory from "./component/header/transaction-history/TransactionHistory";
import SuccessPage from "./component/payment/pay-success-page/SuccessPage";

function App() {
  const location = useLocation();
  const [isLoginPage, setIsLoginPage] = useState(location.pathname === "/login");
  const [isRegisterPage, setIsRegisterPage] = useState(location.pathname === "/regis");
  const [isRecoveryPage, setIsRecoveryPage] = useState(location.pathname === "/recovery-password");
  const [isTransaction, setIsTransaction] = useState(location.pathname === "/history");
  const [showFooter, setShowFooter] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const isHomeAdmin = location.pathname.startsWith("/home-admin");

  useEffect(() => {
    setIsLoginPage(location.pathname === "/login");
    setIsRegisterPage(location.pathname === "/regis");
    setIsTransaction(location.pathname === "/history");
    setIsRecoveryPage(location.pathname === "/recovery-password");
  }, [location]);

  useEffect(() => {
    setShowFooter(
      !isLoginPage &&
      !isRegisterPage &&
      !isRecoveryPage &&
      !isTransaction &&
      !isHomeAdmin
    );
    setShowHeader(
      !isLoginPage && !isRegisterPage && !isRecoveryPage && !isHomeAdmin
    );
  }, [location, isLoginPage, isRegisterPage, isRecoveryPage, isTransaction, isHomeAdmin]);

  const [userById, setUserById] = useState([]);
  return (
    <div className="App">
      {showHeader && (
        <Header
          isLoginPage={isLoginPage}
          isRegisterPage={isRegisterPage}
          isRecoveryPage={isRecoveryPage}
          isHomeAdmin={isHomeAdmin}
        />
      )}
      <Routes>
        <Route path="/"></Route>
        {isHomeAdmin && (
          <Route path="/home-admin/*" element={<HomeAdmin />}></Route>
        )}
        {/* header */}
        <Route path="/login"></Route>
        <Route path="/recovery-password" element={<RecoveryPassword />}></Route>
        <Route path="/regis"></Route>
        <Route path="/searchlist" element={<SearchList />}></Route>
        {/* detail */}
        <Route
          path="/detail/:ID"
          element={<Detail setUserById={setUserById} />}
        ></Route>
        <Route
          path="/request"
          element={<Request userById={userById} />}
        ></Route>
        {/* payment */}
        <Route
          path="/payment"
          element={<Payment userById={userById} />}
        ></Route>
        <Route path="/success-page" element={<SuccessPage />}></Route>
        {/* profile */}
        <Route path="/profile/*" element={<Profile />}></Route>
        <Route path="/history" element={<TransactionHistory />}></Route>
        <Route path="/changepassword" element={<ChangePassword />}></Route>
      </Routes>
      <CSSTransition
        in={location.pathname === "/"}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div>
          <Home />
        </div>
      </CSSTransition>
      <CSSTransition
        in={isLoginPage}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div className="login-page">
          <Login />
        </div>
      </CSSTransition>
      <CSSTransition
        in={isRegisterPage}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div className="register-page">
          <Register />
        </div>
      </CSSTransition>

      {showFooter && !isHomeAdmin && (
        <Footer
          isLoginPage={isLoginPage}
          isRegisterPage={isRegisterPage}
          isRecoveryPage={isRecoveryPage}
          isTransaction ={isTransaction}
          isHomeAdmin={isHomeAdmin}
        />
      )}
    </div>
  );
}

export default App;
