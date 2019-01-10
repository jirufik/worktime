class JRFWS {

    constructor() {
        this.ws = null;
        this.__stop = false;
        this._routeNotFound;
        this._routes = [];
        this.url = null;
        this.reconnect = true;
        this.onopen = null;
        this.onerror = null;
        this.onclose = null;
        this.onmessage = null;
        this.compareRoute = '^_route_$|^_route_\\/|^_route_\\.';
        this.compareAct = '^_act_$';
    }

    _wait(mlsecond = 1000) {
        return new Promise(resolve => setTimeout(resolve, mlsecond));
    }

    async connectToWs(url, reconnect = true) {

        if (url && typeof url === 'string') {
            this.url = url;
        }

        if (typeof reconnect === 'boolean') {
            this.reconnect = reconnect;
        }

        if (this.ws) {
            this.ws.onerror = this.ws.onopen = this.ws.onclose = null;
            this.ws.close();
        }

        this.ws = new WebSocket(this.url);

        this.ws.onopen = async () => {
            console.log('WebSocket connection established');
            if (this.onopen && typeof this.onopen === 'function') {
                await this.onopen();
            }
        };

        this.ws.onerror = async () => {
            console.log('WebSocket error');
            if (this.onerror && typeof this.onerror === 'function') {
                await this.onerror();
            }
        };

        this.ws.onclose = async () => {
            console.log('WebSocket connection closed');
            if (this.onclose && typeof this.onclose === 'function') {
                await this.onclose();
            }
            if (this.reconnect) {
                await this._wait(500);
                await this.reconnectToWs();
            }
        };

        this.ws.onmessage = async message => {
            if (this.onmessage && typeof this.onmessage === 'function') {
                await this.onmessage();
            }
            await this._routing(message.data);
        };

    };

    async reconnectToWs() {

        if (this.ws.readyState === 3 || this.ws.readyState === 2) {
            await this._wait(500);
            await this.connectToWs(this.url, this.reconnect);
        }
        else {
            console.log(this.ws.readyState);
        }
    }

    async close() {
        this.reconnect = false;
        this.ws.close();
    }

    async _routing(mes) {

        let data = await this._parseMessage(mes);
        let stop = {
            stop: false
        };
        if (!data) {
            return;
        }

        let notFound = true;
        for (let el of this._routes) {

            if (stop.stop) {
                stop.stop = false;
                return;
            }

            if (el.act) {

                let compare = await this._getCompare('act', el.act);

                if (!compare.test(data.act)) {
                    continue;
                }

            }

            if (el.route) {

                let compare = await this._getCompare('route', el.route);

                if (!compare.test(data.route)) {
                    continue;
                }

            }

            if (el.route) {
                notFound = false;
            }

            await el.fn(data, await this._stop(stop));
        }

        if (data.route && notFound && typeof this._routeNotFound === 'function') {
            await this._routeNotFound(data, await this._stop(stop));
        }

    }

    async _getCompare(nameCompare = 'route', value = '_route_') {

        let strReplace = '_route_';
        if (nameCompare === 'act') {
            strReplace = '_act_';
        }

        if (strReplace === '_route_') {

            try {
                let compare = new RegExp(this.compareRoute.split(strReplace).join(value));
                return compare;
            } catch (e) {

            }

            return new RegExp('^_route_$|^_route_\\/|^_route_\\.'.split(strReplace).join(value));

        } else if (strReplace === '_act_') {

            try {
                let compare = new RegExp(this.compareAct.split(strReplace).join(value));
                return compare;
            } catch (e) {

            }

            return new RegExp('^_act_$'.split(strReplace).join(value));

        }

        return new RegExp('^_route_$|^_route_\\/|^_route_\\.'.split(strReplace).join(value));
    }

    async route(...opts) {

        if (!opts.length) {
            throw new Error('Invalid route');
        }

        if (opts.length > 3) {
            throw new Error('Invalid route');
        }

        let route = {};
        let indexFn = null;
        let countFn = 0;
        for (let i = 0; i < opts.length; i++) {
            if (typeof opts[i] === 'function') {
                indexFn = i;
                countFn++;
            }
        }

        if (countFn === 0 || countFn > 1) {
            throw new Error('Invalid route');
        }

        if (opts.length === 1) {

            route.fn = opts[0];

        } else if (opts.length === 2) {

            if (typeof opts[0] !== 'string') {
                throw new Error('Invalid route');
            }

            route.route = opts[0];
            route.fn = opts[1];

        } else if (opts.length === 3) {

            if (typeof opts[0] !== 'string') {
                throw new Error('Invalid route');
            }

            if (typeof opts[1] !== 'string') {
                throw new Error('Invalid route');
            }

            route.route = opts[0];
            route.act = opts[1];
            route.fn = opts[2];
        }

        if (route.route === 'not found') {
            this._routeNotFound = route.fn;
            return;
        }
        this._routes.push(route);

    }

    async _stop(self) {
        return async function () {
            self.__stop = true;
        }
    }

    async _parseMessage(mes) {

        let data = mes;

        if (typeof data !== 'object') {

            try {
                data = JSON.parse(mes);
            } catch (err) {
                return false;
            }
        }

        if (!data.data && !data.route && !data.act) {
            return false;
        }

        if (data.route && typeof data.route !== 'string') {
            return false;
        }

        if (data.act && typeof data.act !== 'string') {
            return false;
        }

        return data;

    }

    async sendMes(data, route = null, act = null) {

        try {

            if (!this.ws) {
                return;
            }

            if (this.ws.readyState !== 1) {
                return;
            }

            if (!data && !route && !act) {
                console.log('Not data');
                return false;
            }

            let mes = {
                route,
                act,
                data
            };

            this.ws.send(JSON.stringify(mes));
            return true;

        } catch (e) {
            console.log(`Error sendMes ${e}`);
        }

        return false;

    }

    async getRoutes() {

        let routes = [];
        for (let el of this._routes) {

            if (!el.route) {
                continue;
            }

            let route = {};
            for (let elRoute of routes) {
                if (elRoute.route === el.route) {
                    route = elRoute;
                    break;
                }
            }

            if (!route.route) {
                route.route = el.route;
                route.acts = [];
                routes.push(route);
            }

            if (!el.act) {
                continue;
            }

            if (route.acts.includes(el.act)) {
                continue;
            }

            route.acts.push(el.act);

        }

        return routes;

    }

}