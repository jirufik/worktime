async function setDefaultsPomodoroSettings(show = false) {
    await setPomodoroSettings({show});
}

async function setPomodoroSettings({
                                       timePomodoro = 25,
                                       timeShortPause = 5,
                                       timeLongPause = 30,
                                       countBeforeLongPause = 4,
                                       sound = true,
                                       soundPomodoro = 'sound/pomodoro.mp3',
                                       soundPause = 'sound/pause.mp3',
                                       show = false
                                   } = {}) {

    glObj.pomodoro.timePomodoro = timePomodoro;
    glObj.pomodoro.timeShortPause = timeShortPause;
    glObj.pomodoro.timeLongPause = timeLongPause;
    glObj.pomodoro.countBeforeLongPause = countBeforeLongPause;
    glObj.pomodoro.sound = sound;
    glObj.pomodoro.soundPomodoro = soundPomodoro;
    glObj.pomodoro.soundPause = soundPause;
    glObj.pomodoro.show = show;

    if (glObj.pomodoro.timePomodoro <= 0) {
        glObj.pomodoro.timePomodoro = 1;
    }

    if (glObj.pomodoro.timeShortPause <= 0) {
        glObj.pomodoro.timeShortPause = 1;
    }

    if (glObj.pomodoro.timeLongPause <= 0) {
        glObj.pomodoro.timeLongPause = 1;
    }

    if (glObj.pomodoro.countBeforeLongPause <= 0) {
        glObj.pomodoro.countBeforeLongPause = 1;
    }

    await setPomodoro();

}

async function setPomodoro() {

    await pomodoro.stop();
    await app.$refs.pmdr.stopUpdate();
    await app.$refs.pmdr.btnSetIcon();
    pomodoro.timePomodoro = Number(glObj.pomodoro.timePomodoro) * pomodoro.partsTime.M;
    pomodoro.timeShortPause = Number(glObj.pomodoro.timeShortPause) * pomodoro.partsTime.M;
    pomodoro.timeLongPause = Number(glObj.pomodoro.timeLongPause) * pomodoro.partsTime.M;
    pomodoro.countBeforeLongPause = Number(glObj.pomodoro.countBeforeLongPause);
    pomodoro.countPomodoro = 0;

    await setSnackbar({
        text: 'Set pomodoro settings',
        show: true
    });

    await save();

}

async function loadPomodoroSettings() {

    glObj.pomodoro.timePomodoro = pomodoro.timePomodoro / pomodoro.partsTime.M;
    glObj.pomodoro.timeShortPause = pomodoro.timeShortPause / pomodoro.partsTime.M;
    glObj.pomodoro.timeLongPause = pomodoro.timeLongPause / pomodoro.partsTime.M;
    glObj.pomodoro.countBeforeLongPause = pomodoro.countBeforeLongPause;

}