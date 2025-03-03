import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const CarePlanForm: React.FC<{ externalPrompt: string }> = ({
	externalPrompt,
}) => {
	const [carePlan, setCarePlan] = useState<string>("");
	const [evaluation, setEvaluation] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	// This function uses the external prompt from PromptForm
	const handleSubmit = async () => {
		// Validate if we have a prompt
		if (!externalPrompt.trim()) {
			setError("Please generate a prompt first");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			const response = await fetch(
				"http://localhost:8000/care-plan",
				{
					method: "POST",
					headers: {
						"Content-Type":
							"application/json",
					},
					body: JSON.stringify({
						prompt: externalPrompt,
					}),
				}
			);

			if (!response.ok) {
				throw new Error(
					`Server responded with status: ${response.status}`
				);
			}

			const data = await response.json();
			console.log("data: ", data);
			console.log("data.generated: ", data.generated);
			console.log("data.generated.care_plan: ", data.generated.care_plan);
			console.log("data.generated.evaluation_report: ", data.generated.evaluation_report);
			
			// Update to use the new response structure
			setCarePlan(
				data.generated?.care_plan ||
					"No care plan was generated"
			);
			setEvaluation(
				data.generated?.evaluation_report ||
					"No evaluation was generated"
			);
		} catch (error) {
			console.error(
				"Error generating care plan:",
				error
			);
			setError(
				"Failed to generate care plan. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClear = () => {
		setCarePlan("");
		setEvaluation("");
		setError("");
	};

	return (
		<div className="form-container">
			<h2>Care Plan Generation</h2>

			{error && (
				<div
					style={{
						color: "var(--error-color)",
						marginBottom: "1rem",
					}}
				>
					{error}
				</div>
			)}

			<div className="button-container">
				<button
					onClick={handleSubmit}
					disabled={
						isLoading ||
						!externalPrompt.trim()
					}
				>
					{isLoading
						? "Generating..."
						: "Generate Care Plan"}
				</button>
				<button
					className="secondary"
					onClick={handleClear}
					disabled={
						isLoading ||
						(!carePlan &&
							!evaluation)
					}
				>
					Clear Results
				</button>
			</div>

			<div className="results-grid">
				<div className="results-column">
					<h3>Care Plan:</h3>
					<div className="result-container markdown-content">
						{carePlan ? (
							<ReactMarkdown>
								{
									carePlan
								}
							</ReactMarkdown>
						) : (
							"Your care plan will appear here"
						)}
					</div>
				</div>
				<div className="results-column">
					<h3>Evaluation:</h3>
					<div className="result-container markdown-content">
						{evaluation ? (
							<ReactMarkdown>
								{
									evaluation
								}
							</ReactMarkdown>
						) : (
							"Care Plan's evaluation will appear here"
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CarePlanForm;
