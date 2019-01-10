Vue.component('stopwatch', {
    data: function () {
        return {
            period: '00:00:00',
            timerUpdate: new JrfTimer(),
            playDisabled: false,
            pauseDisabled: true,
            stopDisabled: true,
            colorPause: 'indigo'
        }
    },
    methods: {
        async setState() {
            if (stopwatch.status === stopwatch.statusList.SUSPENDED) {
                await this.setColorPause('blue');
                await this.setButtonDisabled(true, false, false);
                await this.startUpdate();
            } else if (stopwatch.status === stopwatch.statusList.RUNNING) {
                await this.setColorPause();
                await this.setButtonDisabled(true, false, false);
                await this.startUpdate();
            } else if (stopwatch.status === stopwatch.statusList.COMPLETED) {
                await this.setColorPause();
                await this.setButtonDisabled(false, true, true);
                this.period = await convertMS(stopwatch.period);
                await setTitleTime(this.period);
                await this.startUpdate();
            }
        },
        async setButtonDisabled(play = true, pause = true, stop = true) {
            this.playDisabled = play;
            this.pauseDisabled = pause;
            this.stopDisabled = stop;
        },
        async startUpdate() {
            await this.timerUpdate.start({
                datetimeFinish: '1s',
                onStop: async () => {
                    let info = await stopwatch.getInfo();
                    this.period = await convertMS(info.period);
                    await setTitleTime(this.period);
                    await this.timerUpdate.reset();
                    await this.timerUpdate.start({
                        datetimeFinish: '1s'
                    });
                }
            });
        },
        async stopUpdate() {
            await this.timerUpdate.stop();
            await this.timerUpdate.reset();
        },
        async start() {
            await this.setButtonDisabled(true, false, false);
            await stopwatch.reset();
            await stopwatch.start();
            await this.startUpdate();
            await this.setColorPause();
            await fillTaskStart();
            await setSnackbar({
                text: 'Task start',
                show: true
            });
        },
        async stop() {
            await this.setButtonDisabled(false, true, true);
            await stopwatch.stop();
            await this.stopUpdate();
            await this.setColorPause();
            await fillTaskStop();
            await setSnackbar({
                text: 'Task stop',
                show: true
            });
        },
        async pause() {
            await stopwatch.pause();
            if (stopwatch.status === stopwatch.statusList.SUSPENDED) {
                await this.setColorPause('blue');
                await setSnackbar({
                    text: 'Task suspended',
                    show: true
                });
            } else {
                await this.setColorPause();
                await setSnackbar({
                    text: 'Task renewed',
                    show: true
                });
            }
            await save();
        },
        async setColorPause(color = 'indigo') {
            this.colorPause = color;
        }
    },
    template: `
    <v-container>
        <v-layout justify-center>
            <h3 class="display-2 indigo--text">{{period}}</h3>
        </v-layout>
        <v-layout row justify-center>
            <v-btn outline color="indigo" 
                   @click="start" 
                   :disabled="playDisabled">
                <v-icon>play_arrow</v-icon>
            </v-btn>
            <v-btn outline :color="colorPause" 
                   @click="pause" 
                   :disabled="pauseDisabled">
                <v-icon>pause</v-icon>
            </v-btn>
            <v-btn outline color="indigo" 
                   @click="stop" 
                   :disabled="stopDisabled">
                <v-icon>stop</v-icon>
            </v-btn>
        </v-layout>
        <v-layout justify-center>
            <task></task>
        </v-layout>
    </v-container>
    `
});

