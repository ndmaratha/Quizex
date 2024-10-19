import { atom } from "recoil";

export const LoginState = atom({
	key: "LoginState",
	default: false,
});

export const UserInfo = atom({
	key: "userInfo",
	default: {
		id: "",
		userName: "",
	},
});
