import {app, globalShortcut, screen} from "electron";
import Startup from "./Startup";

(async () => {
    Startup.run(
        app,
        screen,
        globalShortcut
    );
})();