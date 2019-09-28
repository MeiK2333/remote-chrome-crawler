export enum TaskStatus {
    PENDING,
    RUNNING,
    SUCCESS,
    FAILURE,
}

export interface TaskOptions {

}

export class Task {
    url: string
    options: TaskOptions

    constructor(url: string, options: TaskOptions = {}) {
        this.url = url
        this.options = {
            ...{},
            ...options
        }
    }
}
