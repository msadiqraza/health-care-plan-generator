# Care Plan Generation System

## Overview

This project is a comprehensive healthcare solution focused on generating personalized care plans using AI. The system leverages the crewAI framework to orchestrate multiple specialized AI agents that work together to extract healthcare patterns, generate appropriate prompts, create detailed care plans, and evaluate their quality.

The application is designed with HIPAA compliance in mind and uses advanced prompt engineering techniques to ensure high-quality, personalized care plans for patients with various health conditions.

## Key Components

The system is organized into several specialized crews, each handling specific aspects of the care plan generation process:

1. **Prompt Generation Crew**
   * Generates structured prompts based on specified prompt engineering techniques
   * Supports various prompt types: chain-of-thought, least-to-most, persona-based, self-consistency, and tree-of-thoughts
   * Incorporates patient health information into standardized prompt templates

2. **Care Plan Generation Crew**
   * Extracts patterns from reference healthcare plans
   * Generates comprehensive, personalized care plans based on patient information
   * Ensures plans are well-structured with clear objectives and actionable items
   * Organizes content into appropriate healthcare domains

3. **Evaluation Crew**
   * Assesses generated care plans against quality criteria
   * Provides detailed feedback and improvement suggestions
   * Scores plans on clarity, comprehensiveness, expertise, and creativity
   * Identifies gaps and suggests specific enhancements

## Architecture

The system follows the crewAI architecture pattern with:

* **Agents**: Specialized AI roles with specific expertise (defined in `agents.yaml`)
* **Tasks**: Specific assignments for agents to complete (defined in `tasks.yaml`)
* **Crews**: Orchestrated teams of agents working on related tasks

The application exposes a REST API for integration with frontend applications, allowing for care plan generation requests and returning both the generated care plan and evaluation report.

## Technology Stack

* **Backend**: Python 3.10-3.12
* **Framework**: crewAI for agent orchestration
* **API**: FastAPI (inferred from API endpoint implementation)
* **AI Models**: 
  * OpenAI models (referenced by OPENAI_API_KEY)
  * Google's Gemini models (referenced by GEMINI_API_KEY)
* **Package Management**: UV (modern Python package manager)
* **Output Format**: Markdown for generated care plans and evaluation reports

## Project Structure
```
care_plan/
├── src/
│ └── care_plan/
│ ├── api.py # API endpoints
│ ├── crews/ # Crew definitions
│ │ ├── care_plan_generation/ # Care plan generation crew
│ │ │ ├── config/ # Configuration files
│ │ │ │ ├── agents.yaml # Agent definitions
│ │ │ │ └── tasks.yaml # Task definitions
│ │ │ └── care_plan_generation_crew.py # Crew implementation
│ │ └── prompt_generation/ # Prompt generation crew
│ │ ├── config/ # Configuration files
│ │ │ ├── agents.yaml # Agent definitions
│ │ │ └── tasks.yaml # Task definitions
│ │ └── prompt_generation_crew.py # Crew implementation
│ ├── main.py # Application entry point
│ └── crew.py # Core crew logic
├── generated/ # Output directory
│ ├── care_plan.md # Generated care plans
│ └── evaluation_report.md # Evaluation reports
└── README.md # Project documentation
```

## Setup Instructions

Ensure you have Python >=3.10 <3.13 installed on your system. 

### Backend
1. **Install crewai**:
   ```bash
   pip install crewai[tools]
   ```

2. **Clone the repository**:
   ```bash
   git clone [repository-url]
   cd care_plan
   ```

3. **Install dependencies**:
   ```bash
   crewai install
   ```

4. **Configure API keys**:
   Add your API keys to the `.env` file:
   ```
   EMBEDDING_MODEL=your_openai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   MODEL=your_preferred_model
   ```

5. **Run the application**:
   ```bash
   crewai run
   ```

## API Usage

The system exposes a REST API endpoint for care plan generation:

```python
POST /care-plan
```

**Request Body**:
```json
{
  "patient_info": "35-year-old male, smoker (1 pack/day), with cough (3 days duration), dry, hacking, worse at night. Associated symptoms: malaise, mild shortness of breath, nasal congestion."
}
```

**Response**:
```json
{
  "generated": {
    "care_plan": "# Care Plan for 35-Year-Old with Cough\n...",
    "evaluation_report": "# Care Plan Evaluation\n..."
  }
}
```

## Prompt Engineering Techniques

The system supports multiple prompt engineering techniques:

1. **Chain-of-Thought**: Breaks down reasoning into sequential steps
2. **Least-to-Most**: Builds complexity gradually from basic to advanced elements
3. **Persona-Based**: Adopts specific healthcare professional perspectives
4. **Self-Consistency**: Explores multiple reasoning paths to find consistent conclusions
5. **Tree-of-Thoughts**: Creates branching reasoning paths to explore different diagnostic possibilities

## Care Plan Structure

Generated care plans typically include:

* **Patient Demographics**: Basic patient information
* **Presenting Complaint**: Detailed symptom description
* **Differential Diagnosis**: Potential diagnoses with probability estimates
* **Treatment Plan**: Organized by healthcare domains with clear objectives and action items
* **Follow-up Recommendations**: Monitoring and next steps

## Evaluation Criteria

Care plans are evaluated based on:

* **Clarity/Conciseness**: How clear and concise the plan is
* **Comprehensiveness**: How thoroughly the plan addresses all aspects of care
* **Expertise**: How well the plan demonstrates medical knowledge and best practices
* **Creativity**: How innovative and personalized the approach is

## License

[Specify license information]

## Support

For support, questions, or feedback:

- Visit the [crewAI documentation](https://docs.crewai.com)
- Reach out through the [GitHub repository](https://github.com/joaomdmoura/crewai)
- [Join the Discord community](https://discord.com/invite/X4JWnZnxPb)
- [Chat with the documentation](https://chatg.pt/DWjSBZn)
