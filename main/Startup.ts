import { App, BrowserWindow, Screen, GlobalShortcut } from "electron";
import path from "path";

class Startup {
    public static application: App;
    public static screen: Screen;
    public static globalShortcut: GlobalShortcut;
    public static window: BrowserWindow;

    public static run(application: App,
                      screen: Screen,
                      globalShortcut: GlobalShortcut): void {

        this.application = application;
        this.screen = screen;
        this.globalShortcut = globalShortcut;

        if(!this.application.requestSingleInstanceLock()) {
            this.application.quit();
        } else {
            this.registerEvents();
        }
    }

    private static registerEvents(): void {
        this.application.on("ready", this.onReady.bind(this));
        this.application.on("window-all-closed", this.onWindowAllClosed.bind(this));
        this.application.on("will-quit", this.onWillQuit.bind(this));
    }

    private static registerShortcuts(): void {
        this.globalShortcut.register("CommandOrControl+C", () => {
            this.application.quit();
        })
    }

    private static unregisterShortcuts(): void {
        this.globalShortcut.unregisterAll();
    }

    private static async onReady(): Promise<void> {
        this.registerShortcuts();

        this.window = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                allowRunningInsecureContent: true,
                webSecurity: false
            }
        });

        await this.window.loadURL(!this.application.isPackaged
            ? "http://localhost:8080"
            :`file://${path.join(__dirname,"../static/index.html")}`);
    }

    private static onWindowAllClosed(): void {
        if (process.platform !== "darwin")
            this.application.quit();
    }

    private static onWillQuit(): void {
        this.unregisterShortcuts();
    }
}

export default Startup;