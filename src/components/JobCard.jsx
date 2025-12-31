import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  MenuItem,
  Select,
} from "@mui/material"

const statusColor = {
  Applied: "primary",
  Interview: "warning",
  Offer: "success",
  Rejected: "error",
}

const JobCard = ({
  job,
  startEdit,
  handleDeleteJob,
  handleStatusChange,
}) => {
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        mb: 2,
        transition: "0.2s",
        "&:hover": { elevation: 4 },
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <div>
            <Typography variant="h6">{job.company}</Typography>
            <Typography variant="body2" color="text.secondary">
              {job.position}
            </Typography>
          </div>

          <Chip
            label={job.status}
            color={statusColor[job.status]}
            variant="outlined"
          />
        </Stack>

        <Stack direction="row" spacing={2} mt={2}>
          <Select
            size="small"
            value={job.status}
            onChange={(e) =>
              handleStatusChange(job._id, e.target.value)
            }
          >
            <MenuItem value="Applied">Applied</MenuItem>
            <MenuItem value="Interview">Interview</MenuItem>
            <MenuItem value="Offer">Offer</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>

          <Button size="small" onClick={() => startEdit(job)}>
            Edit
          </Button>

          <Button
            size="small"
            color="error"
            onClick={() => handleDeleteJob(job._id)}
          >
            Delete
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default JobCard
