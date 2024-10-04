import { createBrowserRouter, Outlet } from "react-router-dom";
import Signup from "./Component/Authentication/Signup";
import Login from "./Component/Authentication/Login";
import SideBar from "./Component/SideBar";
import CreateQuiz from "./pages/CreateQuiz";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import "./App.css";
function App() {
	return (
		<div className='main-container'>
			<SideBar />
			<Outlet />
		</div>
	);
}
export const appRouter = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <Dashboard />,
			},
			{
				path: "/analytics",
				element: <Analytics />,
			},
			{
				path: "/create",
				element: <CreateQuiz />,
			},
		],
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/signup",
		element: <Signup />,
	},
]);
export default App;
