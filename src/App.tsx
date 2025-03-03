import React, { useState } from "react";
import CarePlanForm from "./components/CarePlanForm";
import PromptForm from "./components/PromptForm";

const App: React.FC = () => {
	const [sharedPrompt, setSharedPrompt] = useState<string>("");
	return (
		<div className="app-container">
			<h1>CrewAI Patient Care</h1>
			<PromptForm onPromptGenerated={setSharedPrompt} />
			<CarePlanForm externalPrompt={sharedPrompt} />
		</div>
	);
};

export default App;
