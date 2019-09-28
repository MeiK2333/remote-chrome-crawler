export enum TaskStatus {
    PENDING,
    RUNNING,
    SUCCESS,
    FAILURE,
}

export interface TaskOptions {

}

let task_count = 0

export class Task {
    id: number
    url: string
    options: TaskOptions

    constructor(url: string, options: TaskOptions = {}) {
        this.id = task_count
        task_count++
        this.url = url
        this.options = {
            ...{},
            ...options
        }
    }

    async run() {

    }
}
