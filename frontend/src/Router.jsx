import { Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AdminLayout from "./component/layouts/AdminLayout.jsx";

const AuthPage = lazy(() => import("./component/pages/AuthPage.jsx"));
const MainPage = lazy(() => import("./component/pages/Dashboard.jsx"));
const DataManagementPage = lazy(() =>
  import("./component/pages/DataManagement.jsx")
);
const HomePage = lazy(() => import("./component/pages/HomePage.jsx"));
const BrokerPage = lazy(() => import("./component/pages/SettingsPage.jsx"));
const IdPage = lazy(() => import("./component/pages/IdPage.jsx"));

const AppRoutes = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const PublicRoute = ({ element, restricted }) => {
    const token = localStorage.getItem("token");
    const isAuthenticated = !!token;
    return restricted && isAuthenticated ? (
      <Navigate to="/dashboard" replace />
    ) : (
      element
    );
  };

  function PrivateRoute({ element, userRole, requiredRole }) {
    const token = localStorage.getItem("token");
    const isAuthenticated = !!token;
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to="/" replace />;
    }
    return element;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<div>Loading.....</div>}>
            <AuthPage />
          </Suspense>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            userRole={null}
            requiredRole={null}
            element={
              <Suspense fallback={<div>Loading.....</div>}>
                <MainPage />
              </Suspense>
            }
          />
        }
      />
      <Route
        path="/home"
        element={
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            userRole={null}
            requiredRole={null}
            element={
              <Suspense fallback={<div>Loading.....</div>}>
                <HomePage />
              </Suspense>
            }
          />
        }
      />
      <Route
        path="/datamanagement"
        element={
          <PrivateRoute
            isAuthenticated={isAuthenticated}
            userRole={null}
            requiredRole={null}
            element={
              <Suspense fallback={<div>Loading.....</div>}>
                <DataManagementPage />
              </Suspense>
            }
          />
        }
      />
      <Route
        path="/brokers"
        element={
          <Suspense fallback={<div>Loading.....</div>}>
            <BrokerPage />
          </Suspense>
        }
      />
       <Route
        path="/ids"
        element={
          <Suspense fallback={<div>Loading.....</div>}>
            <IdPage />
          </Suspense>
        }
      />
      <Route path="/test" element={<AdminLayout />} />
    </Routes>
  );
};

export default AppRoutes;
