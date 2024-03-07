import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import LoginCurrentPage from "./pages/LoginCurrentPage";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Transaction from "./pages/Transaction";
import Page404 from "./pages/Page404";
import Page500 from "./pages/Page500";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        { path: "/sign-up", element: <SignUp /> },
        { path: "/login", element: <LogIn /> },
        { path: "/user/login", element: <LoginCurrentPage /> },
        { path: "/search", element: <Search /> },
        { path: "/detail/:id", element: <Detail /> },
        { path: "/transaction", element: <Transaction /> },
      ],
    },
    { path: "server-error", element: <Page500 /> },
    { path: "*", element: <Page404 /> },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
