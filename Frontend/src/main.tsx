import { createRoot } from "react-dom/client";
import App, { appRouter } from "./App.tsx";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";

createRoot(document.getElementById("root")!).render(
	<RecoilRoot>
		<RouterProvider router={appRouter} />
	</RecoilRoot>
);
