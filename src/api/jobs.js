import api from "./axios"

export const fetchJobs= async()=>{
    const res= await api.get("/jobs")
    return res.data.jobs
}
export const createJob= async(jobdata)=>{
    const res= await api.post("/jobs",jobdata)
    return res.data
}
export const updateJobStatus= async(jobId,status)=>{
const res=await api.put(`/jobs/${jobId}`,{status})
return res.data
}

export const deleteJob= async(jobId)=>{
    const res= await api.delete(`/jobs/${jobId}`)
    return res.data
}
export const fetchJobStats = async()=>{
    const res= await api.get("/jobs/stats")
    return res.data.stats
}
export const updateJob= async(jobId,jobdata)=>{
const res= await api.put(`/jobs/${jobId}`,jobdata)
return res.data.job
}