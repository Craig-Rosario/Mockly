import os
import json
import uuid
import fitz  # PyMuPDF
from flask import Flask, request, render_template, session, redirect, url_for
from analysePDF import analyse_resume_gemini,generate_mcqs_gemini

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
app.secret_key = 'a_very_unique_and_secret_string'


def extract_text_from_resume(pdf_path):
    import fitz
    doc = fitz.open(pdf_path)
    sections = []
    for page in doc:
        text = page.get_text("text")
        sections.append(text.strip())
    resume_text = "\n".join(sections)

    resume_text = "\n".join(line.strip() for line in resume_text.splitlines() if line.strip())
    return resume_text



def format_json_to_markdown(data):
    """Convert JSON analysis from Gemini into formatted Markdown."""
    markdown_report = "# Resume Analysis Report\n---\n"
    markdown_report += f"## Overall Match Score: {data.get('matchScore', 'N/A')}%\n---\n"

    # Keyword Analysis
    if 'keywordAnalysis' in data:
        kw = data['keywordAnalysis']
        markdown_report += f"### Keyword Analysis\n**Coverage:** {kw.get('coveragePercentage', 'N/A')}%\n\n"
        found = [k['keyword'] for k in kw.get('neededKeywords', []) if k['found']]
        missing = [k['keyword'] for k in kw.get('neededKeywords', []) if not k['found']]
        if found:
            markdown_report += "#### ✅ Matched Keywords\n" + "\n".join(f"- {k}" for k in found) + "\n\n"
        if missing:
            markdown_report += "#### ❌ Missing Keywords\n" + "\n".join(f"- {k}" for k in missing) + "\n\n"
        markdown_report += "---\n"

    # Overall Suggestions
    if 'overallSuggestions' in data:
        markdown_report += f"### Overall Suggestions\n{data['overallSuggestions']}\n---\n"

    # Experience Analysis
    if data.get('experienceAnalysis'):
        markdown_report += "### Experience Analysis\n"
        for exp in data['experienceAnalysis']:
            markdown_report += f"\n#### {exp.get('title', 'Untitled Experience')}\n"
            markdown_report += f"- **Relevance:** {exp.get('relevanceScore', 'N/A')}/10\n"
            markdown_report += f"- **Depth/Ownership:** {exp.get('depthScore', 'N/A')}/10\n"
            if exp.get('suggestions'):
                short_suggestions = exp['suggestions'][:2]  # Limit to 1–2 lines
                markdown_report += "- **Suggestions:**\n" + "\n".join(f"  - {s}" for s in short_suggestions) + "\n"
        markdown_report += "---\n"

    # Project Analysis
    if data.get('projectAnalysis'):
        markdown_report += "### Project Analysis\n"
        for proj in data['projectAnalysis']:
            markdown_report += f"\n#### {proj.get('title', 'Untitled Project')}\n"
            markdown_report += f"- **Relevance:** {proj.get('relevanceScore', 'N/A')}/10\n"
            markdown_report += f"- **Complexity:** {proj.get('complexityScore', 'N/A')}/8\n"
            if proj.get('suggestions'):
                short_suggestions = proj['suggestions'][:2]  # Limit to 1–2 lines
                markdown_report += "- **Suggestions:**\n" + "\n".join(f"  - {s}" for s in short_suggestions) + "\n"
        markdown_report += "---\n"

    return markdown_report

def format_mcqs_to_markdown(data):
    """Convert MCQ JSON from Gemini into formatted Markdown."""
    if not data or 'mcqs' not in data:
        return ""

    markdown_report = "<h1>📝 Generated Screening Questions</h1>\n---\n"
    for i, mcq in enumerate(data.get('mcqs', []), 1):
        markdown_report += f"**{i}. {mcq.get('question', 'No question text.')}**\n\n"
        if 'options' in mcq:
            for opt in mcq['options']:
                markdown_report += f"- {opt}\n"
        markdown_report += f"\n**✅ Correct Answer:** {mcq.get('correct_answer', 'N/A')}\n"
        markdown_report += "---\n"

    return markdown_report


# In app.py

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        resume_file = request.files.get("resume")
        job_description = request.form.get("job_description")

        if not job_description or not resume_file or resume_file.filename == "":
            # ✨ FIX: Add analysis_complete=False here
            return render_template("index.html", result="Please provide both a resume and a job description.", analysis_complete=False)

        if not resume_file.filename.lower().endswith(".pdf"):
            # ✨ FIX: Add analysis_complete=False here too
            return render_template("index.html", result="Please upload a valid PDF file.", analysis_complete=False)
        
        session['job_description'] = job_description

        # --- (Your file saving and analysis logic is correct) ---
        for f in os.listdir(app.config['UPLOAD_FOLDER']):
            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], f))
        unique_filename = f"{uuid.uuid4().hex}.pdf"
        pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        resume_file.save(pdf_path)
        resume_content = extract_text_from_resume(pdf_path)
        json_string_result = analyse_resume_gemini(resume_content, job_description)

        try:
            data = json.loads(json_string_result)
            formatted_result = format_json_to_markdown(data)
        except json.JSONDecodeError:
            formatted_result = "Error: The AI response was not in the correct format. Please try again."

        # ✨ THE MOST IMPORTANT FIX IS HERE ✨
        # You were missing analysis_complete=True
        return render_template("index.html", result=formatted_result, analysis_complete=True)

    # ✨ FIX: Also add it for the initial page load
    return render_template("index.html", result=None, analysis_complete=False)

@app.route("/mcqs", methods=["POST"])
def generate_mcqs_route():
    # Retrieve the job description from the session
    job_description = session.get('job_description')

    if not job_description:
        # If no job description is found, redirect to the homepage
        return redirect(url_for('index'))

    json_mcq_result = generate_mcqs_gemini(job_description)
    formatted_mcqs = ""

    try:
        mcq_data = json.loads(json_mcq_result)
        formatted_mcqs = format_mcqs_to_markdown(mcq_data)
    except json.JSONDecodeError:
        formatted_mcqs = "Error: The MCQ response was not in the correct format."

    # Render a new template to display the MCQs
    return render_template("mcqs.html", result=formatted_mcqs)


if __name__ == "__main__":
    app.run(debug=True)
