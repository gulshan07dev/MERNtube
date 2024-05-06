import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { getCurrentUser, refreshAccessToken } from "./store/slices/authSlice";
import { AppDispatch } from "./store/store";
import { setAppLoading } from "./store/slices/appLoadingSlice";
import router from "./routes";

function App() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    (async () => {
      dispatch(setAppLoading(true));

      const res = await dispatch(getCurrentUser());

      if (!res?.payload?.success) {
        // If there's an error, try refreshing the access token
        await dispatch(refreshAccessToken());

        // Retry fetching the current user after refreshing the token
        await dispatch(getCurrentUser());
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
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
