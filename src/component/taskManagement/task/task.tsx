import { useCallback, useEffect, useState } from "react";
import "./taskStyle.scss";
import { Task, newTask } from "../../../types/types";
import TaskToolbar from "./taskToolbar/taskToolbar";
const apiUrl = import.meta.env.VITE_API_URL;

interface TaskProps {
	existingTaskId?: number;
	setExistingTaskId: React.Dispatch<React.SetStateAction<number | undefined>>;
	setUpdateList: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskSection = (props: TaskProps) => {
	const { existingTaskId, setExistingTaskId, setUpdateList } = props;
	const [task, setTask] = useState<Task>(newTask);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
	const [taskId, setTaskId] = useState<number>(0);

	useEffect(() => {
		// Fetch the task data when existingTaskId changes
		const fetchTask = async () => {
			try {
				const response = await fetch(`${apiUrl}/${existingTaskId}`);
				const responseData: Task = await response.json();
				if (responseData) {
					setTask(responseData);
					setTaskId(responseData.id);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		if (existingTaskId) {
			fetchTask();
			setHasUnsavedChanges(false);
		}
	}, [existingTaskId]);

	useEffect(() => {
		// Update the task ID in the state when taskId changes and the task ID is not the same as current task ID
		if (taskId && taskId !== task.id) {
			setTask({ ...task, id: taskId });
			setHasUnsavedChanges(false);
		}
	}, [taskId, task]);

	const handleOnChangeTitle = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			// Update the task's title and set hasUnsavedChanges to true if there are no unsaved changes already
			setTask({ ...task, title: e.target.value });
			if (!hasUnsavedChanges) setHasUnsavedChanges(true);
		},
		[task, hasUnsavedChanges]
	);

	const handleOnChangeDescription = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			// Update the task's description and set hasUnsavedChanges to true if there are no unsaved changes already
			setTask({ ...task, description: e.target.value });
			if (!hasUnsavedChanges) setHasUnsavedChanges(true);
		},
		[task, hasUnsavedChanges]
	);

	return (
		<div className='task-section'>
			<TaskToolbar
				hasUnsavedChanges={hasUnsavedChanges}
				setExistingTaskId={setExistingTaskId}
				setHasUnsavedChanges={setHasUnsavedChanges}
				setTask={setTask}
				setUpdateList={setUpdateList}
				task={task}
				setTaskId={setTaskId}
			/>
			{task && (
				<div className='task-item'>
					<div className='task-item__status-row'>
						<div className='task-item__status-title-col'>
							<input type='text' placeholder='Task title...' className='task-item__title' value={task.title} onChange={handleOnChangeTitle} />
							<div className='task-item__id'>id: {taskId === 0 ? "" : taskId}</div>
						</div>
					</div>
					<div className='task-item__description'>
						<textarea className='description' placeholder='Task description...' value={task.description} onChange={handleOnChangeDescription} />
					</div>
				</div>
			)}
		</div>
	);
};

export default TaskSection;
