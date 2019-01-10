async function setDefaultSnackbar() {
    await setSnackbar();
}

async function setSnackbar({
                               text = '',
                               show = false,
                               timeout = 3000,
                               color = 'grey darken-4'
                           } = {}) {

    glObj.snackbar.text = text;
    glObj.snackbar.show = show;
    glObj.snackbar.timeout = timeout;
    glObj.snackbar.color = color;
    glObj.snackbar.colors = {
        SUCCESS: 'success',
        INFO: 'info',
        WARNING: 'warning',
        ERROR: 'error',
        GREY: 'grey darken-4'
    };

}