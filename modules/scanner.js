module.exports = class Scanner {
    constructor() {
        this.noble = undefined;
        this.onAdvertisement = undefined;
        this.initialized = false;
        this.is_scanning = false;

        this.tilt_devices = {
            'a495bb10c5b14b44b5121370f02d74de':'Red',
            'a495bb20c5b14b44b5121370f02d74de':'Green',
            'a495bb30c5b14b44b5121370f02d74de':'Black',
            'a495bb40c5b14b44b5121370f02d74de':'Purple',
            'a495bb50c5b14b44b5121370f02d74de':'Orange',
            'a495bb60c5b14b44b5121370f02d74de':'Blue',
            'a495bb70c5b14b44b5121370f02d74de':'Pink'
        }

        try {
            this.noble = require('@abandonware/noble');
        } catch (err) {
            console.error('Unable to create scanner object.');
        }
    }

    startScan() {
        return new Promise((resolve, reject) => {
            this._init()
            .then(() => this._scan())
            .then(() => resolve())
            .catch((err) => reject(err))
        });
    }

    stopScan() {
        this.noble.removeAllListeners('discover');
        if (this.is_scanning) {
            this.noble.stopScanning();
            this.is_scanning = false;
        }
    }

    _init() {
        return new Promise((resolve, reject) => {
            this.initialized = false;

            if (this.noble.state === 'poweredOn') {
                this.initialized = true;
                resolve();
            } else {
                this.noble.once('stateChange', (state) => {
                    if (state === 'poweredOn') {
                        this.initialized = true;
                        resolve();
                    } else {
                        reject(new Error('Failed to create scanner!'));
                    }
                })
            }
        });
    }

    _parse(peripheral) {
        let ads = peripheral.advertisement;
        let manData = ads.manufacturerData;
        let data = undefined;

        if (manData && manData.length >= 4 && manData.readUInt32BE(0) === 0x4c000215) {
            if (manData.length < 25) {
                return data;
            }

            let uid = manData.slice(4,20).toString('hex');
            let beacon = {
                uuid,
                color: this.tilt_devices[uuid],
                temp: manData.slice(20,22).readUInt16BE(0),
                gravity: manData.slice(22,24).readUInt16BE(0) / 1000,
                timestamp: Date.now()
            }

            data = beacon;
        }

        return data;
    }

    _scan() {
        return new Promise((resolve, reject) => this.noble.startScanning([], true, (error) => {
            if (error) {
                reject(error);
            } else {
                this.noble.on('discover', (peripheral) => {
                    if (this.onAdvertisement && typeof(this.advertisement) === 'function') {
                        let parsed = this._parse(peripheral);
                        if (parsed) {
                            this.onAdvertisement(parsed);
                        }
                    }
                });
                this.is_scanning = true;
                resolve();
            }
        }));
    }
}