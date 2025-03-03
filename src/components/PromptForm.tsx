import React, { FormEvent, useState } from "react";
import ReactMarkdown from "react-markdown";

interface PromptGenerationInput {
	base_prompt: string;
	prompt_type: string;
}

interface PromptFormProps {
	onPromptGenerated: (prompt: string) => void;
}

// Predefined prompt types
const PROMPT_TYPES = [
	{ value: "", label: "Select a prompt type or enter custom..." },
	{ value: "Chain of Thought", label: "Chain of Thought (CoT)" },
	{ value: "Few-Shot Learning", label: "Few-Shot Learning" },
	{
		value: "Zero-Shot Chain of Thought",
		label: "Zero-Shot Chain of Thought",
	},
	{ value: "Tree of Thoughts", label: "Tree of Thoughts (ToT)" },
	{ value: "Self-Consistency", label: "Self-Consistency" },
	{ value: "ReAct", label: "ReAct (Reasoning + Acting)" },
	{ value: "Reflexion", label: "Reflexion" },
	{
		value: "Least-to-Most Prompting",
		label: "Least-to-Most Prompting",
	},
	{ value: "Maieutic Prompting", label: "Maieutic Prompting" },
	{
		value: "Directional Stimulus Prompting",
		label: "Directional Stimulus Prompting",
	},
	{ value: "Contrastive Prompting", label: "Contrastive Prompting" },
	{
		value: "Persona-Based Prompting",
		label: "Persona-Based Prompting",
	},
	{
		value: "Socratic Method Prompting",
		label: "Socratic Method Prompting",
	},
	{
		value: "Structured Output Prompting",
		label: "Structured Output Prompting",
	},
	{
		value: "Retrieval-Augmented Generation",
		label: "Retrieval-Augmented Generation (RAG)",
	},
	{ value: "Multimodal Prompting", label: "Multimodal Prompting" },
	{ value: "Temporal Prompting", label: "Temporal Prompting" },
	{
		value: "Ethical Consideration Framework",
		label: "Ethical Consideration Framework",
	},
	{
		value: "Differential Diagnosis Prompting",
		label: "Differential Diagnosis Prompting",
	},
	{
		value: "Patient-Centered Prompting",
		label: "Patient-Centered Prompting",
	},
	{
		value: "Evidence-Based Prompting",
		label: "Evidence-Based Prompting",
	},
	{
		value: "Interdisciplinary Consultation",
		label: "Interdisciplinary Consultation",
	},
	{
		value: "Risk-Benefit Analysis Prompting",
		label: "Risk-Benefit Analysis Prompting",
	},
	{
		value: "Cultural Competency Prompting",
		label: "Cultural Competency Prompting",
	},
	{
		value: "Outcome-Oriented Prompting",
		label: "Outcome-Oriented Prompting",
	},
	{ value: "custom", label: "Custom (Enter your own)" },
];

const PromptForm: React.FC<PromptFormProps> = ({ onPromptGenerated }) => {
	const [formData, setFormData] = useState<PromptGenerationInput>({
		base_prompt: "",
		prompt_type: "",
	});
	const [result, setResult] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [showMarkdownPreview, setShowMarkdownPreview] =
		useState<boolean>(false);
	const [isCustomType, setIsCustomType] = useState<boolean>(false);
	const [customType, setCustomType] = useState<string>("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		// Clear error when user starts typing
		if (error) setError("");
	};

	const handleSelectChange = (
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		const selectedValue = e.target.value;

		if (selectedValue === "custom") {
			setIsCustomType(true);
			setFormData({
				...formData,
				prompt_type: customType,
			});
		} else {
			setIsCustomType(false);
			setFormData({
				...formData,
				prompt_type: selectedValue,
			});
		}

		// Clear error when user selects an option
		if (error) setError("");
	};

	const handleCustomTypeChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setCustomType(value);
		setFormData({
			...formData,
			prompt_type: value,
		});

		// Clear error when user starts typing
		if (error) setError("");
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		// Validate inputs
		if (
			!formData.base_prompt.trim() ||
			!formData.prompt_type.trim()
		) {
			setError("Please fill in all fields");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			const response = await fetch(
				"http://localhost:8000/prompt",
				{
					method: "POST",
					headers: {
						"Content-Type":
							"application/json",
					},
					body: JSON.stringify(
						formData
					),
				}
			);

			if (!response.ok) {
				throw new Error(
					`Server responded with status: ${response.status}`
				);
			}

			const data = await response.json();
			setResult(data.prompt);
			// Lift the result up to parent
			onPromptGenerated(data.prompt);
			// Show markdown preview by default when we get a result
			setShowMarkdownPreview(true);
		} catch (error) {
			console.error("Error generating prompt:", error);
			setError(
				"Failed to generate prompt. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleResultChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setResult(e.target.value);
		onPromptGenerated(e.target.value);
	};

	const handleClear = () => {
		setFormData({
			base_prompt: "",
			prompt_type: "",
		});
		setResult("");
		setError("");
		setCustomType("");
		setIsCustomType(false);
		onPromptGenerated("");
	};

	const toggleMarkdownPreview = () => {
		setShowMarkdownPreview(!showMarkdownPreview);
	};

	return (
		<div className="form-container">
			<h2>Prompt Generation</h2>
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
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Base Prompt:</label>
					<input
						type="text"
						name="base_prompt"
						value={
							formData.base_prompt
						}
						onChange={
							handleChange
						}
						required
						disabled={isLoading}
						placeholder="Enter the base prompt for your care plan"
					/>
				</div>
				<div className="form-group">
					<label>Prompt Type:</label>
					<select
						value={
							isCustomType
								? "custom"
								: formData.prompt_type
						}
						onChange={
							handleSelectChange
						}
						disabled={isLoading}
						className="select-input"
					>
						{PROMPT_TYPES.map(
							(
								type,
								index
							) => (
								<option
									key={
										index
									}
									value={
										type.value
									}
								>
									{
										type.label
									}
								</option>
							)
						)}
					</select>

					{isCustomType && (
						<div
							className="form-group"
							style={{
								marginTop: "0.5rem",
							}}
						>
							<label>
								Custom
								Prompt
								Type:
							</label>
							<input
								type="text"
								value={
									customType
								}
								onChange={
									handleCustomTypeChange
								}
								disabled={
									isLoading
								}
								placeholder="Enter your custom prompt type"
								required={
									isCustomType
								}
							/>
						</div>
					)}
				</div>
				<div className="button-container">
					<button
						type="submit"
						disabled={isLoading}
					>
						{isLoading
							? "Generating..."
							: "Generate Prompt"}
					</button>
					<button
						type="button"
						className="secondary"
						onClick={
							handleClear
						}
						disabled={isLoading}
					>
						Clear
					</button>
				</div>
			</form>
			<div
				style={{
					display: "flex",
					justifyContent:
						"space-between",
					alignItems: "center",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "15px",
					}}
				>
					<h3>Prompt:</h3>
					{result && (
						<h5
							style={{
								color: "red",
							}}
						>
							(Fill in
							the gaps
							to
							complete
							the
							prompt)
						</h5>
					)}
				</div>

				{result && (
					<button
						type="button"
						className="secondary"
						onClick={
							toggleMarkdownPreview
						}
						style={{
							padding: "0.3rem 0.8rem",
							fontSize: "0.9rem",
						}}
					>
						{showMarkdownPreview
							? "Edit"
							: "Preview"}
					</button>
				)}
			</div>

			{showMarkdownPreview && result ? (
				<div className="result-container markdown-content">
					<ReactMarkdown>
						{result}
					</ReactMarkdown>
				</div>
			) : (
				<textarea
					value={result}
					onChange={handleResultChange}
					className="result-area"
					disabled={isLoading}
					placeholder="Your prompt will appear here"
				/>
			)}
		</div>
	);
};

export default PromptForm;
