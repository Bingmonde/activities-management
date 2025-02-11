

export interface IActivities {
    titre: string;
    image: string;
    desc: string
}

// export interface IConnexion {
//     user: string;
//     password: string
// }

// export interface IUser {
//     nom: string;
//     prenom: string;
//     courriel: string;
// }

// export interface IComment extends IUser {
//     commentaire: string;
// }
export interface IDate {
    date_id: number;
    d_start: Date;
    d_end: Date;
    //duration: number; // in minutes
}

export interface IDateStats{
    date_id: number;
    d_start: Date;
    d_end: Date;
    vote: number;
}

export interface IDateAPI {
    date_id: number;
    d_start: {value: string};
    d_end: {value: string};
    vote: number;
}


export interface IMeetingDate extends IDate{
    meeting_id: number;
}

// using when creatin an event
export interface IEventBase{
    title: string;
    describe: string;
    location: string;
    deadline: Date;
}

export interface IEvent {
    title: string;
    describe: string;
    location: string;
    dates: IDate[];
    deadline: Date;
}
// return from server
export interface IEventAPI {
    meeting_id: number;
    title: string;
    describe: string;
    location: string;
    //dates: IDateAPI[]; // with note number
    deadline: string;
}

export interface IEventAPIStandard {
    meeting_id: number;
    title: string;
    describe: string;
    location: string;
    deadline: Date;
}

// return from server for admin
export interface IEventAdminAPI extends IEventAPI {
    token: number;
    creator: string;
    create_date: Date;
    editor_link : string;
    visiter_link: string;
    last_modif: Date;
}

// for admins after modification
export interface IEventUpdate extends IEvent {
    id: number;
    last_modif: Date;
}

// to show for user all_meetings
export interface IEventBrefAPI {
    meeting_id: number;
    title: string;
    location: string;
    deadline: {value: string};
}

export interface IEventBref {
    meeting_id: number;
    title: string;
    location: string;
    deadline: Date;
}

// to show on visitor meeting page
export interface IEventCode{
    title: string;
    share_code: string;
}

export interface IEventToken{
    id: number;
    token: string;
}

export interface IMeetingAPI{
    info: IEventAdminAPI;
    token_id: IEventToken
}

export interface IAide {
    section: string;
    content: string;
  }


export interface IJeu {
    sign: string;
    show: boolean
}

export interface IConnexion{
    username: string;
    password: string;
}

export interface IUser extends IConnexion{
    email: string;
    key:string;
}

export interface IMessage {
    nom: string
    prenom: string
    email: string
    telephone: string
    message: string
}

export interface IMessageRecu extends IMessage {
    userid: string
    create_date: {value: string}
}

export interface IOrganizer {
    username: string;
    events: IEvent[];
}

export interface IContact {
    "error": string
    "data": IMessageRecu[]
}

export interface IParticipantBase{
    part_id : number;
    first_name: string;
    last_name: string;
    email: string;
    telephone: string;
}

export interface IParticipantAPI {
    part_id: number;
}

export interface IDateVote{
    date: Date;
    vote: number;
}

export interface IParticipantChoixDate {
    part_id: number;
    name: string;
    selected_dates: number[];
}
export interface IListChoicePart {
    name: string;
    results: boolean[]
}

export interface IDatePart{
    date_part_id: number;
    date_id: number;
    part_id: number;
}

export interface ILocalChoix{
    code: string;
    dates: number[];
}
