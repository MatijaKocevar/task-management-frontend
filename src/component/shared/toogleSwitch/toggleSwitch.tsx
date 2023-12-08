import React, { useCallback, useEffect, useState } from "react";
import "./toggleSwitch.scss";
import checkSvg from "./check.svg";
import inProgressSvg from "./inProgress.svg";

interface ToggleSwitchProps {
	title?: string;
	status: boolean;
	taskId: number;
	onToggle: (newStatus: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ title, status, onToggle, taskId }) => {
	const [isChecked, setIsChecked] = useState<boolean>(status);

	useEffect(() => {
		// Update the state when the status prop changes
		setIsChecked(status);
	}, [status]);

	const handleChange = useCallback(() => {
		// Toggle the switch and invoke the onToggle callback
		const newStatus = !isChecked;
		setIsChecked(newStatus);
		onToggle(newStatus);
	}, [isChecked, onToggle]);

	return (
		<div className={`toggle-switch ${isChecked ? "toggle-switch-checked" : ""}`} title={title ?? ""}>
			<input type='checkbox' id={`${taskId}toggleSwitch`} checked={isChecked} onChange={handleChange} style={{ display: "none" }} />
			<label className='toggle-switch-toggle' htmlFor={`${taskId}toggleSwitch`}>
				<div className='toggle-switch-labels'>
					<div className={`toggle-switch-label ${!isChecked ? "toggle-switch-label-selected" : ""}`}>
						<img className='in-progress' src={inProgressSvg} alt='inProgressSvg' />
					</div>
					<div className={`toggle-switch-label ${isChecked ? "toggle-switch-label-selected" : ""}`}>
						<img className='check-mark' src={checkSvg} alt='checkMark' />
					</div>
				</div>
			</label>
		</div>
	);
};

export default ToggleSwitch;
