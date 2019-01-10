async function logout() {
    window.location.reload();
}

async function menuShowMainForm() {
    if (!dialogLogin.help.show) {
        return;
    }
    await showMainForm();
}