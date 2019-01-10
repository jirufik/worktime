async function setDefaultExportImport() {

    glObj.settings.exportImport.show = false;
    glObj.settings.exportImport.export = true;
    glObj.settings.exportImport.textHead = 'Export';
    glObj.settings.exportImport.textBtn = 'Copy';
    glObj.settings.exportImport.textState = '';

}

async function exportShow() {
    glObj.settings.exportImport.export = true;
    glObj.settings.exportImport.textHead = 'Export';
    glObj.settings.exportImport.textBtn = 'Copy';
    let data = await getData();
    glObj.settings.exportImport.textState = JSON.stringify(data);
    glObj.settings.exportImport.show = true;
}

async function importShow() {
    glObj.settings.exportImport.export = false;
    glObj.settings.exportImport.textHead = 'Import';
    glObj.settings.exportImport.textBtn = 'Load';
    glObj.settings.exportImport.show = true;
}

async function importData() {

    if (!glObj.settings.exportImport.textState) {
        await showSnackbarImport();
        return;
    }

    let data;
    try {
        data = JSON.parse(glObj.settings.exportImport.textState);
    } catch (e) {
        await showSnackbarImport();
        return;
    }

    if (typeof data !== 'object') {
        await showSnackbarImport();
        return;
    }

    if (!data.date || !data.glObj) {
        await showSnackbarImport();
        return;
    }

    let curData = await getData();

    try {

        stopwatch = new JrfStopwatch();
        await loadGlObj(data.glObj);
        await loadStopwatch(data.date);

    } catch (e) {

        stopwatch = new JrfStopwatch();
        await loadGlObj(curData.glObj);
        await loadStopwatch(curData.date);
        await showSnackbarImport();
        return;

    }

    await showSnackbarImport('Data load');
    await setDefaultExportImport();
    await save();

}

async function showSnackbarImport(text = 'Data dont load') {
    await setSnackbar({
        text,
        show: true
    });
}

function copyToClipboard(bodyTextArea) {

    bodyTextArea.focus();
    bodyTextArea.select();
    let okay = document.execCommand('copy');

    if (!okay) {
        setSnackbar({
            text: 'Data not copy to clipboard',
            show: true
        });
        return;
    }

    setSnackbar({
        text: 'Data copy to clipboard',
        show: true
    });
    setDefaultExportImport();

}