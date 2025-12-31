import api from "./axios"

export const analyzeJob = async (jobId) => {
  const res = await api.post(`/ai/analyze-job/${jobId}`)
  return res.data
}
