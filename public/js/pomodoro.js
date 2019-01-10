class Pomodoro {

    constructor({
                    timePomodoro,
                    timeShortPause,
                    timeLongPause,
                    countPomodoro,
                    countBeforeLongPause,
                    onStart,
                    onStop,
                    onPomodoro,
                    onShortPause,
                    onLongPause
                } = {}) {

        this.partsTime = {
            MS: 1,
            S: 1000,
            M: 1000 * 60,
            H: 1000 * 60 * 60,
            D: 1000 * 60 * 60 * 24
        };
        this.timePomodoro = timePomodoro || 25 * this.partsTime.M;
        this.timeShortPause = timeShortPause || 5 * this.partsTime.M;
        this.timeLongPause = timeLongPause || 5 * this.partsTime.M;
        this.countPomodoro = countPomodoro || 0;
        this.countBeforeLongPause = countBeforeLongPause || 4;
        this.onStart = onStart || null;
        this.onStop = onStop || null;
        this.onPomodoro = onPomodoro || null;
        this.onShortPause = onShortPause || null;
        this.onLongPause = onLongPause || null;
        this.statusList = {
            STOP: 'STOP',
            POMODORO: 'POMODORO',
            SHORT_PAUSE: 'SHORT_PAUSE',
            LONG_PAUSE: 'LONG_PAUSE'
        };
        this.status = this.statusList.STOP;
        this._timer = new JrfTimer();
        this.curTime = 0;
        this.startWith = 0;

    }

    async getState() {
        return {
            partsTime: this.partsTime,
            timePomodoro: this.timePomodoro,
            timeShortPause: this.timeShortPause,
            timeLongPause: this.timeLongPause,
            countPomodoro: this.countPomodoro,
            countBeforeLongPause: this.countBeforeLongPause,
            onStart: this.onStart,
            onStop: this.onStop,
            onPomodoro: this.onPomodoro,
            onShortPause: this.onShortPause,
            onLongPause: this.onLongPause,
            statusList: this.statusList,
            status: this.status,
            curTime: this.curTime
        }
    }

    async setState({
                       timePomodoro,
                       timeShortPause,
                       timeLongPause,
                       countPomodoro,
                       countBeforeLongPause,
                       onStart,
                       onStop,
                       onPomodoro,
                       onShortPause,
                       onLongPause,
                       status,
                       curTime
                   } = {}) {

        this.partsTime = {
            MS: 1,
            S: 1000,
            M: 1000 * 60,
            H: 1000 * 60 * 60,
            D: 1000 * 60 * 60 * 24
        };
        this.timePomodoro = timePomodoro || 25 * this.partsTime.M;
        this.timeShortPause = timeShortPause || 5 * this.partsTime.M;
        this.timeLongPause = timeLongPause || 30 * this.partsTime.M;
        this.countPomodoro = countPomodoro || 0;
        this.countBeforeLongPause = countBeforeLongPause || 4;
        this.statusList = {
            STOP: 'STOP',
            POMODORO: 'POMODORO',
            SHORT_PAUSE: 'SHORT_PAUSE',
            LONG_PAUSE: 'LONG_PAUSE'
        };
        this.status = status || this.statusList.STOP;
        this._timer = new JrfTimer();
        this.curTime = curTime || 0;
        this.startWith = curTime || 0;

        if (this.status === this.statusList.STOP) {
            this.startWith = 0;
            return;
        }

        await this._nextRun();

    }

    async start() {
        this.countPomodoro = 0;
        this.status = this.statusList.STOP;
        await this._timer.reset();
        await this._runEvent('onStart');
        await this._nextRun();
    }

    async stop() {
        this.countPomodoro = 0;
        this.status = this.statusList.STOP;
        await this._timer.reset();
        await this._runEvent('onStop');
    }

    async _nextRun() {

        await this._timer.start({
            onStop: async () => {

                if (this.startWith) {
                    await this._loadRun();
                    return;
                }

                await this._startRun();

            }
        });

    }

    async _startRun() {

        if (this.status === this.statusList.POMODORO) {

            this.countPomodoro++;
            let isLong = await this._isLongPause();

            if (isLong) {
                this.status = this.statusList.LONG_PAUSE;
                await this._runEvent('onLongPause');
                await this._timer.reset();
                await this._timer.start({
                    datetimeFinish: this.timeLongPause
                });
                return;
            }

            this.status = this.statusList.SHORT_PAUSE;
            await this._runEvent('onShortPause');
            await this._timer.reset();
            await this._timer.start({
                datetimeFinish: this.timeShortPause
            });

            return;
        }

        let isLong = await this._isLongPause();
        if (isLong) {
            this.countPomodoro = 0;
        }
        this.status = this.statusList.POMODORO;
        await this._runEvent('onPomodoro');
        await this._timer.reset();
        await this._timer.start({
            datetimeFinish: this.timePomodoro
        });
    }

    async _loadRun() {

        if (this.status === this.statusList.POMODORO) {
            let datetimeFinish = this.timePomodoro - this.startWith;
            await this._timer.reset();
            await this._timer.start({
                datetimeFinish
            });
            this.startWith = 0;
            return;
        }

        if (this.status === this.statusList.SHORT_PAUSE) {
            let datetimeFinish = this.timeShortPause - this.startWith;
            await this._timer.reset();
            await this._timer.start({
                datetimeFinish
            });
            this.startWith = 0;
            return;
        }

        if (this.status === this.statusList.LONG_PAUSE) {
            let datetimeFinish = this.timeLongPause - this.startWith;
            await this._timer.reset();
            await this._timer.start({
                datetimeFinish
            });
        }

        this.startWith = 0;

    }

    async _isLongPause() {
        return this.countPomodoro === this.countBeforeLongPause;
    }

    async _runEvent(nameEvent) {

        if (!this[nameEvent] in this) {
            return;
        }

        if (typeof this[nameEvent] !== 'function') {
            return;
        }

        await this[nameEvent]();

    }

}