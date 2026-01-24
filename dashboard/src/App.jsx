import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import PricingPlans from "./pages/PricingPlans/PricingPlans";
import SignIn from "./pages/AuthPages/SignIn";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import Home from "./pages/Dashboard/Home";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { ToastContainer } from "react-toastify";
import AppLayout from "./layout/AppLayout";
import Templates from "./pages/PaymentDue/Websites";
import Blank from "./pages/Blank";
import FormElements from "./pages/Forms/FormElements";
import AddTemplates from "./pages/PaymentDue/AddWebsites";
import ChangePassword from "./pages/AuthPages/ChangePassword";
import PricingDashboard from "./pages/PricingPlans/PricingDashboard";
import BasicTables from "./pages/Tables/BasicTables";
import NotFound from "./pages/OtherPage/NotFound";
import Websites from "./pages/PaymentDue/Websites";
import Users from "./pages/Users/Users";
import PaymentDueJSX from "./pages/Documentations/PaymentDue/PaymentDueJSX";
import PaymentDueHTML from "./pages/Documentations/PaymentDue/PaymentDueHTML";



export default function App() {
  const { AccessToken, setAuth, UserRole } = useAuth();

  useEffect(() => {
    console.log(UserRole)
  }, [UserRole])


  // If no access token, show SignIn page
  if (!AccessToken && !UserRole  ) {
    return (
      <Router>
        {/* <ScrollToTop /> */}
        <Routes>
          <Route path="/" element={<PricingPlans />} />
          <Route path="/signin" element={<SignIn />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}
          <Route path="*" element={<SignIn />} /> {/* Redirect all routes to signin when not authenticated */}
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <ToastContainer style={{ zIndex: 9999999 }} />
      <Routes>
        {/* Dashboard Layout - Protected Routes */}
        <Route element={<AppLayout />}>
          {/* <Route index path="/dashboard" element={<Home />} /> */}
          {/* <Route path="/checkout" element={<CheckoutPage />} /> */}

          {/* Others Page */}
          {/* <Route path="/profile" element={<UserProfiles />} /> */}
          {/* <Route path="/users" element={<Users />} /> */}
          {/* <Route path="/templates" element={<Templates />} />
          <Route path="/blank" element={<Blank />} /> */}


          {/* Forms */}
          {/* <Route path="/form-elements" element={<FormElements />} />
          <Route path="/add-template" element={<AddTemplates />} />
          <Route path="/change-password" element={<ChangePassword />} /> */}
          
          {/* <Route path="/pricing" element={<PricingDashboard />} /> */}
          {/* <Route path="/coupan" element={<ApplyCoupon />} /> */}

         
          <Route path="/signin" element={<Websites />} />
          <Route path="/signup" element={<Websites />} />

          {/* Admin and editor  Routes */}
          {(UserRole === "admin" || UserRole === "editor")  && (
            <>
              {/* <Route path="/basic-tables" element={<BasicTables />} /> */}
              <Route path="/payment-due" element={<Websites />} />


              <Route path="/payment-due-doc-jsx" element={<PaymentDueJSX />} />
              <Route path="/payment-due-doc-html" element={<PaymentDueHTML />} />

            </>
          )}


          {/* Admin Only Routes */}
          {UserRole === "admin" && (
            <>
              {/* Tables */}
              {/* <Route path="/basic-tables" element={<BasicTables />} />      + */}
            </>
          )}

        </Route>

       
        <Route path="/" element={<PricingPlans />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}
        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}