# pylint: disable=invalid-sequence-index
import os

from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

@CrewBase
class CarePlanGenerator():
    """
    This crew is used to generate a care plan, policy, and scorecard from a document.
    Uses Google

    problem: an agent will try to use a tool to perform all tasks that may waste time when the task is conceptual in nature

    use Policy ai agent or layer based on situation
    memory: ?? to use or not to use
    text cleaning -> file_reader_task OR file_reader_task -> text cleaning
        Using: same output format for care_plan_generator_task as reference
        example form POC


        Step 1: Get data
        Step 2 - ~6: Data pre-processing
        Step 6 - 9: CrewAI setup
        Step 10 - 11: Prompt Engineering
        Step 12: Evaluation


    Step 1: Get care plans from cloud storage (for now skipping this step)

    Step 2: Convert care plans to json (Ensure correct labelling)
    Step 3: PHI pseudonymization
    Step 4: Text Cleaning
    Step 5: Further processing: split into  “Issues/Objectives” and “Care Plan Action Items” and Metadata??
    Step ~6: Security for data???

    Step 6: CrewAI setup
    Step 7: Config setup for agents and tasks (give data as example for model)
    Step 8: train() to fine-tune the model
    Step 9: Basic prompt refinement (use few-shot strategy provide examples with ranking??), (ensure meets scorecard criteria)

    Step 10: Build UI
    Step 11: Prompt Engineering (See Dynamic prompting), (Different implementation strategy, different prompt, different model, different framework, best practices, etc )

    Step 12: Evaluation

    """

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    api_key = os.environ.get("GEMINI_API_KEY")
    embedding_model = os.environ.get("EMBEDDING_MODEL")
    model = os.environ.get("MODEL")

    # Agents
    @agent
    def file_reader(self) -> Agent:
        return Agent(
            config=self.agents_config["file_reader"],
        )

    @agent
    def care_plan_generator(self) -> Agent:
        return Agent(
            config=self.agents_config["care_plan_generator"],
        )

    @agent
    def evaluator(self) -> Agent:
        return Agent(
            config=self.agents_config["evaluator"],
        )

    @task
    def file_reader_task(self) -> Task:
        return Task(
            config=self.tasks_config["file_reader_task"],
        )

    @task
    def care_plan_generator_task(self) -> Task:
        return Task(config=self.tasks_config["care_plan_generator_task"])

    @task
    def evaluator_task(self) -> Task:
        return Task(config=self.tasks_config["evaluator_task"])

    @crew
    def crew(self) -> Crew:
        """Creates the VersionGoogle crew"""

        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            memory=True,
            embedder={
                "provider": "google",
                "config": {
                    "api_key": self.api_key,
                    "model": self.embedding_model,
                },
            },
            verbose=True,
            chat_llm=self.model,
        )
