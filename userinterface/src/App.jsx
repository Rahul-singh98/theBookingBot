import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminApp from "@/scenes/Admin";
import UserApp from "@/scenes/Main";
import Login from "@/scenes/Auth/login";
import Signup from "@/scenes/Auth/signup";
import ErrorPage from "@/errors/errorPage.jsx";
import PageTitle from "./components/PageTitle";
import { AuthProvider } from "@/hooks/useAuth";

const LayoutWithTitle = ({ children, title }) => (
  <>
    {children}
    <PageTitle title={title} />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LayoutWithTitle title="Home">
        <UserApp />
      </LayoutWithTitle>
    ),
  },
  {
    path: "/login",
    element: (
      <LayoutWithTitle title="Login | The Booking Bot">
        <Login />
      </LayoutWithTitle>
    ),
  },
  {
    path: "/signup",
    element: (
      <LayoutWithTitle title="Signup | The Booking Bot">
        <Signup />
      </LayoutWithTitle>
    ),
  },
  {
    path: "/admin/*",
    element: (
      <LayoutWithTitle title="Admin | The Booking Bot">
        <AdminApp />
      </LayoutWithTitle>
    ),
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
