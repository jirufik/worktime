async function showUserSettings() {
    glObj.settings.show = true;
}

async function closeUserSettings() {
    glObj.settings.show = false;
    glObj.settings.curPassword = '';
    glObj.settings.newPassword = '';
    glObj.settings.confirmPassword = '';
    glObj.settings.typeSaveData = await getTypeSaveData();
}

async function saveUserSettings() {

    dialogLogin.changeTypeSaveData = dialogLogin.curTypeSaveData !== glObj.settings.typeSaveData
    if (glObj.settings.curPassword
        || glObj.settings.newPassword
        || glObj.settings.confirmPassword) {
        await saveNewPassword();
        return;
    }

    if (dialogLogin.changeTypeSaveData) {
        await saveTypeSaveData();
    }

}

async function saveNewPassword() {

    if (!glObj.settings.curPassword
        || !glObj.settings.newPassword
        || !glObj.settings.confirmPassword
        || glObj.settings.newPassword !== glObj.settings.confirmPassword) {
        await setSnackbar({
            text: 'Password not change',
            show: true
        });
        return;
    }

    await jrfws.sendMes({
        hashPassword: glObj.settings.password,
        curPassword: glObj.settings.curPassword,
        newPassword: glObj.settings.newPassword,
        confirmPassword: glObj.settings.confirmPassword
    }, 'login', 'changePassword');

}

async function changePassword(res) {

    if (!res.okay) {
        await setSnackbar({
            text: res.description,
            show: true
        });
        return;
    }

    let hashNewPassword = res.output[0];
    let hashPassword = glObj.settings.password;

    if (!dialogLogin.changeTypeSaveData) {
        await closeUserSettings();
    } else {
        glObj.settings.show = false;
        glObj.settings.curPassword = '';
        glObj.settings.newPassword = '';
        glObj.settings.confirmPassword = '';
    }

    if (glObj.settings.typeSaveData === 'browser') {
        glObj.settings.password = hashNewPassword;
    } else {
        glObj.settings.newPassword = hashNewPassword;
    }

    await setSnackbar({
        text: 'Password change',
        show: true
    });

    if (dialogLogin.changeTypeSaveData) {
        await saveTypeSaveData(hashNewPassword, hashPassword);
        return;
    }
    await logout();

}

async function saveTypeSaveData(hashNewPassword = '', hashPassword = '') {

    if (glObj.settings.typeSaveData === 'browser') {

        dialogLogin.curTypeSaveData = 'browser';
        await save();
        let data = await getData();
        if (hashPassword) {
            data.password = hashPassword;
        }
        await closeUserSettings();
        await jrfws.sendMes(data, 'tasks', 'del');
        dialogLogin.changeTypeSaveData = false;
        await setSnackbar({
            text: 'Data save to browser',
            show: true
        });
        return;

    }

    let data = await getData();
    data.login = glObj.settings.login;
    data.password = '';
    if (hashNewPassword) {
        data.hashPassword = hashNewPassword;
    } else {
        data.hashPassword = glObj.settings.password;
    }
    await jrfws.sendMes(data, 'tasks', 'add');

}

async function setCurTypeSaveData() {
    dialogLogin.curTypeSaveData = await getTypeSaveData();
}

async function getTypeSaveData() {

    if (localStorage.getItem('glObj')) {
        return 'browser';
    }
    return 'server';
}

async function clearLocalStorage() {
    localStorage.removeItem('glObj');
    localStorage.removeItem('date');
    localStorage.removeItem('pomodoro');
}