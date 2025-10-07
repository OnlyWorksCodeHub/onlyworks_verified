'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function SharedReportPage() {
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = params?.token
    if (!token) return

    fetch(`/api/shared/${token}`)
      .then(res => res.json())
      .then(result => {
        setData(result)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [params])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!data || !data.report) {
    return <div>Report not found</div>
  }

  const { report, shareInfo } = data

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{report.title || 'Work Report'}</h1>

      {shareInfo && (
        <div style={{ background: '#f0f8ff', padding: '10px', marginBottom: '20px' }}>
          <p>Shared with: {shareInfo.recipientEmail}</p>
          <p>Views: {shareInfo.viewCount}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
        <div style={{ textAlign: 'center', background: '#f5f5f5', padding: '10px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{report.lines_written || 0}</div>
          <div>Lines Written</div>
        </div>
        <div style={{ textAlign: 'center', background: '#f5f5f5', padding: '10px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{report.files_modified_count || 0}</div>
          <div>Files Modified</div>
        </div>
        <div style={{ textAlign: 'center', background: '#f5f5f5', padding: '10px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{report.screenshot_count || 0}</div>
          <div>Screenshots</div>
        </div>
        <div style={{ textAlign: 'center', background: '#f5f5f5', padding: '10px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{report.errors_encountered_count || 0}</div>
          <div>Errors</div>
        </div>
      </div>

      {report.executive_summary && (
        <div style={{ background: '#f9f9f9', padding: '15px', marginBottom: '20px' }}>
          <h2>Executive Summary</h2>
          <p>{report.executive_summary}</p>
        </div>
      )}

      <div style={{ background: 'linear-gradient(45deg, #4F46E5, #7C3AED)', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h3>Want to create your own reports?</h3>
        <p>Sign up for OnlyWorks to track your productivity and share detailed reports.</p>
        <button style={{ background: 'white', color: '#4F46E5', border: 'none', padding: '10px 20px', margin: '5px', cursor: 'pointer' }}>
          Sign Up Free
        </button>
      </div>
    </div>
  )
}