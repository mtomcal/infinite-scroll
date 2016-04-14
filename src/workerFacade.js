export default class WorkerFacade {
    constructor(worker) {
        this.worker = new Worker(worker);
        this.callbacks = [];
        this.worker.onmessage = this.onMessage.bind(this);
    }
    onMessage(data) {
        var parsedData = JSON.parse(data.data);
        this.callbacks.forEach(function (cb) {
            if (typeof cb === 'function') {
                cb(parsedData);
            }
        });
    }
    unsubscribe(id) {
        this.callbacks[id] = null;
    }
    listen(callback) {
        this.callbacks = this.callbacks.concat([callback]);
        var id = this.callbacks.length - 1;
        return () => this.unsubscribe(id);
    }
    post(data) {
        var serializedData = JSON.stringify(data);
        this.worker.postMessage(serializedData);
    }
}



