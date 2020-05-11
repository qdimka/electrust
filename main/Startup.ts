import { App, BrowserWindow, Screen, GlobalShortcut } from "electron";
import path from "path";
import * as Path from "path";
import {ChildProcess, execFile, spawn} from "child_process";

class Startup {
    public static application: App;
    public static screen: Screen;
    public static globalShortcut: GlobalShortcut;
    public static window: BrowserWindow;

    private static server: ChildProcess;

    public static run(application: App,
                      screen: Screen,
                      globalShortcut: GlobalShortcut): void {

        this.application = application;
        this.screen = screen;
        this.globalShortcut = globalShortcut;

        if(!this.application.requestSingleInstanceLock()) {
            this.application.quit();
        } else {
            this.runServer();
            this.registerEvents();
        }
    }


    private static getExecutablePath(): string {
        return Path.join(__dirname,"..", "server", "Cargo.toml");
    }

    private static runServer(): void {
        const path = this.getExecutablePath();
        this.server = this.server = !this.application.isPackaged
            ? spawn("cargo", ["run", "--manifest-path", path])
            : execFile(path);

        this.server.stdout.on("data", this.log);
        this.server.stdout.on("error", this.log);
        this.server.stderr.on("error", this.log);
    }

    private static log(e: Buffer): void {
        console.log(e.toString("utf-8"))
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
        this.server.kill();
    }
}

export default Startup;