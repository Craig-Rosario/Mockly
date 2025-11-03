import jsPDF from 'jspdf'

export interface PDFGenerationOptions {
  filename?: string
  format?: 'a4' | 'letter'
  orientation?: 'portrait' | 'landscape'
}

/**
 * Generate a structured and visually enhanced PDF report
 */
export const generateStructuredPDF = async (
  reportData: any,
  options: PDFGenerationOptions = {}
): Promise<void> => {
  const {
    filename = 'mockly-final-report.pdf',
    format = 'a4',
    orientation = 'portrait'
  } = options

  try {
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let yPosition = 20

    // --- Utility Functions ---
    const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 12, bold = false) => {
      pdf.setFont('helvetica', bold ? 'bold' : 'normal')
      pdf.setFontSize(fontSize)
      const lines = pdf.splitTextToSize(text, maxWidth)
      pdf.text(lines, x, y)
      return y + (lines.length * fontSize * 0.35)
    }

    const checkNewPage = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - 20) {
        pdf.addPage()
        yPosition = 20
      }
    }

    const addSectionHeader = (title: string) => {
      yPosition += 8
      checkNewPage(15)
      pdf.setFillColor(240, 240, 240)
      pdf.rect(15, yPosition - 5, pageWidth - 30, 10, 'F')
      pdf.setTextColor(33, 33, 33)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(16)
      pdf.text(title, 20, yPosition + 2)
      yPosition += 12
    }

    // --- Title ---
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(26)
    pdf.setTextColor(59, 130, 246)
    pdf.text('Mockly - Final Assessment Report', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    // Date
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(12)
    pdf.setTextColor(100)
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition)
    yPosition += 15

    // --- Assessment Scores ---
    addSectionHeader('Assessment Scores')
    pdf.setFontSize(13)
    pdf.setTextColor(0)

    const addScoreLine = (label: string, value: string | number) => {
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${label}:`, 25, yPosition)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`${value}`, 80, yPosition)
      yPosition += 8
    }

    addScoreLine('Total Score', `${reportData.totalScore || 0}/100`)
    addScoreLine('Job Match', `${reportData.jobMatch || 0}%`)
    addScoreLine('Resume Score', `${reportData.resumeScore || 0}%`)
    addScoreLine('MCQ Score', `${reportData.mcqScore || 0}%`)
    yPosition += 5

    // --- MCQ Details ---
    if (reportData.mcqData) {
      addSectionHeader('MCQ Performance Details')
      pdf.setFontSize(12)
      addScoreLine('Questions Answered', `${reportData.mcqData.correctAnswers || 0}/${reportData.mcqData.totalQuestions || 0}`)
      addScoreLine('Time Taken', `${Math.round((reportData.mcqData.timeTaken || 0) / 60)} minutes`)
      yPosition += 4

      if (Array.isArray(reportData.mcqData.topicWisePerformance)) {
        pdf.setFont('helvetica', 'bold')
        pdf.text('Topic-wise Performance:', 25, yPosition)
        yPosition += 7

        pdf.setFont('helvetica', 'normal')
        reportData.mcqData.topicWisePerformance.forEach((topic: any) => {
          if (topic && topic.topic) {
            checkNewPage(8)
            pdf.text(`• ${topic.topic}: ${topic.percentage || 0}% (${topic.correct || 0}/${topic.total || 0})`, 30, yPosition)
            yPosition += 6
          }
        })
      }
    }

    // --- Resume Analysis ---
    if (reportData.resumeData) {
      addSectionHeader('Resume Analysis')
      pdf.setFontSize(12)

      if (reportData.resumeData.keywordAnalysis) {
        addScoreLine('Keyword Coverage', `${reportData.resumeData.keywordAnalysis.coveragePercentage || 0}%`)

        const missingKeywords = reportData.resumeData.keywordAnalysis.neededKeywords?.filter((k: any) => !k.found) || []
        if (missingKeywords.length > 0) {
          pdf.setFont('helvetica', 'bold')
          pdf.text('Missing Keywords:', 25, yPosition)
          yPosition += 6

          pdf.setFont('helvetica', 'normal')
          missingKeywords.slice(0, 5).forEach((k: any) => {
            pdf.text(`• ${k.keyword}`, 30, yPosition)
            yPosition += 5
          })
        }
        yPosition += 5
      }

      if (reportData.resumeData.overallSuggestions) {
        pdf.setFont('helvetica', 'bold')
        yPosition = addText('Overall Suggestions:', 25, yPosition, pageWidth - 40, 12, true)
        pdf.setFont('helvetica', 'normal')
        yPosition = addText(reportData.resumeData.overallSuggestions, 30, yPosition, pageWidth - 40, 11)
      }

      // Experience
      if (Array.isArray(reportData.resumeData.experienceAnalysis)) {
        yPosition += 5
        pdf.setFont('helvetica', 'bold')
        pdf.text('Experience Analysis:', 25, yPosition)
        yPosition += 8

        pdf.setFont('helvetica', 'normal')
        reportData.resumeData.experienceAnalysis.slice(0, 3).forEach((exp: any) => {
          checkNewPage(15)
          pdf.text(`• ${exp.title} - Relevance: ${exp.relevanceScore || 0}/10, Depth: ${exp.depthScore || 0}/10`, 30, yPosition)
          yPosition += 6

          // Add experience suggestions if available
          if (Array.isArray(exp.suggestions) && exp.suggestions.length > 0) {
            pdf.setTextColor(80, 80, 80)
            exp.suggestions.slice(0, 2).forEach((suggestion: string) => {
              if (suggestion) {
                checkNewPage(8)
                yPosition = addText(`  - ${suggestion}`, 35, yPosition, pageWidth - 60, 10)
                yPosition += 2
              }
            })
            pdf.setTextColor(0, 0, 0) // Reset color
            yPosition += 3
          }
        })
      }

      // Projects
      if (Array.isArray(reportData.resumeData.projectAnalysis)) {
        yPosition += 5
        pdf.setFont('helvetica', 'bold')
        pdf.text('Project Analysis:', 25, yPosition)
        yPosition += 8

        pdf.setFont('helvetica', 'normal')
        reportData.resumeData.projectAnalysis.slice(0, 3).forEach((p: any) => {
          pdf.text(`• ${p.title} - Relevance: ${p.relevanceScore || 0}/10, Complexity: ${p.complexityScore || 0}/8`, 30, yPosition)
          yPosition += 6

          if (Array.isArray(p.suggestions) && p.suggestions.length > 0) {
            // Set suggestions text to grey
            pdf.setTextColor(100, 100, 100)
            p.suggestions.slice(0, 2).forEach((s: string) => {
              if (s) {
                yPosition = addText(`  - ${s}`, 35, yPosition, pageWidth - 60, 10)
                yPosition += 2
              }
            })
            // Reset color to black for following sections
            pdf.setTextColor(0, 0, 0)
            yPosition += 3
          }
        })
      }

    }

    // --- Improvements ---
    if (Array.isArray(reportData.improvements) && reportData.improvements.length > 0) {
      addSectionHeader('Areas for Improvement')
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(12)

      reportData.improvements.forEach((imp: any, i: number) => {
        checkNewPage(25)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`${i + 1}. ${imp.title}`, 25, yPosition)
        yPosition += 6

        pdf.setFont('helvetica', 'normal')
        yPosition = addText(imp.description || '', 30, yPosition, pageWidth - 50, 11)
        pdf.setTextColor(120)
        pdf.text(`Priority: ${imp.severity?.toUpperCase() || 'N/A'}`, 30, yPosition + 3)
        pdf.setTextColor(0)
        yPosition += 10
      })
    }

    // --- Footer ---
    const totalPages = pdf.internal.pages.length - 1
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      pdf.setFontSize(10)
      pdf.setTextColor(150)
      pdf.text(
        `Page ${i} of ${totalPages} | Generated by Mockly`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
    }

    pdf.save(filename)
  } catch (error) {
    console.error('Error generating structured PDF:', error)
    throw new Error('Failed to generate PDF. Please try again.')
  }
}
