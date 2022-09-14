/* @refresh reload */
import { render } from 'solid-js/web';
import { hashIntegration, Router } from "@solidjs/router";
import { GameProvider } from "./client/context";
import App from './client/App';
//import './index.css';
import 'windi.css';
import "solid-devtools"


// ----------------------------------------------------------------------

render(
    () => (
        <Router source={hashIntegration()}>
            <GameProvider>
                <App />
            </GameProvider>
        </Router>
    ),
    document.getElementById("root")
);
