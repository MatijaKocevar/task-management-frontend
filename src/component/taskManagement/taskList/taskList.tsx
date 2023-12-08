import { Task } from "../../../types/types";
import StatusSwitch from "../../shared/toogleSwitch/toggleSwitch";
import TaskSearch from "./taskSearch/taskSearch";
import "./taskListStyle.scss";
import { useCallback, useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

interface TaskListProps {
	existingTaskId?: number;
	setExistingTaskId: React.Dispatch<React.SetStateAction<number | undefined>>;
	setUpdateList: React.Dispatch<React.SetStateAction<boolean>>;
	updateList: boolean;
}

const TaskList = (props: TaskListProps) => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const { existingTaskId, setExistingTaskId, setUpdateList, updateList } = props;
	const [filter, setFilter] = useState<string>("");
	const [selectedTaskId, setSelectedTaskId] = useState<number | undefined>(undefined);

	// Fetch all tasks from the server
	const getAllTasks = useCallback(async () => {
		try {
			const response = await fetch(apiUrl);
			const responseData: Task[] = await response.json();
			return responseData;
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}, []);

	// Fetch filtered tasks from the server based on the search term
	const getFilteredTasks = useCallback(async () => {
		try {
			const encodedSearchTerm = encodeURIComponent(filter);
			const response = await fetch(`${apiUrl}-search?searchTerm=${encodedSearchTerm}`);
			const responseData: Task[] = await response.json();
			return responseData;
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}, [filter]);

	// Load all tasks when no filter is applied
	const loadAllTasks = useCallback(async () => {
		const tasks = await getAllTasks();

		if (tasks) setTasks(tasks);
	}, [getAllTasks]);

	// Load filtered tasks when a filter is applied
	const loadFilteredTasks = useCallback(async () => {
		const tasks = await getFilteredTasks();

		if (tasks) setTasks(tasks);
	}, [getFilteredTasks]);

	// Handle click event on a task item
	const handleTaskItemClick = useCallback(
		(id: number) => {
			setExistingTaskId(id);
			setSelectedTaskId(id);
		},
		[setExistingTaskId, setSelectedTaskId]
	);

	// Handle search term change
	const handleSearch = useCallback(
		(searchTerm: string) => {
			setFilter(searchTerm);
		},
		[setFilter]
	);

	// Load tasks based on filter when filter changes
	useEffect(() => {
		if (filter !== "") loadFilteredTasks();
		else loadAllTasks();
	}, [filter, loadAllTasks, loadFilteredTasks]);

	// Update task list when existing task ID changes or updateList flag is true
	useEffect(() => {
		if ((existingTaskId && !tasks.some((task) => task.id === existingTaskId) && updateList) || updateList) {
			if (filter === "") loadAllTasks();
			else loadFilteredTasks();

			setUpdateList(false);
		}
	}, [existingTaskId, setUpdateList, loadAllTasks, tasks, updateList, filter, loadFilteredTasks]);

	// Handle toggle status of a task
	const handleToggleStatus = useCallback(async (id: number, newStatus: boolean) => {
		const newStatusData = {
			status: newStatus,
		};

		try {
			const response = await fetch(`${apiUrl}/${id}/status`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newStatusData),
			});

			if (response.ok) {
				setTasks((prevTasks) => {
					const updatedTasks = prevTasks.map((task) => {
						if (task.id === id) {
							return { ...task, status: newStatus };
						}
						return task;
					});
					return updatedTasks;
				});
			}
		} catch (error) {
			console.error("Error updating task:", error);
		}
	}, []);

	return (
		<div className='tasklist-section'>
			<h1>Task List</h1>
			<div className='search-container'>
				<TaskSearch onSearch={handleSearch} />
			</div>
			<div className='tasks-wrapper'>
				{tasks.map((task: Task) => {
					return (
						<div
							className={`task-item ${task.id === selectedTaskId && existingTaskId ? "task-item-selected" : ""}`}
							key={task.id}
							onClick={() => handleTaskItemClick(task.id)}
						>
							<div className='task-item__id'>{task.id}</div>
							<div className='task-item__title'>{task.title}</div>
							<StatusSwitch
								title='Status'
								status={task.status}
								taskId={task.id}
								onToggle={(newStatus) => {
									handleToggleStatus(task.id, newStatus);
								}}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default TaskList;
