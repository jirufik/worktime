Vue.component('pomodoro', {
    data: function () {
        return {
            glObj,
            pomodoro,
            pomodoroCircle: {
                rotate: 360,
                size: 150,
                width: 10,
                value: 0,
                color: "deep-orange"
            },
            countCircle: {
                rotate: 360,
                size: 100,
                width: 8,
                value: 0,
                color: "indigo"
            },
            btnIcon: 'play_arrow',
            period: '00:00:00',
            timerUpdate: new JrfTimer(),
            stopwatchUpdate: new JrfStopwatch()
        }
    },
    computed: {
        strPomodoro: function () {
            if (this.pomodoro.status === this.pomodoro.statusList.POMODORO) {
                return 'Pomodoro';
            }
            if (this.pomodoro.status === this.pomodoro.statusList.LONG_PAUSE) {
                return 'Long pause';
            }
            if (this.pomodoro.status === this.pomodoro.statusList.SHORT_PAUSE) {
                return 'Short pause';
            }
            if (this.pomodoro.status === this.pomodoro.statusList.STOP) {
                return 'Start';
            }
            return 'Start';
        }
    },
    methods: {
        btnClick: async function () {
            this.pomodoroCircle.color = 'deep-orange';
            if (this.pomodoro.status === this.pomodoro.statusList.STOP) {
                await this.pomodoro.start();
                await this.startUpdate();
                await setSnackbar({
                    text: 'Pomodoro start',
                    show: true
                });
            } else {
                await this.pomodoro.stop();
                await this.stopUpdate();
                await setSnackbar({
                    text: 'Pomodoro stop',
                    show: true
                });
            }
            await this.btnSetIcon();
            await save();
        },
        btnSetIcon: async function () {
            if (this.pomodoro.status === this.pomodoro.statusList.STOP) {
                this.btnIcon = 'play_arrow';
            } else {
                this.btnIcon = 'stop';
            }
        },
        async fillValueCircles(period) {
            if (this.pomodoro.status === this.pomodoro.statusList.POMODORO) {
                this.pomodoroCircle.value = await getPercent(this.pomodoro.timePomodoro, period);
                this.pomodoroCircle.color = 'deep-orange';
                glObj.expansionPomodoro.class = 'display-1 deep-orange--text';
            }
            if (this.pomodoro.status === this.pomodoro.statusList.LONG_PAUSE) {
                this.pomodoroCircle.value = await getPercent(this.pomodoro.timeLongPause, period);
                this.pomodoroCircle.color = 'light-green';
                glObj.expansionPomodoro.class = 'display-1 light-green--text';
            }
            if (this.pomodoro.status === this.pomodoro.statusList.SHORT_PAUSE) {
                this.pomodoroCircle.value = await getPercent(this.pomodoro.timeShortPause, period);
                this.pomodoroCircle.color = 'light-green';
                glObj.expansionPomodoro.class = 'display-1 light-green--text';
            }
            if (this.pomodoro.status === this.pomodoro.statusList.STOP) {
                this.pomodoroCircle.value = 0;
                this.pomodoroCircle.color = 'deep-orange';
                glObj.expansionPomodoro.class = 'display-1 deep-orange--text';
            }
            this.countCircle.value = await getPercent(this.pomodoro.countBeforeLongPause, this.pomodoro.countPomodoro);
        },
        async startUpdate(startPeriod) {
            await this.stopwatchUpdate.start();
            if (startPeriod) {
                let dateStart = this.stopwatchUpdate.datetimeStart.getTime();
                this.stopwatchUpdate.datetimeStart = new Date(dateStart - startPeriod);
            }
            await this.timerUpdate.start({
                datetimeFinish: '1s',
                onStop: async () => {
                    let info = await this.stopwatchUpdate.getInfo();
                    this.period = await convertMS(info.period);
                    await setTitlePomodoro(this.period, this.strPomodoro);
                    await this.fillValueCircles(info.period);
                    this.pomodoro.curTime = info.period;
                    await this.timerUpdate.reset();
                    await this.timerUpdate.start({
                        datetimeFinish: '1s'
                    });
                }
            });
        },
        async stopUpdate() {
            this.pomodoroCircle.value = 100;
            await this.timerUpdate.stop();
            await this.timerUpdate.reset();
            await this.stopwatchUpdate.stop();
            await this.stopwatchUpdate.reset();
            this.period = '00:00:00';
            await setTitlePomodoro(this.period, this.strPomodoro);
            this.pomodoroCircle.value = 0;
            this.pomodoro.curTime = 0;
        },
        async setState() {
            if (this.pomodoro.status !== this.pomodoro.statusList.STOP) {
                await this.startUpdate(this.pomodoro.curTime);
                await this.btnSetIcon();
            }
        },
        async openSettings() {
            await loadPomodoroSettings();
            glObj.pomodoro.show = true;
        },
        async play(sound = 'pomodoro') {
            await this.stop(sound);
            if (!glObj.pomodoro.sound) {
                return;
            }
            this.$refs[`audio${sound}`].play();

        },
        async stop(sound) {
            this.$refs[`audio${sound}`].pause();
            this.$refs[`audio${sound}`].currentTime = 0;
        }
    },
    template: `
    <v-container>
        <v-layout justify-center>
            <v-progress-circular
                :rotate="pomodoroCircle.rotate"
                :size="pomodoroCircle.size"
                :width="pomodoroCircle.width"
                :value="pomodoroCircle.value"
                :color="pomodoroCircle.color"
             >
                 <v-layout column 
                           justify-center>
                    <v-flex align-self-center>{{strPomodoro}}</v-flex>
                    <v-flex align-self-center>{{period}}</v-flex>
                    <v-flex align-self-center>
                        <v-btn flat icon 
                               :color="pomodoroCircle.color" 
                               @click="btnClick"> 
                                    <v-icon>{{btnIcon}}</v-icon>
                         </v-btn>
                     </v-flex>
                </v-layout>                    
            </v-progress-circular>
            <v-progress-circular
                :rotate="countCircle.rotate"
                :size="countCircle.size"
                :width="countCircle.width"
                :value="countCircle.value"
                :color="countCircle.color"
             >
                <v-flex align-self-center>Count</v-flex>
                <v-flex align-self-center>{{pomodoro.countPomodoro}} of {{pomodoro.countBeforeLongPause}}</v-flex>
            </v-progress-circular>
            <v-btn
                flat 
                icon                 
                color="grey lighten-2"
                @click="openSettings"
            >
                <v-icon>settings</v-icon>
            </v-btn>
        </v-layout>
        <audio ref="audiopomodoro" 
               :src="glObj.pomodoro.soundPomodoro"
        ></audio>
        <audio ref="audiopause" 
               :src="glObj.pomodoro.soundPause"
        ></audio>
    </v-container>
    `
});
