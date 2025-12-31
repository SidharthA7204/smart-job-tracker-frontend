import { useState } from "react"
import "./AddJobForm.css"

const AddJobForm = ({ onJobAdded }) => {
  const [company, setCompany] = useState("")
  const [position, setPosition] = useState("")
  const [status, setStatus] = useState("Applied")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    await onJobAdded({ company, position, status })

    setCompany("")
    setPosition("")
    setStatus("Applied")
    setLoading(false)
  }

  return (
    <form className="add-job-form" onSubmit={handleSubmit}>
      <input
        className="google-input"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        required
      />

      <input
        className="google-input"
        placeholder="Position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        required
      />

      <select
        className="google-select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option>Applied</option>
        <option>Interview</option>
        <option>Offer</option>
        <option>Rejected</option>
      </select>

      <button className="google-button" type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Job"}
      </button>
    </form>
  )
}

export default AddJobForm
