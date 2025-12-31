import { useEffect, useState } from "react"
import {
  fetchJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../api/jobs"
import { analyzeJob } from "../api/ai"
import AddJobForm from "../components/AddJobForm"
import "./dashboard.css"

// Charts
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const COLORS = ["#1a73e8", "#f9ab00", "#34a853", "#ea4335"]

const Dashboard = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(null)

  const [stats, setStats] = useState({
    Applied: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  })

  const [editingJobId, setEditingJobId] = useState(null)
  const [editCompany, setEditCompany] = useState("")
  const [editPosition, setEditPosition] = useState("")

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  // ---------------- LOAD JOBS ----------------
  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const data = await fetchJobs()
      setJobs(data)
    } catch {
      console.error("Failed to load jobs")
    } finally {
      setLoading(false)
    }
  }

  // ---------------- AUTO UPDATE STATS ----------------
  useEffect(() => {
    const newStats = {
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    }

    jobs.forEach((job) => {
      if (newStats[job.status] !== undefined) {
        newStats[job.status]++
      }
    })

    setStats(newStats)
  }, [jobs])

  // ---------------- ACTIONS ----------------
  const reload = async () => {
    const data = await fetchJobs()
    setJobs(data)
  }

  const handleAddJob = async (jobData) => {
    await createJob(jobData)
    reload()
  }

  const handleStatusChange = async (jobId, status) => {
    await updateJob(jobId, { status })
    reload()
  }

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job?")) return
    await deleteJob(jobId)
    reload()
  }

  const startEdit = (job) => {
    setEditingJobId(job._id)
    setEditCompany(job.company)
    setEditPosition(job.position)
  }

  const cancelEdit = () => {
    setEditingJobId(null)
    setEditCompany("")
    setEditPosition("")
  }

  const saveEdit = async (jobId) => {
    await updateJob(jobId, {
      company: editCompany,
      position: editPosition,
    })
    cancelEdit()
    reload()
  }

  // ---------------- AI ----------------
  const handleAnalyzeJob = async (jobId) => {
    try {
      setAiLoading(jobId)
      await analyzeJob(jobId)
      reload()
    } catch {
      alert("AI analysis failed")
    } finally {
      setAiLoading(null)
    }
  }

  // ---------------- FILTER ----------------
  const filteredJobs = jobs.filter((job) => {
    const match =
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase())

    const statusMatch =
      statusFilter === "All" || job.status === statusFilter

    return match && statusMatch
  })

  const chartData = [
    { name: "Applied", value: stats.Applied },
    { name: "Interview", value: stats.Interview },
    { name: "Offer", value: stats.Offer },
    { name: "Rejected", value: stats.Rejected },
  ]

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      <AddJobForm onJobAdded={handleAddJob} />

      {/* Filters */}
      <div className="filters">
        <input
          placeholder="Search company or position"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* Stats */}
      <h2 className="section-title">📊 Job Statistics</h2>
      <div className="stats-grid">
        {chartData.map((s) => (
          <div className="stat-card" key={s.name}>
            <span>{s.name}</span>
            <strong>{s.value}</strong>
          </div>
        ))}
      </div>

      {/* Charts */}
      <h2 className="section-title">📈 Analytics</h2>
      <div className="charts-grid">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={chartData} dataKey="value" label>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value">
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Jobs */}
      <h2 className="section-title">📋 Applications</h2>

      {loading && <p>Loading...</p>}

      {!loading && filteredJobs.length === 0 && (
        <div className="empty">No job applications yet</div>
      )}

      <div className="jobs-grid">
        {filteredJobs.map((job) => (
          <div className="job-card" key={job._id}>
            {editingJobId === job._id ? (
              <>
                <input
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                />
                <input
                  value={editPosition}
                  onChange={(e) => setEditPosition(e.target.value)}
                />
                <div className="actions">
                  <button onClick={() => saveEdit(job._id)}>Save</button>
                  <button className="ghost" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>{job.company}</h3>
                <p>{job.position}</p>

                <select
                  value={job.status}
                  onChange={(e) =>
                    handleStatusChange(job._id, e.target.value)
                  }
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>

                {/* ✅ AI RESULT DISPLAY */}
                {job.aiScore !== null && job.aiScore !== undefined && (
                  <div className="ai-result">
                    🤖 <strong>{job.aiScore}% Match</strong>
                    {Array.isArray(job.aiSuggestions) && (
                      <ul>
                        {job.aiSuggestions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <div className="actions">
                  <button
                    className="ai-btn"
                    disabled={aiLoading === job._id}
                    onClick={() => handleAnalyzeJob(job._id)}
                  >
                    {aiLoading === job._id ? "Analyzing..." : "🤖 Analyze"}
                  </button>

                  <button className="ghost" onClick={() => startEdit(job)}>
                    Edit
                  </button>

                  <button
                    className="danger"
                    onClick={() => handleDeleteJob(job._id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
