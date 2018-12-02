import Main from "./Main"

export let main: Main;

if (document.getElementById("game")) {
    main = new Main();
    main.start();
}