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
    You are an expert AI resume evaluator trained to interpret unstructured resume text.

    Your goal: Analyze the candidate's resume against the provided job description and return structured, accurate, and complete insights in JSON format only.

    Resume Text (may not be perfectly formatted):
    ```
    {resume_content}
    ```

    Job Description:
    ```
    {job_description}
    ```

    Please extract and infer details — even if the resume lacks clear headings. 
    Detect experience, projects, and skills by recognizing contextual cues such as:
    - Phrases like "worked at", "interned", "developed", "built", "led", "contributed to".
    - Mentions of technologies, responsibilities, and outcomes.
    - Bullet points that describe achievements or deliverables.

    Return exactly one valid JSON object with the following structure (no extra text or markdown):

    {{
      "matchScore": <integer 0–100>,
      "keywordAnalysis": {{
        "coveragePercentage": <integer 0–100>,
        "neededKeywords": [
          {{
            "keyword": "<skill>",
            "found": <true/false>
          }}
        ]
      }},
      "overallSuggestions": "<short, actionable advice>",
      "experienceAnalysis": [
        {{
          "title": "<role or inferred experience>",
          "relevanceScore": <integer 0–10>,
          "depthScore": <integer 0–10>,
          "suggestions": [
            "<short actionable point>",
            "<short actionable point>"
          ]
        }}
      ],
      "projectAnalysis": [
        {{
          "title": "<project or inferred project>",
          "relevanceScore": <integer 0–10>,
          "complexityScore": <integer 0–8>,
          "suggestions": [
            "<short actionable point>",
            "<short actionable point>"
          ]
        }}
      ]
    }}

    **Important Rules:**
    - Always include at least one object in both `experienceAnalysis` and `projectAnalysis`, even if inferred from context.
    - Use plain text only — no markdown, no code fences.
    - Be concise but specific.
    - Do not repeat or guess skills unrelated to the resume.
    - If unsure, make reasoned inferences from context instead of leaving arrays empty.
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