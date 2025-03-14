import os
import json

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import CrewAI crews
from .crews.care_plan_generation.care_plan_generation_crew import CarePlanGenerator
from .crews.prompt_generation.prompt_generation_crew import PromptGenerator

app = FastAPI()

# Allow requests from the React frontend
origins = ["http://localhost:5173", "http://localhost:3000", "https://alphabase.co", "https://automations.alphabase.co"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_json_data(file_path):
    """
    Extracts data from a JSON file.

    Args:
        file_path (str): The path to the JSON file.

    Returns:
        dict: The extracted JSON data as a dictionary, or None if an error occurs.
    """
    try:
        # Use absolute path
        absolute_file_path = os.path.abspath(file_path)
        print(f"Attempting to read JSON from: {absolute_file_path}")

        with open(absolute_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print("Data extracted successfully.")
        print(f"Data: {data}")    
        return data
    except FileNotFoundError:
        print(f"Error: File not found at {absolute_file_path}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON format in {absolute_file_path}: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None
    
# Define input models for endpoints
class CarePlanInput(BaseModel):
    prompt: str


class PromptGenerationInput(BaseModel):
    base_prompt: str
    prompt_type: str


@app.get("/")
def read_root():
    care_plan_file_path = "./data/care_plan_instructions.json"
    
    care_plan_file = extract_json_data(care_plan_file_path)
    
    return {"message": care_plan_file}


# Endpoint for care plan generation
@app.post("/care-plan")
async def generate_care_plan(input_data: CarePlanInput):
    # Kickoff the care plan generation crew using input from the endpoint
    print("Started crew...")

    care_plan_file_path = "data/care_plan_instructions.json"
    score_card_file_path = "data/care_instruction_scorecard.json"
    
    care_plan_file = extract_json_data(care_plan_file_path)
    score_card_file = extract_json_data(score_card_file_path)
    
    model_input = {"prompt": input_data.prompt, "score_card_file": score_card_file,"care_plan_file": care_plan_file }

    CarePlanGenerator().crew().kickoff(inputs=model_input)
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


# This is required for Vercel serverless functions
def handler(request, context):
    return app(request, context)


if __name__ == "__main__":
    uvicorn.run(app, port=8080)

