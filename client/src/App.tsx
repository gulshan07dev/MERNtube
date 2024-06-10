import { useEffect, Suspense } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { AppDispatch } from "./store/store";
import { login, logout } from "./store/slices/authSlice";
import { setAppLoading } from "./store/slices/appLoadingSlice";
import authService from "./services/authService";
import useService from "./hooks/useService";
import router from "./routes";
import MainAppLoader from "./component/MainAppLoader";

function App() {
  const dispatch: AppDispatch = useDispatch();
  const { handler: getCurrentUser } = useService(authService.getCurrentUser);
  const { handler: refreshAccessToken } = useService(
    authService.refreshAccessToken
  );

  useEffect(() => {
    (async () => {
      dispatch(setAppLoading(true));
      const { success, responseData } = await getCurrentUser();

      if (success) {
        dispatch(login(responseData?.data.user));
      } else {
        // If there's an error, try refreshing the access token
        const { success } = await refreshAccessToken();

        // Retry fetching the current user after refreshing the token
        if (success) {
          const { responseData } = await getCurrentUser();
          dispatch(login(responseData?.data.user));
        } else {
          dispatch(logout());
        }
      }
      dispatch(setAppLoading(false));
    })();
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      document.body.classList.add(theme);
    }
  }, []);

  return (
    <Suspense fallback={<MainAppLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
