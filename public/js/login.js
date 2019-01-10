async function setDefaultDialogLogin() {
    await settDialogLogin();
}

async function settDialogLogin({
                                   isLogin = false,
                                   show = true,
                                   textHead = 'Login',
                                   isCreateNewUser = false,
                                   isCreateNewUserShow = true,
                                   textBtn = 'Work',
                                   login = '',
                                   password = '',
                                   passwordType = false,
                                   passwordConfirm = '',
                                   passwordConfirmType = false
                               } = {}) {
    dialogLogin.isLogin = isLogin;
    dialogLogin.show = show;
    dialogLogin.textHead = textHead;
    dialogLogin.isCreateNewUser = isCreateNewUser;
    dialogLogin.isCreateNewUserShow = isCreateNewUserShow;
    dialogLogin.textBtn = textBtn;
    dialogLogin.login = login;
    dialogLogin.password = password;
    dialogLogin.passwordType = passwordType;
    dialogLogin.passwordConfirm = passwordConfirm;
    dialogLogin.passwordConfirmType = passwordConfirmType;
}

async function resetLoginPass() {
    dialogLogin.login = '';
    dialogLogin.password = '';
    dialogLogin.passwordConfirm = '';
}

async function createOrWork() {

    dialogLogin.login = dialogLogin.login.toLowerCase();
    if (dialogLogin.isCreateNewUser) {

        if (dialogLogin.isBackend) {
            dialogLogin.curTypeSaveData = 'server';
            await createNewUserWithBackend();
        } else {
            dialogLogin.curTypeSaveData = 'browser';
            await createNewUserWithoutBackend();
        }

    } else {

        await loginUser();

    }

}

async function newUserIsValid() {

    if (!dialogLogin.login) {
        await setSnackbar({
            text: 'Empty login',
            show: true
        });
        return false;
    }

    if (!dialogLogin.password) {
        await setSnackbar({
            text: 'Empty password',
            show: true
        });
        return false;
    }

    if (dialogLogin.password !== dialogLogin.passwordConfirm) {
        await setSnackbar({
            text: 'Password not equal confirm password',
            show: true
        });
        return false;
    }

    return true;
}

async function createNewUserWithBackend(res) {

    if (!res) {

        let isValid = await newUserIsValid();
        if (!isValid) {
            return;
        }
        let data = await getData();
        data.login = dialogLogin.login;
        data.password = dialogLogin.password;
        await jrfws.sendMes(data, 'tasks', 'add');
        return;
    }

    if (!res.okay) {
        await setSnackbar({
            text: `User ${dialogLogin.login} not created`,
            show: true
        });
        return;
    }

    await settDialogLogin({isLogin: true, show: false});
    let data = res.output[0];
    await loadGlObj(data.glObj);

    if (dialogLogin.changeTypeSaveData) {

        await clearLocalStorage();
        await setCurTypeSaveData();
        dialogLogin.changeTypeSaveData = false;
        await closeUserSettings();
        await setSnackbar({
            text: 'Data save to cloud',
            show: true
        });

    } else {

        await setSnackbar({
            text: `${glObj.settings.login} created`,
            show: true
        });
        dialogLogin.curTypeSaveData = 'server';
        glObj.settings.typeSaveData = 'server';

    }

}

async function createNewUserWithoutBackend(hashPass) {

    if (!hashPass) {

        let isValid = await newUserIsValid();
        if (!isValid) {
            return;
        }
        await jrfws.sendMes(dialogLogin.password, 'login', 'encode');
        return;
    }

    if (!dialogLogin.isBackend) {
        glObj.settings.login = dialogLogin.login;
        glObj.settings.password = hashPass;
        await settDialogLogin({isLogin: true, show: false});
        await setSnackbar({
            text: `${glObj.settings.login} created`,
            show: true
        });
        await loadGlObj(glObj);
        glObj.settings.typeSaveData = 'browser';
    }

}

async function loginUser() {

    await setCurTypeSaveData();
    if (dialogLogin.curTypeSaveData === 'browser') {

        let saveObj = await getGlObj();
        await loadGlObj(saveObj);
        await jrfws.sendMes({
            password: dialogLogin.password,
            hashPassword: glObj.settings.password
        }, 'login', 'passIsValid');

    } else {

        await jrfws.sendMes({
            login: dialogLogin.login,
            password: dialogLogin.password
        }, 'login', 'login');

    }

}

async function loginUserWithBackend(res) {

    if (!res) {
        await setSnackbar({
            text: 'Invalid login',
            show: true
        });
        return;
    }

    if (!res.okay) {
        await setSnackbar({
            text: res.description,
            show: true
        });
        return;
    }

    let data = res.output[0];

    await loadGlObj(data.glObj);
    dialogLogin.show = false;

    await settDialogLogin({isLogin: true, show: false});
    await setSnackbar({
        text: `Login`,
        show: true
    });

    await loadStopwatch(data.date);
    await loadPomodoro(data.pomodoro);

}

async function loginUserWithoutBackend(isValid) {

    if (glObj.settings.login !== dialogLogin.login) {
        await setSnackbar({
            text: 'Bad login',
            show: true
        });
        return;
    }

    if (!isValid) {
        await setSnackbar({
            text: 'Bad password',
            show: true
        });
        return;
    }

    glObj.settings.typeSaveData = 'browser';
    dialogLogin.show = false;
    await settDialogLogin({isLogin: true, show: false});
    await setSnackbar({
        text: `Login`,
        show: true
    });

    await loadStopwatch();
    await loadPomodoro();

}