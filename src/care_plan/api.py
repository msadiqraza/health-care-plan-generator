import os

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import CrewAI crews
from .crews.care_plan_generation.care_plan_generation_crew import CarePlanGenerator
from .crews.prompt_generation.prompt_generation_crew import PromptGenerator

app = FastAPI()

# Allow requests from the React frontend
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define input models for endpoints
class CarePlanInput(BaseModel):
    prompt: str


class PromptGenerationInput(BaseModel):
    base_prompt: str
    prompt_type: str


@app.get("/")
def read_root():
    return {"message": "Hello from Crew.ai FastAPI project!"}


# Endpoint for care plan generation
@app.post("/care-plan")
async def generate_care_plan(input_data: CarePlanInput):
    # Kickoff the care plan generation crew using input from the endpoint
    print("Started crew...")
    CarePlanGenerator().crew().kickoff(inputs=input_data.model_dump())
    print("Crew finished.")

    # Ensure the generated directory exists
    os.makedirs("generated", exist_ok=True)

    # Read the generated care plan and evaluation report from files
    care_plan_path = os.path.join("generated", "care_plan.md")
    evaluation_path = os.path.join("generated", "evaluation_report.md")

    generated_data = {"generated": {}}

    # Read care plan if it exists
    if os.path.exists(care_plan_path):
        with open(care_plan_path, "r", encoding="utf-8") as f:
            generated_data["generated"]["care_plan"] = f.read()
    else:
        generated_data["generated"]["care_plan"] = "No care plan was generated"

    # Read evaluation report if it exists
    if os.path.exists(evaluation_path):
        with open(evaluation_path, "r", encoding="utf-8") as f:
            generated_data["generated"]["evaluation_report"] = f.read()
    else:
        generated_data["generated"]["evaluation_report"] = "No evaluation was generated"

    return generated_data


# Endpoint for prompt generation
@app.post("/prompt")
async def generate_prompt(input_data: PromptGenerationInput):
    # Kickoff the prompt generation crew using input from the endpoint
    result = PromptGenerator().crew().kickoff(inputs=input_data.model_dump())
    return {"prompt": result.raw}


# Replace the old handler with a Mangum adapter at the module level:
from mangum import Mangum

handler = Mangum(app)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

# # TESTING
# @app.get("/care-plan/test")
# async def test_care_plan():
#     # Kickoff the care plan generation crew using input from the endpoint
#     filename = "data/care_instructions.pk1"
#     file_path = "data/care_plan_instructions.json"

#     import json

#     with open(file_path, "r") as f:
#         care_plan = json.load(f)

#     context_string = (
#         "Always refer to the following optimal care plan when generating a new one:"
#         + json.dumps(care_plan)
#     )

#     inputs = {
#         "context": context_string,
#         "learning_rate": 0.001,
#         "batch_size": 32,  # Adjust based on your system capabilities
#         "output_mode": "prompt_only",  # Ensure outputs are limited to care plan prompts
#         "prompt": "The given context contains the perfect care plan. **ALWAYS** keep it in mind when responding.",
#     }

#     CarePlanGenerator().crew().train(n_iterations=5, inputs=inputs, filename=filename)
#     return {"care_plan": "Yes"}
