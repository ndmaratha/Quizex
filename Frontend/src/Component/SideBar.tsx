import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useRecoilState } from "recoil";
import { LoginState } from "../Store/LoginState";
const SideBar: React.FC = () => {
	const location = useLocation();
	const [loginState, setLoginState] = useRecoilState(LoginState);
	const navigate = useNavigate();
	const handleLogout = async () => {
		await localStorage.clear();
		setLoginState(false);
	};

	return (
		<div className='Main-container-sidebar'>
			<div className='heading'>Quizee</div>
			<div className='pages-button'>
				<Link to={"/"}>
					<button className={location.pathname === "/" ? "active" : ""}>
						Dashboard
					</button>
				</Link>
				<Link to={"/analytics"}>
					<button
						className={location.pathname === "/analytics" ? "active" : ""}
					>
						Analytics
					</button>
				</Link>
				<Link to={"/create"}>
					<button className={location.pathname === "/create" ? "active" : ""}>
						Create Quiz
					</button>
				</Link>
			</div>
			<div className='logout-btn'>
				<div className='line'></div>
				{loginState ? (
					<button onClick={(e) => handleLogout()}>Logout</button>
				) : (
					<button onClick={(e) => navigate("/login")}>Login</button>
				)}
			</div>
		</div>
	);
};

export default SideBar;
