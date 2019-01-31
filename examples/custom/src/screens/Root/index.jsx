import React from "react";
import { Link } from "react-router-dom";
import { renderRoutes } from "react-router-config";

import { paths } from "../../routes";

const RootScreen = ({ route }) => (
    <div>
        <h1>More Examples</h1>
        <ul>
            <li><Link to={paths.LOGIN_FORM}>Login Form</Link></li>
        </ul>
        {renderRoutes(route.routes)}
    </div>
);

export default RootScreen;
