import "./App.css";
import Home from "./pages/home/home";
import AdminLogin from "./pages/admin/admin-login";
import Billing from "./pages/billing/billing";

const ADMIN_PAGE_BY_PATH = {
  "/admin/reservations": "reservations",
  "/admin/billing": "billing",
  "/admin/setting": "settings",
};

function App() {
  const currentPath = window.location.pathname;
  const isAdminLoginRoute = currentPath === "/admin/login";
  const adminPage = ADMIN_PAGE_BY_PATH[currentPath];
  const isAdminModeEnabled = sessionStorage.getItem("adminmodeenable") === "true";

  if (adminPage && isAdminModeEnabled) {
    return (
      <Billing
        activePage={adminPage}
        onBack={() => window.location.assign("/")}
      />
    );
  }

  if (adminPage) {
    window.history.replaceState({}, "", "/");
  }

  if (isAdminLoginRoute && isAdminModeEnabled) {
    return (
      <AdminLogin
        onBack={() => window.history.back()}
        onAuthenticated={() => window.location.assign("/admin/billing")}
      />
    );
  }

  if (isAdminLoginRoute && !isAdminModeEnabled) {
    window.history.replaceState({}, "", "/");
  }

  return (
    <>
      <Home onAdminOpen={() => window.location.assign("/admin/login")} />
    </>
  );
}

export default App;
