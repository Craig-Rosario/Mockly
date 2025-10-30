import google.generativeai as genai 
from dotenv import load_dotenv
import os 

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

configuration = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain"
}

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    generation_config=configuration
)

def analyse_resume_gemini(resume_content, job_description):
    prompt = f"""
    You are an expert AI resume analyzer. Analyze the resume against the job description and return a structured JSON.

    Resume:
    ```
    {resume_content}
    ```

    Job Description:
    ```
    {job_description}
    ```

    Return only a single valid JSON object with this structure:

    1.  `matchScore`: Integer 0–100 (overall match percentage).
    2.  `keywordAnalysis`: Object with:
        - `coveragePercentage`: Integer 0–100.
        - `neededKeywords`: Array of objects, each having (include **only concrete technical skills**, e.g., programming languages, frameworks, libraries, tools, platforms, databases, etc.; **ignore generic descriptive terms**):
            - `keyword`: String.
            - `found`: Boolean.
    3.  `overallSuggestions`: String (concise, actionable advice).
    4.  `experienceAnalysis`: Array of objects:
        - `title`: Role title.
        - `relevanceScore`: 0–10.
        - `depthScore`: 0–10.
        - `suggestions`: Array of 1–2 short, actionable suggestions (≤15 words each).
    5.  `projectAnalysis`: Array of objects:
        - `title`: Project name.
        - `relevanceScore`: 0–10.
        - `complexityScore`: 0–8.
        - `suggestions`: Array of 1–2 short, actionable suggestions (≤15 words each).

    **Important:**  
    - Only list concrete, verifiable skills.  
    - Do not include any text or markdown outside of the JSON.
    """
    response = model.generate_content(prompt)
    cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
    return cleaned_response


import google.generativeai as genai

def generate_mcqs_gemini(job_description):
    """Generate MCQs based on a job description using Gemini."""
    model = genai.GenerativeModel('gemini-2.5-flash')
    prompt = f"""
    Based on the following job description, please generate 10 multiple-choice questions (MCQs) to screen a candidate.

    The questions should be a mix of two types:
    1. Direct technical questions about the specific languages, frameworks, and tools mentioned (e.g., "What is a hook in React?").
    2. Scenario-based or practical questions that test how a candidate would apply those technologies to solve a common, real-world problem (e.g., "A user reports that a web page is loading slowly. Which AWS service would be most effective for diagnosing the performance bottleneck?").

    Provide the output strictly in a clean JSON format, without any surrounding text or markdown markers. The JSON should look exactly like this:
    {{
      "mcqs": [
        {{
          "question": "The full question text.",
          "options": [
            "A. Option text 1",
            "B. Option text 2",
            "C. Option text 3",
            "D. Option text 4"
          ],
          "correct_answer": "The letter of the correct option (e.g., 'B')"
        }}
      ]
    }}

    Job Description:
    ---
    {job_description}
    ---
    """

    response = model.generate_content(prompt)
    cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
    return cleaned_response