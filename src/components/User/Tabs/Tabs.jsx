import React, { useEffect, useState } from "react";
import "./tabs.css";

const Tabs = ({
	label,
	options = [],
	onSelect = () => {},
	defaultValue = "",
	allowSearch = true,
}) => {
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState(defaultValue || (options[0] || ""));

	useEffect(() => {
		if (defaultValue) setSelected(defaultValue);
	}, [defaultValue]);

	// notify parent when selection changes
	useEffect(() => {
		if (selected) onSelect(selected);
	}, [selected, onSelect]);

	const filtered = options.filter((opt) => !query || opt.toLowerCase().includes(query.toLowerCase()));

	return (
		<div className="tabs-root">
			{label && <label className="item-search-label">{label}</label>}

			{allowSearch && (
				<div className="tabs-search">
					<input
						className="tabs-search-input"
						placeholder="Search..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						aria-label="Search tabs"
					/>
				</div>
			)}

			<div className="tabs-list" role="tablist">
				{filtered.length ? (
					filtered.map((opt, idx) => (
						<button
							key={idx}
							type="button"
							role="tab"
							aria-selected={opt === selected}
							className={`tab ${opt === selected ? "active" : ""}`}
							onClick={() => setSelected(opt)}
						>
							{opt}
						</button>
					))
				) : (
					<div className="tabs-empty">No items</div>
				)}
			</div>
		</div>
	);
};

export default Tabs;

