export const exportFormats = {
  CSV: 'csv',
  JSON: 'json',
  HTML: 'html',
  PDF: 'pdf'
}

export const exportReport = async (report, format = 'json') => {
  const timestamp = new Date().toISOString().slice(0, 10)
  const filename = `onlyworks-report-${report.report_date}-${timestamp}.${format.toLowerCase()}`

  let content
  let mimeType

  switch (format.toLowerCase()) {
    case 'csv':
      content = generateReportCSV(report)
      mimeType = 'text/csv'
      break
    case 'json':
      content = generateReportJSON(report)
      mimeType = 'application/json'
      break
    case 'html':
      content = generateReportHTML(report)
      mimeType = 'text/html'
      break
    default:
      throw new Error(`Unsupported export format: ${format}`)
  }

  // Create download
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  return {
    success: true,
    filename
  }
}

const generateReportCSV = (report) => {
  const headers = [
    'Field',
    'Value'
  ]

  const rows = [
    ['Title', report.title || 'Daily Work Report'],
    ['Developer', report.developer || ''],
    ['Date', report.report_date || ''],
    ['Duration', report.session_duration || ''],
    ['Screenshots', report.screenshot_count || 0],
    ['Lines Written', report.lines_written || 0],
    ['Lines Deleted', report.lines_deleted || 0],
    ['Files Modified', report.files_modified_count || 0],
    ['Errors Encountered', report.errors_encountered_count || 0],
    ['Executive Summary', `"${(report.executive_summary || '').replace(/"/g, '""')}"`],
    ['Created At', report.created_at || ''],
    ['View Count', report.view_count || 0]
  ]

  // Add completed work items
  if (report.completed_work && report.completed_work.length > 0) {
    report.completed_work.forEach((item, index) => {
      rows.push([`Completed Work ${index + 1}`, `"${item.replace(/"/g, '""')}"`])
    })
  }

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}

const generateReportJSON = (report) => {
  return JSON.stringify(report, null, 2)
}

const generateReportHTML = (report) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const completedWorkHTML = report.completed_work && report.completed_work.length > 0
    ? `<ul>${report.completed_work.map(item => `<li>${item}</li>`).join('')}</ul>`
    : '<p><em>No completed work recorded</em></p>'

  const workInProgressHTML = report.work_in_progress && report.work_in_progress.length > 0
    ? report.work_in_progress.map(item => `
        <div class="work-item">
          <h4>${item.task}</h4>
          <p>${item.details}</p>
          <p><strong>Evidence:</strong> ${item.evidence}</p>
        </div>
      `).join('')
    : ''

  const blockersHTML = report.blockers && report.blockers.length > 0
    ? report.blockers.map(blocker => `
        <div class="blocker-item">
          <h4>${blocker.issue}</h4>
          <p><strong>Evidence:</strong> ${blocker.evidence}</p>
          <p><strong>Impact:</strong> ${blocker.impact}</p>
          <p><strong>Response:</strong> ${blocker.userResponse}</p>
        </div>
      `).join('')
    : ''

  const timelineHTML = report.full_report_data?.detailedActivityTimeline && report.full_report_data.detailedActivityTimeline.length > 0
    ? report.full_report_data.detailedActivityTimeline.map(item => `
        <div class="timeline-item">
          <div class="timeline-time">${item.estimatedTime}</div>
          <div class="timeline-content">
            <h4>${item.applicationInFocus}</h4>
            <p>${item.activity}</p>
            ${item.filesWorked && item.filesWorked.length > 0 ? `<p><strong>Files:</strong> ${item.filesWorked.join(', ')}</p>` : ''}
            ${item.browserUrls && item.browserUrls.length > 0 ? `<p><strong>URLs:</strong> ${item.browserUrls.join(', ')}</p>` : ''}
            ${item.errors && item.errors.length > 0 ? `<p><strong>Errors:</strong> ${item.errors.join(', ')}</p>` : ''}
            ${item.keyObservations ? `<p><em>${item.keyObservations}</em></p>` : ''}
          </div>
        </div>
      `).join('')
    : '<p><em>No detailed timeline available</em></p>'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${report.title || 'Daily Work Report'} - OnlyWorks Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5rem;
            font-weight: 600;
        }
        .header .meta {
            margin-top: 15px;
            font-size: 1.1rem;
            opacity: 0.9;
        }
        .content {
            padding: 40px;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .metric-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e9ecef;
        }
        .metric-value {
            font-size: 2rem;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 5px;
        }
        .metric-label {
            font-size: 0.9rem;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .section {
            margin-bottom: 40px;
        }
        .section h2 {
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .section h3 {
            color: #34495e;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        .executive-summary {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            font-size: 1.1rem;
        }
        .work-item, .blocker-item {
            background: #fff;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 15px;
        }
        .blocker-item {
            border-left: 4px solid #e74c3c;
            background: #fdf2f2;
        }
        .work-item h4, .blocker-item h4 {
            margin-top: 0;
            color: #2c3e50;
        }
        .timeline-item {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 6px;
            border: 1px solid #e9ecef;
        }
        .timeline-time {
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            color: #6c757d;
            min-width: 80px;
            font-weight: bold;
        }
        .timeline-content {
            flex: 1;
        }
        .timeline-content h4 {
            margin-top: 0;
            margin-bottom: 10px;
            color: #2c3e50;
        }
        ul {
            padding-left: 20px;
        }
        li {
            margin-bottom: 8px;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 0.9rem;
        }
        @media print {
            .container {
                box-shadow: none;
            }
            .header {
                background: #667eea !important;
                -webkit-print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${report.title || 'Daily Work Report'}</h1>
            <div class="meta">
                Developer: ${report.developer || 'Unknown'} |
                Date: ${formatDate(report.report_date)} |
                Duration: ${report.session_duration || 'Unknown'}
            </div>
        </div>

        <div class="content">
            <div class="metrics">
                <div class="metric-card">
                    <div class="metric-value">${report.lines_written || 0}</div>
                    <div class="metric-label">Lines Written</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${report.files_modified_count || 0}</div>
                    <div class="metric-label">Files Modified</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${report.screenshot_count || 0}</div>
                    <div class="metric-label">Screenshots</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${report.errors_encountered_count || 0}</div>
                    <div class="metric-label">Errors</div>
                </div>
            </div>

            <div class="section">
                <h2>Executive Summary</h2>
                <div class="executive-summary">
                    ${report.executive_summary || 'No executive summary available.'}
                </div>
            </div>

            <div class="section">
                <h2>Completed Work</h2>
                ${completedWorkHTML}
            </div>

            ${workInProgressHTML ? `
            <div class="section">
                <h2>Work In Progress</h2>
                ${workInProgressHTML}
            </div>
            ` : ''}

            ${blockersHTML ? `
            <div class="section">
                <h2>Blockers</h2>
                ${blockersHTML}
            </div>
            ` : ''}

            <div class="section">
                <h2>Activity Timeline</h2>
                ${timelineHTML}
            </div>
        </div>

        <div class="footer">
            <p>Generated by OnlyWorks on ${new Date().toLocaleDateString()}</p>
            <p>Report ID: ${report.id} | Processing Time: ${report.processing_time_ms || 0}ms</p>
        </div>
    </div>
</body>
</html>`
}