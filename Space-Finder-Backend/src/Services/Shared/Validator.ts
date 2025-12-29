import { SpaceEntry } from "../Model/Model.js";

export class MissingFieldError extends Error {
    constructor(fieldName: string) {
        super(`Missing required field: ${fieldName}`);
    }
}

export function validateAsSpaceEntry(data: SpaceEntry){
    if (data.id === undefined) {
        throw new MissingFieldError("id");
    }
    if (data.name === undefined) {
        throw new MissingFieldError("name");
    }
    if (data.location === undefined) {
        throw new MissingFieldError("location");
    }
}