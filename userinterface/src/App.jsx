import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminApp from "@/scenes/admin";
import UserApp from "@/scenes/main";
import Login from "@/scenes/auth/login";
import Signup from "@/scenes/auth/signup";
import ErrorPage from "@/errors/errorPage.jsx";
import PageTitle from "./common/PageTitle";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <UserApp /> <PageTitle title="Home" />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Login /> <PageTitle title="Login | The Booking Bot" />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <Signup /> <PageTitle title="Signup | The Booking Bot" />
            </>
          }
        />
        <Route
          path="/admin/*"
          element={
            <>
              <AdminApp />
              <PageTitle title="Admin | The Booking Bot" />
            </>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
