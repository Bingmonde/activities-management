import { SimpleBaseService } from "./common/baseserver";

// IMPORTANT : IF YOU NEED TO MODIFY baseserver.ts or bigquery.ts you MUST TEST OTHER SERVICE AND ALIGN ALL OF THEM

class MyAPI extends SimpleBaseService {
     // Effectue la request, typiquement la seule place a modifier.
     async execute() {
        //console.log(this.req.method);
        switch (this.req.method) {
            case "GET":
                console.log("enter get function");
                await this.participant_get();
                break;
            case "POST":
                console.log("enter post function");
                await this.participant_post();
                break;
            case "PUT":
            await this.participant_put();
                break;
            case "DELETE":
                await this.participant_date_delete();
                break;
            default:
                throw ({ error: 400, msg: "Méthode non supportée" });
        }
        //console.log(this.req);
        
     }

     async participant_get(){}

    async participant_post(){
        //console.log(this.req.path);
        const urlElement = this.req.path.split('/');
        console.log(urlElement);

        if (urlElement.length === 2 ){
            this.createParticipant();
        }
        else if (urlElement.length === 3){
            this.voteDate();
        }
     }

     async participant_put(){
        let participant = this.req.body;
        try{
            await this.myDB.queryDBRaw(
                `UPDATE \`${this.myDB.dataset}.participant\`
                SET 
                    first_name = \`${participant.first_name}\`,
                    last_name = \`${participant.last_name}\`,
                    email = \`${participant.email}\`,
                    telephone = \`${participant.telephone}\`,
                WHERE part_id = \`${participant.part_id}\``
            )
            this.send_success(this.res, "L'info sur participant est mise à jour");
        }
        catch (err) {
        }
     }


     async createParticipant(){
        console.log('enter create participant');
        let participant = this.req.body;
        let part_num = await this.myDB.queryDB(
            {
                table: 'participant',
                fields: 'count(part_id) as count'
            }
        );
        console.log(part_num)
        let newPartId = part_num[0].count + 101;
        participant.part_id = newPartId;

        try{
            await this.myDB.queryDBRaw(
                `INSERT INTO \`${this.myDB.dataset}.participant\` (part_id, first_name, last_name, email, telephone) 
                VALUES (${participant.part_id}, '${participant.first_name}', '${participant.last_name}', '${participant.email}', '${participant.telephone}');`
            );
            // await this.myDB.insertDB('participant',
            // participant
            // )
            this.send_success(this.res, newPartId);
        }
        catch(error){
            console.log('Error inserting participant:', error);
            this.send_failure(this.res, 0, error);
        }
        
     }

     async voteDate() {
        let choix = this.req.body;
        console.log(choix);
        let part_num = await this.myDB.queryDB(
            {
                table: 'date_part',
                fields: 'count(part_id) as count',
            }
        );
        let newDatePartId = part_num[0].count +1000;
        choix.date_part_id = newDatePartId;
        console.log(newDatePartId);
        try {
            await this.myDB.insertDB('date_part', 
            choix
            );
            this.send_success(this.res, true);
        }
        catch (error){
            console.log('Error inserting date:', error);
        }

     }

     async participant_date_delete(){
        console.log('date delete')
        const urlElement = this.req.path.split('/');
        if (urlElement.length == 3){
            let part_id = parseInt(urlElement[1]);
                let date_id = parseInt(urlElement[2]);
                console.log(part_id, date_id);
            try {

                await this.myDB.queryDBRaw(
                    `DELETE FROM \`${this.myDB.dataset}.date_part\`
                    WHERE part_id = \`${part_id}\` and date_id = \`${date_id}\`;`
                )

                this.send_success(this.res, true);
            }
            catch (err) {
                console.log(err)
            }
        }
     }


}


export const myapiservice = (req, res) => {
    const myService = new MyAPI(req, res, "POST,GET,PUT,DELETE");
    myService.perform_execute();
}
