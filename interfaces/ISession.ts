import { ICandidate } from "./ICandidate";

export interface ISession {
    id: string;
    name: string;
    candidates: ICandidate[];
    startDate: Date;
    endDate: Date;
    description: string;
    maxVotes: number;
}