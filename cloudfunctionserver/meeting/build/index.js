"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myapiservice = void 0;
const baseserver_1 = require("./common/baseserver");
// IMPORTANT : IF YOU NEED TO MODIFY baseserver.ts or bigquery.ts you MUST TEST OTHER SERVICE AND ALIGN ALL OF THEM
class MyAPI extends baseserver_1.SimpleBaseService {
    // Effectue la request, typiquement la seule place a modifier.
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.req.method) {
                case "GET":
                    console.log("enter get function");
                    yield this.meeting_get();
                    break;
                case "POST":
                    console.log("enter post function");
                    yield this.meeting_post();
                    break;
                case "PUT":
                    yield this.meeting_put();
                    break;
                case "DELETE":
                    yield this.meeting_delete();
                    break;
                default:
                    throw ({ error: 400, msg: "Méthode non supportée" });
            }
        });
    }
    meeting_post() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO faire une validation des info reçu
            //console.log(this.req);
            const urlElement = this.req.path.split('/');
            console.log(urlElement);
            // cloud function, length - 1
            if (urlElement.length === 2) {
                let creator = urlElement[1];
                console.log(creator);
                const meeting = this.req.body;
                let meeting_num = yield this.myDB.queryDB({
                    table: 'meeting',
                    fields: 'count(meeting_id) as count',
                    where: `creator = '${creator}'`
                });
                let newMeetingId = meeting_num[0].count + 1;
                let crypto = require('crypto');
                let hash = crypto.createHash('sha256');
                let code = hash.update("mysaltis88" + new Date().getTime());
                code = hash.digest('hex');
                // assign share codes
                let shareAdmin = this.generateRandomShareCode();
                let shareVisiter;
                do {
                    shareVisiter = this.generateRandomShareCode();
                } while (shareAdmin == shareVisiter);
                shareAdmin += '-' + newMeetingId;
                shareVisiter += '-' + newMeetingId;
                yield this.myDB.insertDB('meeting', [
                    {
                        'meeting_id': newMeetingId,
                        'title': meeting.title,
                        'describe': meeting.describe,
                        'location': meeting.location,
                        'deadline': meeting.deadline,
                        'create_date': new Date(),
                        'creator': creator,
                        'token': code,
                        'editor_link': shareAdmin,
                        'visiter_link': shareVisiter
                    }
                ]);
                this.addingDates(newMeetingId, meeting.dates);
                // await this.myDB.insertDB('meet_date', dates_meetings);
                this.send_success(this.res, {
                    id: newMeetingId,
                    token: code,
                });
            }
            else {
                this.send_failure(this.res, 404, this.make_error("error", "Le lien n'est pas valide"));
            }
        });
    }
    // to be tested ---------------
    meeting_put() {
        return __awaiter(this, void 0, void 0, function* () {
            const urlElement = this.req.path.split('/');
            const token = this.req.headers.authorization;
            const meeting = this.req.body;
            console.log(token);
            const id = parseInt(urlElement[1]);
            // update meeting
            const result = yield this.myDB.queryDBRaw(`UPDATE \`${this.myDB.dataset}.meeting\`
            SET 
                title = \`${meeting.title}\`,
                describe = \`${meeting.describe}\`,
                location = \`${meeting.location}\`,
                deadline = \`${meeting.deadline}\`,
                last_modif = \`${meeting.last_modif}\`,
            WHERE meeting_id = \`${id}\` and token = \`${token}\`;
            `);
            // update dates (only adding dates)
            this.addingDates(meeting.meeting_id, meeting.dates);
            console.log(result);
            this.send_success(this.res, "mise à jour avec succes");
        });
    }
    // pour localhost
    meeting_get() {
        // TODO A Implémenter
        console.log('path', this.req.path);
        const urlElement = this.req.path.split('/');
        console.log(urlElement);
        if (urlElement[1] === 'meeting' && urlElement.length > 2 && urlElement[urlElement.length - 1] != '') {
            if (urlElement[2] === 'u') {
                if (urlElement.length === 5) {
                    this.getMeetingByID(urlElement[3], urlElement[4]);
                }
            }
            if (urlElement[2] === 's') {
                this.getMeetingBySharedLink(urlElement[3]);
            }
        }
        else {
            this.send_failure(this.res, 404, this.make_error("error", "Le lien n'est pas valide"));
        }
    }
    // get for cloud function
    // meeting_get() {
    //     // TODO A Implémenter
    //     //console.log('path', this.req.path);
    //     const urlElement = this.req.path.split('/');
    //     console.log(urlElement);
    //     if ( urlElement.length > 2 && urlElement[urlElement.length-1] !='') {
    //         if (urlElement[1] === 'u') {
    //                 this.getMeetingByID(urlElement[2], urlElement[3]);
    //         } 
    //         if (urlElement[1]==='s'){
    //             this.getMeetingBySharedLink(urlElement[2]);
    //         }
    //     }
    //     else {
    //         this.send_failure(this.res, 404, this.make_error("error", "Le lien n'est pas valide"))
    //     }
    // }
    // to be tested
    meeting_delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const urlElement = this.req.path.split('/');
            if (urlElement.length == 3) {
                const creator = urlElement[1];
                const id = urlElement[2];
                const token = this.req.headers.authorization;
                try {
                    yield this.myDB.queryDBRaw(`DELETE FROM \`${this.myDB.dataset}.meeting\`
                    WHERE meeting_id = \`${id}\` and token = \`${token}\` and creator = \`${creator}\`;
                    `);
                    this.send_success(this.res, true);
                }
                catch (err) {
                    this.send_failure(this.res, 400, this.make_error("error", "info fourni n'est pas correcte"));
                }
            }
            else {
                this.sendNotFoundError();
            }
        });
    }
    // all get methodes related
    // async getAllMeetings(username: string){
    //     console.log(username);
    //     const allMeetings = await this.myDB.queryDB(
    //         {
    //             table: 'meeting',
    //             fields: 'meeting_id, title, location, deadline',
    //             where: `creator = '${username}'`
    //         }
    //     )
    //     if (allMeetings.length !== 0){
    //         console.log(allMeetings);
    //         this.send_success(this.res, allMeetings)
    //     }
    //     else{
    //         this.send_failure(this.res, 404, this.make_error("error", "Pas trouvé"))
    //     }
    // }
    // get meeting + dates + participants
    getMeetingBySharedLink(code) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log('code', code);
            let id = parseInt(code.split('-')[1]);
            //console.log('id', id);
            const oneMeeting = yield this.myDB.queryDB({
                table: 'meeting',
                fields: 'meeting_id, title, describe, location, deadline, create_date, editor_link, visiter_link, token',
                where: `meeting_id = ${id}`
            });
            //console.log('oneMeeting', oneMeeting);
            //console.log('verification des variable');
            // getting dates, an array
            const dates = yield this.myDB.queryDBRaw(`SELECT date_id, d_start, d_end, count(date_part_id) AS vote
            FROM \`${this.myDB.dataset}.meet_date\`
            INNER JOIN \`${this.myDB.dataset}.date\` USING (date_id)
            LEFT JOIN \`${this.myDB.dataset}.date_part\` USING (date_id)
            WHERE meeting_id = ${id}
            GROUP BY date_id, d_start, d_end
            ORDER BY vote DESC;
            `);
            console.log('dates', dates);
            if (oneMeeting.length === 1) {
                console.log(oneMeeting);
                if (oneMeeting[0].editor_link == code) {
                    // adding participants info
                    const participants = yield this.myDB.queryDBRaw(`SELECT part_id, CONCAT(CONCAT(first_name, ' ') , last_name) AS name, date_id 
                    FROM \`${this.myDB.dataset}.participant\`
                    LEFT JOIN \`${this.myDB.dataset}.date_part\` USING (part_id)
		            LEFT JOIN \`${this.myDB.dataset}.date\` USING (date_id)
		            LEFT JOIN \`${this.myDB.dataset}.meet_date\` USING (date_id)
                    WHERE meeting_id = ${id}
                    ORDER BY part_id`);
                    console.log('participants', participants);
                    // eliminate duplicate 
                    let participants_distinct = [];
                    let part_id;
                    let dates_id = [];
                    if (participants.length != 0) {
                        part_id = participants[0].part_id;
                        for (let i = 0; i < participants.length; i++) {
                            part_id = participants[i].part_id;
                            if (part_id != participants[i].part_id) {
                                // return an object of partcipant info
                                participants_distinct.push({
                                    part_id: part_id,
                                    name: participants[i].name,
                                    vote_date_ids: dates_id
                                });
                                part_id = participants[i].part_id;
                                dates_id = [];
                            }
                            else {
                                dates_id.push(participants[i].date_id);
                            }
                        }
                    }
                    console.log('participants_distinct', participants_distinct);
                    this.send_success(this.res, {
                        meet_info: oneMeeting[0],
                        vote_dates: dates,
                        parts_info: participants_distinct
                    });
                }
                else if (oneMeeting[0].visiter_link === code) {
                    this.send_success(this.res, {
                        meet_info: {
                            'meeting_id': oneMeeting[0].meeting_id,
                            'title': oneMeeting[0].title,
                            'describe': oneMeeting[0].describe,
                            'location': oneMeeting[0].location,
                            'deadline': oneMeeting[0].deadline
                        },
                        vote_dates: dates
                    });
                }
                else {
                    this.sendNotFoundError();
                }
            }
            else {
                this.sendNotFoundError();
            }
            //this.send_failure(this.res, 404, this.make_error("error", "Pas trouvé"))
        });
    }
    getMeetingByID(username, id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("enter get meeting by id");
            console.log(username, id);
            let id_num = parseInt(id);
            const oneMeeting = yield this.myDB.queryDB({
                table: 'meeting',
                fields: 'meeting_id, title, describe, location, deadline, create_date, editor_link, visiter_link, token',
                where: `meeting_id = ${id_num} and creator = '${username}'`
            });
            if (oneMeeting.length === 1) {
                this.send_success(this.res, oneMeeting[0]);
            }
            else {
                this.send_failure(this.res, 404, this.make_error("error", "Pas trouvé"));
            }
            //this.send_failure(this.res, 404, this.make_error("error", "Le lien n'est pas valide"))
        });
    }
    // dates should be type IDate[]
    addingDates(meeting_id, dates) {
        return __awaiter(this, void 0, void 0, function* () {
            // about adding dates
            let date_num = yield this.myDB.queryDB({
                table: 'date',
                fields: 'count(date_id) as count'
            });
            let newDateId = date_num[0].count + 1;
            // attribuer each date un id
            dates.forEach((d) => {
                d.date_id = newDateId++;
            });
            console.log('meeing_dates', dates);
            // save in date table
            yield this.myDB.insertDB('date', dates);
            // save in intersection table for date and meeting
            let meet_date_num = yield this.myDB.queryDB({
                table: 'meet_date',
                fields: 'count(meet_date_id) as count'
            });
            console.log('meet_date_num', meet_date_num);
            let newMeetDateId = meet_date_num[0].count + 1;
            console.log('newMeetDateId', newMeetDateId);
            let dates_meetings = [];
            for (let i = 0; i < dates.length; i++) {
                dates_meetings.push({
                    'meet_date_id': newMeetDateId++,
                    'meeting_id': meeting_id,
                    'date_id': dates[i].date_id
                });
                //console.log('meet_date for', i, dates_meetings);
            }
            console.log('meet_date', dates_meetings);
            yield this.myDB.insertDB('meet_date', dates_meetings);
        });
    }
    // function utility
    generateRandomShareCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = 8;
        let result = "";
        for (let i = 0; i < length; i++) {
            const index = Math.floor(Math.random() * chars.length);
            result += chars.charAt(index);
        }
        return result;
    }
    sendNotFoundError() {
        this.send_failure(this.res, 404, this.make_error("error", "Pas trouvé"));
    }
}
const myapiservice = (req, res) => {
    const myService = new MyAPI(req, res, "POST,GET,PUT,DELETE");
    myService.perform_execute();
};
exports.myapiservice = myapiservice;
