async function showFilter() {
    glObj.filter.show = !glObj.filter.show;
}

async function setDefaultFilter(show = false) {

    let now = new Date();
    let startDate = await getStartMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    let startDateStr = await convertToDate(startDate);
    let startDatePicker = await convertDateStrToPicker(startDateStr);
    let finishDate = await getEndMonth(new Date(now.getFullYear(), now.getMonth()));
    let finishDateStr = await convertToDate(finishDate);
    let finishDatePicker = await convertDateStrToPicker(finishDateStr);

    glObj.filter = {
        show,
        startDate,
        startDateStr,
        startDatePicker,
        finishDate,
        finishDateStr,
        finishDatePicker,
        companies: [],
        excludeCompanies: false,
        tasks: [],
        excludeTasks: false,
        search: '',
        excludeSearch: false,
        projects: [],
        excludeProjects: false
    }

}

async function convertToDate(datetime) {
    try {
        let d = `${datetime.getDate()}`;
        let m = `${datetime.getMonth() + 1}`;
        let y = `${datetime.getFullYear()}`;
        if (d.length < 2) d = `0${d}`;
        if (m.length < 2) m = `0${m}`;
        return `${d}.${m}.${y}`;
    } catch (e) {
        return '01.01.2001'
    }
}

async function convertDateStrToPicker(dateStr) {

    let partsDate = dateStr.split('.');
    return `${partsDate[2]}-${partsDate[1]}-${partsDate[0]}`;

}

async function convertPickerToDateStr(datePicker) {

    let partsDate = datePicker.split('-');
    return `${partsDate[2]}.${partsDate[1]}.${partsDate[0]}`;

}

async function inputFilterDate(typeDate) {

    if (typeDate === 'start') {
        glObj.filter.startDateStr = await convertPickerToDateStr(glObj.filter.startDatePicker);
        glObj.filter.startDate = await getStartDay(await convertDateStrToDate(glObj.filter.startDateStr));
        return;
    }

    glObj.filter.finishDateStr = await convertPickerToDateStr(glObj.filter.finishDatePicker);
    glObj.filter.finishDate = await getEndDay(await convertDateStrToDate(glObj.filter.finishDateStr));

}

async function convertDateStrToDate(dateStr) {

    let partsDate = dateStr.split('.');
    let d = partsDate[0];
    let m = partsDate[1] - 1;
    let y = partsDate[2];

    return new Date(y, m, d);

}

async function getStartDay(datetime) {
    return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate(), 0,0,0);
}

async function getEndDay(datetime) {
    return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate(), 23, 59, 59);
}

async function getStartMonth(datetime) {
    return new Date(datetime.getFullYear(), datetime.getMonth(), 1, 0,0,0);
}

async function getEndMonth(datetime) {
    return new Date(datetime.getFullYear(), datetime.getMonth(), 31, 23,59,59);
}