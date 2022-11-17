/* @refresh reload */
import { render } from 'solid-js/web';
import { hashIntegration, Router } from "@solidjs/router";
import { GameProvider } from "./context";
import App from './App';
import 'windi.css';

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
