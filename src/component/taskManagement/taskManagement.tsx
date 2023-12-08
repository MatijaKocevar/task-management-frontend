import { useState } from "react";
import "./taskManagementStyle.scss";
import TaskList from "./taskList/taskList";
import TaskSection from "./task/task";

const TaskManagement = () => {
	const [existingTaskId, setExsitingTaskId] = useState<number>();
	const [updateList, setUpdateList] = useState<boolean>(false);

	return (
		<>
			<div className='task-management-wrapper'>
				<h1 className='title'>Task Management</h1>
				<div className='sections'>
					<TaskList existingTaskId={existingTaskId} setExistingTaskId={setExsitingTaskId} updateList={updateList} setUpdateList={setUpdateList} />
					<TaskSection existingTaskId={existingTaskId} setExistingTaskId={setExsitingTaskId} setUpdateList={setUpdateList} />
				</div>
			</div>
		</>
	);
};

export default TaskManagement;
