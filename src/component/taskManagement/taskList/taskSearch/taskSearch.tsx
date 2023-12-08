import React, { useCallback, useEffect, useRef, useState } from "react";
import "./taskSearchStyle.scss";

interface SearchInputProps {
	onSearch: (searchTerm: string) => void;
}

const TaskSearch: React.FC<SearchInputProps> = ({ onSearch }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const timeoutId = useRef<number>();

	useEffect(() => {
		if (timeoutId.current) clearTimeout(timeoutId.current);

		// Throttle the search to avoid excessive API requests
		timeoutId.current = setTimeout(() => {
			onSearch(searchTerm);
			timeoutId.current = undefined;
		}, 500);

		// Cleanup function to clear the timeout when component unmounts or searchTerm changes
		return () => {
			if (timeoutId.current) clearTimeout(timeoutId.current);
		};
	}, [searchTerm, onSearch]);

	const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const newSearchTerm = event.target.value;
		setSearchTerm(newSearchTerm);
	}, []);

	return <input type='text' placeholder='Search...' value={searchTerm} onChange={handleChange} />;
};

export default TaskSearch;
