import RootScreen from "./screens/Root";
import LoginScreen from "./screens/Login";

export const paths = {
    ROOT: "/",
    LOGIN_FORM: "/login-form",
};

const routes = [
    {
        path: paths.ROOT,
        component: RootScreen,
        routes: [
            {
                path: paths.LOGIN_FORM,
                exact: true,
                component: LoginScreen
            }
        ]
    }
];

export default routes;
