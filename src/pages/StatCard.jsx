const StatCard = ({ title, count, color, icon }) => {
  return (
    <div className="stat-card" style={{ borderLeft: `6px solid ${color}` }}>
      <div className="stat-icon">{icon}</div>
      <div>
        <h4>{title}</h4>
        <h2>{count}</h2>
      </div>
    </div>
  )
}

export default StatCard
