document.addEventListener('DOMContentLoaded', async () => await start());

window.onunload = async () => await save();

let jrfws;
let dialogLogin = {
    isLogin: false,
    show: true,
    textHead: 'Login',
    isCreateNewUser: false,
    isCreateNewUserShow: true,
    textBtn: 'Work',
    login: '',
    password: '',
    passwordType: false,
    passwordConfirm: '',
    passwordConfirmType: false,
    isBackend: false,
    dontSave: false,
    curTypeSaveData: 'browser',
    changeTypeSaveData: false,
    help: {
        show: false,
        showNavigation: false
    }
};
let glObj = {
    expansionTime: {
        text: 'Task',
        class: 'display-1 indigo--text',
        isOpen: true
    },
    expansionPomodoro: {
        text: 'Pomodoro',
        class: 'display-1 deep-orange--text',
        isOpen: true
    },
    curTask: {
        company: '',
        project: '',
        task: '',
        description: '',
        start: 0,
        startTimeStr: '00:00:00',
        finish: 0,
        finishTimeStr: '00:00:00',
        period: 0,
        periodStr: '00:00:00',
        pause: 0,
        pauseStr: '00:00:00',
        price: 0,
        pricePerHour: true,
        cost: 0
    },
    tasks: [],
    tasksList: [],
    companiesList: [],
    projectsList: [],
    panel: [true, true, true],
    pagination: {
        descending: true,
        page: 1,
        rowsPerPage: -1,
        sortBy: "start"
    },
    filter: {
        show: false,
        startDate: new Date(),
        startDateStr: '',
        startDatePicker: '',
        finishDate: new Date(),
        finishDateStr: '',
        finishDatePicker: '',
        companies: [],
        excludeCompanies: false,
        tasks: [],
        excludeTasks: false,
        search: '',
        excludeSearch: false,
        projects: [],
        excludeProjects: false
    },
    tasksFooter: {
        pausetime: 0,
        worktime: 0,
        cost: 0,
        companiesCount: 0,
        tasksCount: 0,
        projectsCount: 0
    },
    dialog: {
        head: '',
        text: '',
        textBtnCancel: 'Cancel',
        textBtnApply: 'Apply',
        obj: {},
        show: false,
        acts: {
            ADD: 'add',
            GET: 'get',
            EDIT: 'edit',
            DELETE: 'del'
        },
        act: 'add'
    },
    snackbar: {
        text: '',
        show: false,
        timeout: 3000,
        colors: {
            SUCCESS: 'success',
            INFO: 'info',
            WARNING: 'warning',
            ERROR: 'error',
            GREY: 'grey darken-4'
        },
        color: 'info'
    },
    pomodoro: {
        timePomodoro: 25,
        timeShortPause: 5,
        timeLongPause: 30,
        countBeforeLongPause: 4,
        sound: true,
        volume: 1.0,
        soundPomodoro: 'sound/pomodoro.mp3',
        soundPause: 'sound/pause.mp3',
        show: false
    },
    settings: {
        login: '',
        password: '',
        curPassword: '',
        newPassword: '',
        confirmPassword: '',
        typeSaveData: 'browser',
        show: false,
        exportImport: {
            show: false,
            export: true,
            textHead: 'Export',
            textBtn: 'Copy',
            textState: ''
        },
        enLang: true
    }
};

let stopwatch = new JrfStopwatch();

let pomodoro = new Pomodoro();

pomodoro.onPomodoro = async () => {
    await app.$refs.pmdr.stopUpdate();
    await app.$refs.pmdr.startUpdate();
    await app.$refs.pmdr.play('pomodoro');
};
pomodoro.onLongPause = async () => {
    await app.$refs.pmdr.stopUpdate();
    await app.$refs.pmdr.startUpdate();
    await app.$refs.pmdr.play('pause');
};
pomodoro.onShortPause = async () => {
    await app.$refs.pmdr.stopUpdate();
    await app.$refs.pmdr.startUpdate();
    await app.$refs.pmdr.play('pause');
};

async function start() {

    jrfws = new JRFWS();
    jrfws.onopen = async () => {
        await jrfws.sendMes(null, 'login', 'isBackend')
    };
    await routing();
    await jrfws.connectToWs('ws://' + window.location.host);

}

async function getData() {

    let statePomodoro = await pomodoro.getState();
    let stateStopwatch = await stopwatch.getInfo();

    return {
        login: glObj.settings.login,
        newPassword: glObj.settings.newPassword,
        password: glObj.settings.password,
        glObj,
        pomodoro: statePomodoro,
        date: stateStopwatch
    }
}

async function getGlObj() {

    let state = localStorage.getItem('glObj');
    if (state) {
        state = JSON.parse(state);
    }

    return state;

}

async function showCreateNewUser(saveObj) {

    if (saveObj && !dialogLogin.isBackend) {
        dialogLogin.isCreateNewUser = false;
        dialogLogin.isCreateNewUserShow = false;
    } else if (!saveObj && !dialogLogin.isBackend) {
        dialogLogin.isCreateNewUser = true;
        dialogLogin.isCreateNewUserShow = false;
        await settDialogLogin({
            show: true,
            isCreateNewUser: true,
            isCreateNewUserShow: false,
            textHead: 'Create new user',
            textBtn: 'Create',
            login: '',
            password: '',
            passwordConfirm: ''
        });
    } else {
        dialogLogin.isCreateNewUser = false;
        dialogLogin.isCreateNewUserShow = true;
    }

}

function wait(mlsecond = 1000) {
    return new Promise(resolve => setTimeout(resolve, mlsecond));
}

async function save() {

    if (!dialogLogin.isLogin) {
        return;
    }

    if (dialogLogin.curTypeSaveData === 'server') {

        if (!dialogLogin.dontSave) {
            let data = await getData();
            await jrfws.sendMes(data, 'tasks', 'edit');
        }

    } else {

        let state = JSON.stringify(await stopwatch.getInfo());
        localStorage.setItem('date', state);

        state = JSON.stringify(await pomodoro.getState());
        localStorage.setItem('pomodoro', state);

        state = JSON.stringify(glObj);
        localStorage.setItem('glObj', state);

    }
}

async function loadGlObj(state) {

    glObj.expansionTime = state.expansionTime;
    glObj.expansionPomodoro = state.expansionPomodoro;
    glObj.panel = state.panel;
    glObj.curTask = state.curTask;
    glObj.tasks = state.tasks;
    glObj.tasksList = state.tasksList;
    glObj.projectsList = state.projectsList;
    glObj.companiesList = state.companiesList;
    glObj.price = state.price;
    glObj.pricePerHour = state.pricePerHour;
    glObj.cost = state.cost;
    glObj.pagination = state.pagination;
    glObj.filter = state.filter;
    glObj.tasksFooter = state.tasksFooter;
    glObj.dialog = state.dialog;
    glObj.pomodoro = state.pomodoro;
    glObj.settings = state.settings;
    glObj.snackbar = state.snackbar;
    await convertDateInGlObj();

    await fillCompanyList();
    await fillTasksList();
    await fillProjectsList();
    await setDefaultFilter();
    await setDefaultDialog();
    await setDefaultSnackbar();

}

async function loadPomodoro(state) {

    if (state) {

        await pomodoro.setState(state);
        await app.$refs.pmdr.setState();
        await loadPomodoroSettings();

    } else {

        let state = localStorage.getItem('pomodoro');
        if (state) {
            state = JSON.parse(state);
            await pomodoro.setState(state);
            await app.$refs.pmdr.setState();
            await loadPomodoroSettings();
        }

    }

}

async function loadStopwatch(state) {

    if (state) {

        await stopwatch.setState(state);
        await app.$refs.stpwtch.setState();

    } else {

        let state = localStorage.getItem('date');
        if (state) {
            state = JSON.parse(state);
            await stopwatch.setState(state);
            await app.$refs.stpwtch.setState();
        }

    }

}

async function loadStates(res) {

    dialogLogin.dontSave = true;

    if (!res || !res.okay || !res.output || !res.output.length) {
        dialogLogin.dontSave = false;
        return;
    }

    stopwatch = new JrfStopwatch();

    let data = res.output[0];
    await loadGlObj(data.glObj);
    await loadStopwatch(data.date);

    await setSnackbar({
        text: 'Update',
        show: true
    });

    dialogLogin.dontSave = false;

}

async function routing() {

    await jrfws.route('login', 'login', async (data, stop) => {
        await loginUserWithBackend(data.data);
    });
    await jrfws.route('login', 'logout', async (data, stop) => {
        await logout();
    });
    await jrfws.route('login', 'isBackend', async (data, stop) => {
        dialogLogin.isBackend = data.data;
        let saveObj = await getGlObj();
        await showCreateNewUser(saveObj);
    });
    await jrfws.route('login', 'encode', async (data, stop) => {
        let hashPass = data.data;
        await createNewUserWithoutBackend(hashPass);
    });
    await jrfws.route('login', 'passIsValid', async (data, stop) => {
        await loginUserWithoutBackend(data.data.okay);
    });
    await jrfws.route('login', 'changePassword', async (data, stop) => {
        await changePassword(data.data);
    });
    await jrfws.route('tasks', 'add', async (data, stop) => {
        await createNewUserWithBackend(data.data);
    });
    await jrfws.route('tasks', 'get', async (data, stop) => {
        await loadStates(data.data);
    });
    await jrfws.route('tasks', 'edit', async (data, stop) => {

        if (!data.data.okay) {
            await setSnackbar({
                text: 'Not save state',
                show: true
            });
            return;
        }

    });

}

async function convertDateInGlObj() {

    glObj.curTask.start = new Date(glObj.curTask.start);
    glObj.curTask.finish = new Date(glObj.curTask.finish);

    for (let task of glObj.tasks) {
        task.start = new Date(task.start);
        task.finish = new Date(task.finish);
    }

}

async function getPercent(num100, numPercent) {
    return numPercent / (num100 / 100);
}

async function convertMS(ms) {

    let d = 0;
    let h = 0;
    let m = 0;
    let s = 0;
    let strTime = '';

    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    h += d * 24;

    if (`${h}`.length === 1) {
        strTime += `0${h}`;
    } else {
        strTime += `${h}`;
    }

    if (`${m}`.length === 1) {
        strTime += `:0${m}`;
    } else {
        strTime += `:${m}`;
    }

    if (`${s}`.length === 1) {
        strTime += `:0${s}`;
    } else {
        strTime += `:${s}`;
    }

    return strTime;

}

async function setTitlePomodoro(strTime, text) {

    text = text || 'Pomodoro';

    if (!glObj.panel || !glObj.panel.length || glObj.panel.length < 2) {
        glObj.expansionPomodoro.text = text;
        return;
    }

    if (glObj.panel[1]) {
        glObj.expansionPomodoro.text = text;
        return;
    }

    glObj.expansionPomodoro.text = `${text} ${strTime}`;

}

async function setTitleTime(strTime, text) {

    text = text || 'Task';

    if (!glObj.panel || !glObj.panel.length || glObj.panel.length < 1) {
        glObj.expansionTime.text = text;
        return;
    }

    if (glObj.panel[0]) {
        glObj.expansionTime.text = text;
        return;
    }

    glObj.expansionTime.text = `${text} ${strTime}`;

}

let app = new Vue({
    el: '#app',
    data: {
        glObj,
        dialogLogin
    },
    computed: {
        strFooter() {
            let curYear = new Date().getFullYear();
            return `Copyright © 2018 - ${curYear}`;
        }
    },
    methods: {
        async showFilter() {
            await showFilter();
        },
        async showMainForm() {
            await showMainForm();
        },
        async navigationChangeShow() {
            await navigationChangeShow();
        }
    }
});