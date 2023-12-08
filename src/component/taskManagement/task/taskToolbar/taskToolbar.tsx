import { useCallback } from "react";
import { Task, newTask } from "../../../../types/types";
import "./taskToolbarStyle.scss";
const apiUrl = import.meta.env.VITE_API_URL;

interface TaskToolbarProps {
	setExistingTaskId: React.Dispatch<React.SetStateAction<number | undefined>>;
	setUpdateList: React.Dispatch<React.SetStateAction<boolean>>;
	setTask: React.Dispatch<React.SetStateAction<Task>>;
	hasUnsavedChanges: boolean;
	setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
	task: Task;
	setTaskId: React.Dispatch<React.SetStateAction<number>>;
}

const TaskToolbar = (props: TaskToolbarProps) => {
	const { setExistingTaskId, setUpdateList, setTask, setHasUnsavedChanges, task, hasUnsavedChanges, setTaskId } = props;

	const handleNewTask = useCallback(() => {
		// Create a new task and reset the state
		setTaskId(newTask.id);
		setTask(newTask);
		setExistingTaskId(undefined);
		setHasUnsavedChanges(false);
	}, [setTask, setExistingTaskId, setHasUnsavedChanges, setTaskId]);

	const handleSaveChanges = useCallback(async () => {
		// Save or update the task based on if it has an ID or not
		const saveTask = async () => {
			try {
				const response = await fetch(apiUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(task),
				});
				const responseData: Task = await response.json();
				setTaskId(responseData.id);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		const updateTask = async () => {
			try {
				await fetch(`${apiUrl}/${task.id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(task),
				});
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		if (task.id === 0) {
			await saveTask();
			setUpdateList(true);
			setHasUnsavedChanges(false);
		} else {
			await updateTask();
			setUpdateList(true);
			setHasUnsavedChanges(false);
		}
	}, [setUpdateList, task, setHasUnsavedChanges, setTaskId]);

	const handleDeleteTask = useCallback(async () => {
		// Delete the task
		try {
			await fetch(`${apiUrl}/${task.id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(task),
			});

			// Reset the state to a new task
			setTask(newTask);
			setTaskId(newTask.id);
			setExistingTaskId(undefined);
			setUpdateList(true);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}, [setTask, setExistingTaskId, setUpdateList, task, setTaskId]);

	return (
		<div className='actions'>
			<h1 className='section__title'>{task.id === 0 ? "New Task" : "Task"}</h1>
			<div className='action-buttons'>
				<button className={`section__button ${task.id !== 0 ? "" : "disabled"}`} onClick={handleNewTask} disabled={task.id === 0}>
					New task
				</button>
				<button className={`section__button ${hasUnsavedChanges ? "" : "disabled"}`} onClick={handleSaveChanges} disabled={!hasUnsavedChanges}>
					Save changes
				</button>
				<button className={`section__button ${task.id !== 0 ? "" : "disabled"}`} onClick={handleDeleteTask} disabled={task.id === 0}>
					Delete task
				</button>
			</div>
		</div>
	);
};

export default TaskToolbar;
