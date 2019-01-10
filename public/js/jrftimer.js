class JrfTimer {

    constructor() {

        this.datetimeStart = null;
        this._datetimeStart = null;
        this.datetimeFinish = null;
        this._datetimeFinish = null;
        this.onStart = null;
        this.onStop = null;
        this.statusList = {
            READY: 'READY',
            RUNNING: 'RUNNING',
            COMPLETED: 'COMPLETED'
        };
        this.status = this.statusList.READY;
        this.partsTime = {
            MS: 1,
            S: 1000,
            M: 1000 * 60,
            H: 1000 * 60 * 60,
            D: 1000 * 60 * 60 * 24
        };
        this._isStart = false;
        this._objTimeout = null;

    }

    async start({datetimeStart, datetimeFinish, onStart, onStop} = {}) {

        if (this.status === this.statusList.RUNNING
            || this.status === this.statusList.COMPLETED) {
            return false;
        }

        this._isStart = true;
        await this.setOnEvent('onStart', onStart);
        await this.setOnEvent('onStop', onStop);
        await this.setDatetimeStart(datetimeStart);
        if (this._datetimeFinish) {
            await this.setDatetimeFinish(this._datetimeFinish);
        } else if (datetimeFinish) {
            await this.setDatetimeFinish(datetimeFinish);
        } else {
            await this.setDatetimeFinish(this.datetimeFinish);
        }
        this.status = this.statusList.RUNNING;

        if (new Date() >= this.datetimeStart) {

            await this._runEvent('onStart');
            await this._nextRing(null, this.datetimeFinish,
                async () => {
                    await this.stop();
                });

            return true;

        }

        await this._nextRing(null, this.datetimeStart,
            async () => {

                await this._runEvent('onStart');
                await this._nextRing(null, this.datetimeFinish,
                    async () => {
                        await this.stop();
                    });

            });
        this._isStart = false;

        return true;

    }

    async stop() {

        if (this.status !== this.statusList.RUNNING) {
            return false;
        }

        await this._stopTimeout();
        this.status = this.statusList.COMPLETED;
        await this._runEvent('onStop');

        return true;

    }

    async reset() {

        await this._stopTimeout();
        this.datetimeStart = null;
        this._datetimeStart = null;
        this.datetimeFinish = null;
        this._datetimeFinish = null;
        this.status = this.statusList.READY;
        this._isStart = false;

    }

    async setOnEvent(nameEvent, func) {

        if (typeof func !== 'function') {
            return false;
        }

        let exist = nameEvent in this;

        if (!exist) {
            return false;
        }

        this[nameEvent] = func;

        return true;

    }

    async setDatetimeStart(datetimeStart) {

        if (this.status === this.statusList.RUNNING
            || this.status === this.statusList.COMPLETED) {
            return false;
        }

        let now = new Date();

        if (this._isStart && this._datetimeStart) {
            this.datetimeStart = new Date(now.getTime() + this._datetimeStart);
            return true;
        }

        if (typeof datetimeStart === 'number'
            || typeof datetimeStart === 'string') {

            if (this._isStart) {
                this.datetimeStart = new Date(now.getTime() + await this._parseStrPeriodToMS(datetimeStart));
                return true;
            }

            this._datetimeStart = await this._parseStrPeriodToMS(datetimeStart);
            return true;
        }

        if (!datetimeStart) {
            this.datetimeStart = now;
            return true;
        }

        this.datetimeStart = datetimeStart;
        return true;

    }

    async setDatetimeFinish(datetimeFinish) {

        if (this.status === this.statusList.RUNNING
            || this.status === this.statusList.COMPLETED) {
            return false;
        }

        let now = new Date();

        if (typeof datetimeFinish === 'number'
            || typeof datetimeFinish === 'string') {

            if (this.datetimeStart) {
                this.datetimeFinish = new Date(this.datetimeStart.getTime() + await this._parseStrPeriodToMS(datetimeFinish));
                return true;
            }

            this._datetimeFinish = await this._parseStrPeriodToMS(datetimeFinish);
            return true;
        }

        if (!datetimeFinish) {
            this.datetimeFinish = now;
            return true;
        }

        this.datetimeFinish = datetimeFinish;
        return true;

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

    async _parseStrPeriodToMS(strPeriod) {

        /// Period: 1ms,1s,1m,1h,1d
        strPeriod = strPeriod || '1m';
        let period = 0;

        if (typeof strPeriod === 'number') {
            return strPeriod;
        }

        if (typeof strPeriod !== 'string') {
            return period;
        }

        strPeriod = strPeriod.replace(/ /g, '');
        let arrPeriod = strPeriod.split(',');

        for (let elPeriod of arrPeriod) {
            period += await this._getPartPeriod(elPeriod);
        }

        return period;
    }

    async _getPartPeriod(strPeriod) {

        let period = 0;

        if (!strPeriod) {
            return period;
        }

        if (strPeriod.includes('ms')) {
            period = strPeriod.replace('ms', '');
            return Number(period * this.partsTime.MS);
        }

        if (strPeriod.includes('s')) {
            period = strPeriod.replace('s', '');
            return Number(period * this.partsTime.S);
        }

        if (strPeriod.includes('m')) {
            period = strPeriod.replace('m', '');
            return Number(period * this.partsTime.M);
        }

        if (strPeriod.includes('h')) {
            period = strPeriod.replace('h', '');
            return Number(period * this.partsTime.H);
        }

        if (strPeriod.includes('d')) {
            period = strPeriod.replace('d', '');
            return Number(period * this.partsTime.D);
        }

        return 0;

    }

    async _getPeriodBetween(datetimeStart, datetimeFinish) {

        datetimeStart = datetimeStart || new Date();
        datetimeFinish = datetimeFinish || new Date();

        let res = {
            d: 0,
            h: 0,
            m: 0,
            s: 0,
            ms: 0
        };

        let period = datetimeFinish - datetimeStart;

        res.d = period / this.partsTime.D;
        res.h = period / this.partsTime.H;
        res.m = period / this.partsTime.M;
        res.s = period / this.partsTime.S;
        res.ms = period / this.partsTime.MS;

        return res;

    }

    async _nextRing(datetimeStart, datetimeFinish, cb) {

        if (this.status !== this.statusList.RUNNING) {
            return false;
        }

        let period = await this._getPeriodBetween(datetimeStart, datetimeFinish);

        if (period.d > 1) {
            this._objTimeout = setTimeout(() => this._nextRing(datetimeStart, datetimeFinish, cb), this.partsTime.D);
            return;
        }

        if (period.h > 1) {
            this._objTimeout = setTimeout(() => this._nextRing(datetimeStart, datetimeFinish, cb), this.partsTime.H);
            return;
        }

        if (period.m > 1) {
            this._objTimeout = setTimeout(() => this._nextRing(datetimeStart, datetimeFinish, cb), this.partsTime.M);
            return;
        }

        if (period.s > 1) {
            this._objTimeout = setTimeout(() => this._nextRing(datetimeStart, datetimeFinish, cb), this.partsTime.S);
            return;
        }

        if (period.ms > 500) {
            this._objTimeout = setTimeout(() => this._nextRing(datetimeStart, datetimeFinish, cb), this.partsTime.MS * 500);
            return;
        }

        if (period.ms > 100) {
            this._objTimeout = setTimeout(() => this._nextRing(datetimeStart, datetimeFinish, cb), this.partsTime.MS * 100);
            return;
        }

        if (period.ms > 20) {
            this._objTimeout = setTimeout(() => this._nextRing(datetimeStart, datetimeFinish, cb), this.partsTime.MS * 20);
            return;
        }

        if (period.ms > 10) {
            this._objTimeout = setTimeout(() => this._nextRing(datetimeStart, datetimeFinish, cb), this.partsTime.MS * 10);
            return;
        }

        if (period.ms > 4) {
            this._objTimeout = setTimeout(() => this._nextRing(datetimeStart, datetimeFinish, cb), this.partsTime.MS * 4);
            return;
        }

        await cb();

    }

    async _stopTimeout() {

        if (this._objTimeout) {
            clearTimeout(this._objTimeout);
            this._objTimeout = null;
        }

    }

}