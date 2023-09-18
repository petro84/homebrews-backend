const db = require('./modules/firebase');
const scanner = require('./modules/scanner');

const scan = new scanner();

let stopped = true;
let intervals = undefined;
let docName = undefined;

// *************************
//    Database Functions
// *************************
db.ref('settings').on('value', (snapshot) => {
    setupDocuments(snapshot.val());
})

// *************************
//     Scanner Functions
// *************************
const setupDocuments = ({ brewActive, brewName, brewInterval }) => {
    clearInterval(intervals);
    intervals = undefined;

    if (brewActive) {
        docName = (brewName === '' ? undefined : brewName);

        intervals = setInterval(() => {
           if (stopped) {
            scan.startScan().then(() => stopped = false);
           } 
        }, brewInterval);
    } else {
        stopped = true;
        docName = undefined;
        scan.stopScan();
    }
}

scan.onAdvertisement = (beacon) => {
    scan.stopScan();

    db.ref(docName)
        .push(beacon)
        .then(() => stopped = true);
}