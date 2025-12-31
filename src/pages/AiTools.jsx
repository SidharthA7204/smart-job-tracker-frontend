import { useState } from "react"
import api from "../api/axios"
import "./aiTools.css"

const AiTools = () => {
  const [jobDescription, setJobDescription] = useState("")
  const [resume, setResume] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const parseAIResult = (raw) => {
    try {
      const cleaned = raw
        .replace("```json", "")
        .replace("```", "")
        .trim()
      return JSON.parse(cleaned)
    } catch {
      return null
    }
  }

  const analyze = async () => {
    setLoading(true)
    try {
      const res = await api.post("/ai/analyze", {
        jobDescription,
        resume,
      })
      setResult(parseAIResult(res.data.result))
    } catch {
      alert("AI analysis failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-page">
      <h1>🤖 AI Career Tools</h1>

      <div className="ai-form">
        <textarea
          placeholder="Paste Job Description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <textarea
          placeholder="Paste Resume"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        <button onClick={analyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Resume Match"}
        </button>
      </div>

      {result && (
        <div className="ai-result-card">
          <h2>🎯 Match Score</h2>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${result.matchPercentage}%` }}
            >
              {result.matchPercentage}%
            </div>
          </div>

          <h3>📈 Suggestions</h3>
          <ul>
            {result.suggestions.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AiTools
