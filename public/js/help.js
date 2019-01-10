async function helpChangeShow() {
    dialogLogin.help.show = !dialogLogin.help.show;
    if (dialogLogin.help.show) {
        dialogLogin.help.showNavigation = true;
    }
}

async function navigationChangeShow() {
    dialogLogin.help.showNavigation = !dialogLogin.help.showNavigation;
}

async function showMainForm() {
    dialogLogin.help.showNavigation = false;
    dialogLogin.help.show = false;

}