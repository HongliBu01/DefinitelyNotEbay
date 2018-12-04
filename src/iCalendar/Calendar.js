// import moment from 'moment';
// import ics from 'ics';
// import saveAs from 'file-saver';
//
// class Calendar {
//     metrics = {
//         url: 'google.com',
//         status: 'CONFIRMED',
//         categories: ['item-notification'],
//     };
//
//     constructor() {
//         this.createIcs = this.createIcs.bind(this);
//     }
//
//     createIcs(item, description, start_time, end_time) {
//         this.metrics.title = item;
//         this.metrics.description = description;
//         this.metrics.start = start_time;
//         this.metrics.end = end_time;
//         ics.createEvent(this.metrics, (err, val) =>{
//             if (err) {
//                 console.log(err)
//             } else {
//                 console.log(val);
//                 const blob = new Blob(val, {type:`text/plain;charset=utf-8`})
//                 saveAs(blob, 'event.ics')
//             }
//         })
//     }
// }
//
// export default Calendar