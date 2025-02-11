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
            //console.log(this.req.method);
            switch (this.req.method) {
                case "GET":
                    console.log("enter get function");
                    yield this.participant_get();
                    break;
                case "POST":
                    console.log("enter post function");
                    yield this.participant_post();
                    break;
                case "PUT":
                    yield this.participant_put();
                    break;
                case "DELETE":
                    yield this.participant_date_delete();
                    break;
                default:
                    throw ({ error: 400, msg: "Méthode non supportée" });
            }
            //console.log(this.req);
        });
    }
    participant_get() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    participant_post() {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(this.req.path);
            const urlElement = this.req.path.split('/');
            console.log(urlElement);
            if (urlElement[1] === 'participant' && urlElement.length === 2) {
                this.createParticipant();
            }
            else if (urlElement[1] === 'participant' && urlElement.length === 3) {
                this.voteDate();
            }
        });
    }
    participant_put() {
        return __awaiter(this, void 0, void 0, function* () {
            let participant = this.req.body;
            try {
                yield this.myDB.queryDBRaw(`UPDATE \`${this.myDB.dataset}.participant\`
                SET 
                    first_name = \`${participant.first_name}\`,
                    last_name = \`${participant.last_name}\`,
                    email = \`${participant.email}\`,
                    telephone = \`${participant.telephone}\`,
                WHERE part_id = \`${participant.part_id}\``);
                this.send_success(this.res, "L'info sur participant est mise à jour");
            }
            catch (err) {
            }
        });
    }
    createParticipant() {
        return __awaiter(this, void 0, void 0, function* () {
            let participant = this.req.body;
            let part_num = yield this.myDB.queryDB({
                table: 'participant',
                fields: 'count(part_id) as count'
            });
            console.log(part_num);
            let newPartId = part_num[0].count + 101;
            participant.part_id = newPartId;
            try {
                // await this.myDB.queryDBRaw(
                //     `INSERT INTO \`${this.myDB.dataset}.participant\` (part_id, first_name, last_name, email, telephone) 
                //     VALUES (${participant.part_id}, '${participant.first_name}', '${participant.last_name}', '${participant.email}', '${participant.telephone}');`
                // );
                yield this.myDB.insertDB('participant', participant);
                this.send_success(this.res, newPartId);
            }
            catch (error) {
                console.log('Error inserting participant:', error);
                this.send_failure(this.res, 0, error);
            }
        });
    }
    voteDate() {
        return __awaiter(this, void 0, void 0, function* () {
            let choix = this.req.body;
            console.log(choix);
            let part_num = yield this.myDB.queryDB({
                table: 'date_part',
                fields: 'count(part_id) as count',
            });
            let newDatePartId = part_num[0].count + 1000;
            choix.date_part_id = newDatePartId;
            console.log(newDatePartId);
            try {
                yield this.myDB.insertDB('date_part', choix);
                this.send_success(this.res, true);
            }
            catch (error) {
                console.log('Error inserting date:', error);
            }
        });
    }
    participant_date_delete() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('date delete');
            const urlElement = this.req.path.split('/');
            if (urlElement[1] == 'participant' && urlElement.length == 4) {
                let part_id = parseInt(urlElement[2]);
                let date_id = parseInt(urlElement[3]);
                console.log(part_id, date_id);
                try {
                    yield this.myDB.queryDBRaw(`DELETE FROM \`${this.myDB.dataset}.date_part\`
                    WHERE part_id = \`${part_id}\` and date_id = \`${date_id}\`;`);
                    this.send_success(this.res, true);
                }
                catch (err) {
                    console.log(err);
                }
            }
        });
    }
}
const myapiservice = (req, res) => {
    const myService = new MyAPI(req, res, "POST,GET,PUT,DELETE");
    myService.perform_execute();
};
exports.myapiservice = myapiservice;
