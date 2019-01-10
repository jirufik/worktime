class JrfStopwatch {

    constructor() {

        this.datetimeStart = null;
        this.datetimeFinish = null;
        this.period = null;
        this.periodPauses = null;
        this.countPauses = 0;
        this.pauses = [];
        this.statusList = {
            READY: 'READY',
            RUNNING: 'RUNNING',
            SUSPENDED: 'SUSPENDED',
            COMPLETED: 'COMPLETED'
        };
        this.status = this.statusList.READY;
        this.countRounds = 0;
        this.rounds = [];
        this._datetimeFinishLastRound = null;

    }

    async setState(state) {

        this.countPauses = state.countPauses;
        this.countRounds = state.countRounds;
        if (state.datetimeFinish) {
            this.datetimeFinish = new Date(state.datetimeFinish);
        }
        if (state.datetimeStart) {
            this.datetimeStart = new Date(state.datetimeStart);
        }
        this.period = state.period;
        this.periodPauses = state.periodPauses;
        this.pauses = state.pauses;
        this.status = state.status;
        this.rounds = state.rounds;

        await this._convertToDate(this.pauses);
        await this._convertToDate(this.rounds);

    }

    async _convertToDate(arrWithDate) {

        for (let el of arrWithDate) {
            if (el.datetimeFinish) {
                el.datetimeFinish = new Date(el.datetimeFinish);
            }
            if (el.datetimeStart) {
                el.datetimeStart = new Date(el.datetimeStart);
            }
        }

    }

    async start() {

        if (!await this._compareStatus(this.statusList.READY)) {
            return false;
        }

        await this._setStatus(this.statusList.RUNNING);
        let now = new Date();
        this.datetimeStart = now;
        await this._setDatetimeFinishLastRound(now);
        return true;

    }

    async stop() {

        if (await this._compareStatus(this.statusList.RUNNING)) {
            this.datetimeFinish = new Date();
            await this._setStatus(this.statusList.COMPLETED);
            await this._calculatePeriod();
            await this._stopRound();
            return this.period;
        }

        if (await this._compareStatus(this.statusList.SUSPENDED)) {
            await this._stopPause();
            this.datetimeFinish = new Date();
            await this._setStatus(this.statusList.COMPLETED);
            await this._calculatePeriod();
            await this._stopRound();
            return this.period;
        }

        return false;

    }

    async reset() {

        this.datetimeStart = null;
        this.datetimeFinish = null;
        this.period = null;
        this.periodPauses = null;
        this.countPauses = 0;
        this.pauses = [];
        this.countRounds = 0;
        this.rounds = [];
        await this._setStatus(this.statusList.READY);

    }

    async pause() {

        if (!await this._compareStatus(this.statusList.RUNNING)
            && !await this._compareStatus(this.statusList.SUSPENDED)) {
            return false;
        }

        if (!await this._compareStatus(this.statusList.SUSPENDED)) {
            await this._startPause();
            return true;
        } else {
            await this._stopPause();
            return true;
        }

    }

    async round() {

        if (this.status === this.statusList.READY
            || this.status === this.statusList.COMPLETED) {
            return false;
        }

        if (this._datetimeFinishLastRound) {
            return await this._stopRound();
        }

        await this._startRound();

        return 0;

    }

    async getInfo() {

        if (this.status !== this.statusList.COMPLETED
            && this.status !== this.statusList.READY) {
            await this._calculatePeriod();
        }

        return {
            datetimeStart: this.datetimeStart,
            datetimeFinish: this.datetimeFinish,
            period: this.period,
            periodPauses: this.periodPauses,
            countPauses: this.countPauses,
            pauses: this.pauses,
            countRounds: this.countRounds,
            rounds: this.rounds,
            status: this.status,
            statusList: this.statusList
        }

    }

    async getCurrentPeriod() {

        await this._calculatePeriod();
        return this.period;

    }

    async _stopRound() {

        let now = this.datetimeFinish || new Date();
        let period = await this._calculatePeriodBetween(this._datetimeFinishLastRound, now);
        let periodPauses = await this._calculatePeriodPausesBetween(this._datetimeFinishLastRound, now);
        period -= periodPauses;

        this.rounds.push({
            datetimeStart: this._datetimeFinishLastRound,
            datetimeFinish: now,
            period
        });

        this.countRounds++;
        await this._setDatetimeFinishLastRound(now);

        return period;

    }

    async _startRound() {
        await this._setDatetimeFinishLastRound();
    }

    async _startPause() {

        await this._setStatus(this.statusList.SUSPENDED);
        this.pauses.push({
            datetimeStart: new Date(),
            datetimeFinish: null,
            period: 0
        });

    }

    async _stopPause() {

        let pause = this.pauses.pop();
        pause.datetimeFinish = new Date();
        pause.period = await this._calculatePeriodBetween(pause.datetimeStart, pause.datetimeFinish);
        this.pauses.push(pause);
        await this._setStatus(this.statusList.RUNNING);

    }

    async _calculatePeriod() {

        let finish = this.datetimeFinish || new Date();
        let period = await this._calculatePeriodBetween(this.datetimeStart, finish);
        let periodPauses = await this._calculatePeriodPausesBetween(this.datetimeStart, finish);
        period -= periodPauses;

        this.period = period;
        this.periodPauses = periodPauses;
        this.countPauses = this.pauses.length;

    }

    async _calculatePeriodPauses() {

        let sum = 0;

        for (let pause of this.pauses) {
            sum += pause.period;
        }

        return sum;
    }

    async _calculatePeriodPausesBetween(datetimeStart, datetimeFinish) {

        datetimeStart = datetimeStart || new Date();
        datetimeFinish = datetimeFinish || new Date();

        let sum = 0;

        for (let pause of this.pauses) {

            sum += await this._getPausePeriod(pause, datetimeStart, datetimeFinish);
        }

        return sum;
    }

    async _getPausePeriod(pause, datetimeStart, datetimeFinish) {

        datetimeStart = datetimeStart || new Date();
        datetimeFinish = datetimeFinish || new Date();
        let pauseStart = pause.datetimeStart || new Date();
        let pauseFinish = pause.datetimeFinish || new Date();

        if (pauseStart < datetimeStart && pauseFinish < datetimeStart) {
            return 0;
        }

        if (pauseStart > datetimeFinish && pauseFinish > datetimeStart) {
            return 0;
        }

        if (pauseStart < datetimeStart) {
            pauseStart = datetimeStart;
        }

        if (pauseFinish > datetimeFinish) {
            pauseFinish = datetimeFinish;
        }

        return pauseFinish - pauseStart;

    }

    async _calculatePeriodBetween(datetimeStart, datetimeFinish) {

        datetimeStart = datetimeStart || new Date();
        datetimeFinish = datetimeFinish || new Date();

        return datetimeFinish - datetimeStart;

    }

    async _setStatus(status) {
        this.status = status;
    }

    async _compareStatus(status) {
        return this.status === status;
    }

    async _setDatetimeFinishLastRound(datetime) {
        this._datetimeFinishLastRound = datetime || new Date();
    }

};

