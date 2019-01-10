async function setDefaultCurTask(clearTask = false) {

    if (clearTask) {

        glObj.curTask = {
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
        };

    } else {

        glObj.curTask = {
            company: glObj.curTask.company,
            project: glObj.curTask.project,
            task: glObj.curTask.task,
            description: glObj.curTask.description,
            start: 0,
            startTimeStr: '00:00:00',
            finish: 0,
            finishTimeStr: '00:00:00',
            period: 0,
            periodStr: '00:00:00',
            pause: 0,
            pauseStr: '00:00:00',
            price: glObj.curTask.price,
            pricePerHour: glObj.curTask.pricePerHour,
            cost: glObj.curTask.cost
        };

    }

}

async function getProjectsList(projects) {

    let list = [];
    for (let project of projects) {

        if (list.includes(project.project)) {
            continue;
        }

        list.push(project.project);
    }

    return list;

}

async function fillProjectsList() {
    let list = await getProjectsList(glObj.tasks);
    glObj.projectsList = list;
}

async function getTasksList(tasks) {

    let list = [];
    for (let task of tasks) {

        if (list.includes(task.task)) {
            continue;
        }

        list.push(task.task);
    }

    return list;

}

async function fillTasksList() {
    let list = await getTasksList(glObj.tasks);
    glObj.tasksList = list;
}

async function getCompanyList(tasks) {

    let list = [];
    for (let task of tasks) {

        if (list.includes(task.company)) {
            continue;
        }

        list.push(task.company);
    }

    return list;

}

async function fillCompanyList() {
    let list = await getCompanyList(glObj.tasks);
    glObj.companiesList = list;
}

async function convertDatetimeInTimeMsOfDay(datetime = new Date()) {

    const startDay = await getStartDay(datetime);
    let time = datetime - startDay;
    return time;

}

async function fillTaskStart(datetime = new Date()) {

    let curTask = glObj.curTask;
    curTask.start = datetime;
    let time = await convertDatetimeInTimeMsOfDay(datetime);
    time = await convertMS(time);
    curTask.startTimeStr = time;
    await save();

}

async function fillTaskStop() {

    let curTask = glObj.curTask;
    let info = await stopwatch.getInfo();
    curTask.finish = info.datetimeFinish;
    let time = await convertDatetimeInTimeMsOfDay(info.datetimeFinish);
    time = await convertMS(time);
    curTask.finishTimeStr = time;
    curTask.period = info.period;
    curTask.periodStr = await convertMS(curTask.period);
    curTask.pause = info.periodPauses;
    curTask.pauseStr = await convertMS(curTask.pause);
    await recountCost(curTask);
    glObj.tasks.push(curTask);
    await setDefaultCurTask();
    await fillTasksList();
    await fillCompanyList();
    await fillProjectsList();
    await save();

}

async function getStartDay(datetime) {
    return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate());
}

async function recountTimes(task) {

    let startMs = await convertTimeStrToMs(task.startTimeStr);
    let startDay = await getStartDay(task.start);
    task.start = new Date(startDay.getTime() + startMs);

    let finishMs = await convertTimeStrToMs(task.finishTimeStr);
    startDay = await getStartDay(task.finish);
    task.finish = new Date(startDay.getTime() + finishMs);

    task.pause = await convertTimeStrToMs(task.pauseStr);

    task.period = task.finish.getTime() - task.start.getTime() - task.pause;
    task.periodStr = await convertMS(task.period);
    await recountCost(task);

}

async function convertTimeStrToMs(timeStr) {

    let ms = 0;
    let partsTime = timeStr.split(':');
    if (!partsTime.length || partsTime.length !== 3) {
        return ms;
    }

    ms += Number(partsTime[0]) * pomodoro.partsTime.H;
    ms += Number(partsTime[1]) * pomodoro.partsTime.M;
    ms += Number(partsTime[2]) * pomodoro.partsTime.S;

    return ms;

}

async function recountCost(task) {

    if (!task.price || !task.period) {
        task.cost = 0;
        return;
    }

    if (typeof task.price === 'string') {
        task.price = Number(task.price);
    }

    if (!task.pricePerHour) {
        task.cost = task.price;
        return;
    }

    let hours = task.period / pomodoro.partsTime.H;
    task.cost = Number((hours * task.price).toFixed(2));

    await save();

}