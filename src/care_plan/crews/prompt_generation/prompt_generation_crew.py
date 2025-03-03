# pylint: disable=invalid-sequence-index
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

@CrewBase
class PromptGenerator:
    """
    Prompt Generation Crew
    """

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def prompt_generator(self) -> Agent:
        return Agent(
            config=self.agents_config["prompt_generator"],
        )

    @task
    def prompt_generator_task(self) -> Task:
        return Task(
            config=self.tasks_config["prompt_generator_task"],
        )

    @crew
    def crew(self) -> Crew:
        """Creates the VersionGoogle crew"""
        
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
            chat_llm="gemini-1.5-flash",
        )
