import { ICandidate } from "./ICandidate";

export interface ISession {
    name: string;
    candidates: ICandidate[];
    startDate: Date;
    endDate: Date;
    description: string;
    maxVotes: number;
}