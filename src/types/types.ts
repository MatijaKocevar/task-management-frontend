export interface Task {
	id: number;
	title: string;
	description: string;
	status: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export const newTask: Task = {
	id: 0,
	title: "",
	description: "",
	status: false,
	createdAt: new Date(Date.now()),
	updatedAt: new Date(Date.now()),
};
