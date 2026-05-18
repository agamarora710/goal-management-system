import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import api from "../services/api"
import { Users, CheckCircle, Clock3, MessageSquare, Share2, X, ChevronDown, Check } from "lucide-react"

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

  .md-root { font-family: 'DM Sans', sans-serif; color: #0f1923; }

  .md-page-header { margin-bottom: 2rem; }
  .md-page-title { font-size: 22px; font-weight: 600; letter-spacing: -0.02em; color: #0f1923; margin: 0 0 4px; }
  .md-page-sub { font-size: 13.5px; color: #6b7280; margin: 0; }

  .md-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 2rem; }
  .md-stat { background: white; border: 1px solid #f0eeeb; border-radius: 14px; padding: 20px 22px; display: flex; flex-direction: column; gap: 12px; }
  .md-stat-top { display: flex; align-items: center; justify-content: space-between; }
  .md-stat-label { font-size: 12.5px; font-weight: 500; color: #6b7280; }
  .md-stat-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
  .md-stat-icon.blue { background: #eff6ff; color: #3b82f6; }
  .md-stat-icon.green { background: #f0fdf4; color: #16a34a; }
  .md-stat-icon.orange { background: #fff7ed; color: #ea580c; }
  .md-stat-value { font-size: 28px; font-weight: 600; letter-spacing: -0.03em; line-height: 1; }
  .md-stat-value.blue { color: #3b82f6; }
  .md-stat-value.green { color: #16a34a; }
  .md-stat-value.orange { color: #ea580c; }

  .md-card { background: white; border: 1px solid #f0eeeb; border-radius: 16px; padding: 24px; margin-bottom: 16px; }
  .md-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .md-card-title { font-size: 15px; font-weight: 600; color: #0f1923; margin: 0; }

  .md-escalation-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f4;
}

.md-escalation-row:last-child {
  border-bottom: none;
}

.md-escalation-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.md-escalation-user {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.md-escalation-msg {
  font-size: 13px;
  color: #6b7280;
}

.md-escalation-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.md-level {
  background: #fef3c7;
  color: #b45309;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.md-escalation-empty {
  padding: 30px;
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
}
  .md-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 9px; font-size: 13px; font-weight: 500;
    cursor: pointer; border: none; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .md-btn.primary { background: #0f1923; color: white; }
  .md-btn.primary:hover { background: #1e2d3d; }
  .md-btn.purple { background: #7c3aed; color: white; }
  .md-btn.purple:hover { background: #6d28d9; }
  .md-btn.ghost { background: #f5f4f0; color: #374151; border: 1px solid #e5e7eb; }
  .md-btn.ghost:hover { background: #edecea; }
  .md-btn.approve { background: #dcfce7; color: #15803d; }
  .md-btn.approve:hover { background: #bbf7d0; }
  .md-btn.reject { background: #fef2f2; color: #dc2626; }
  .md-btn.reject:hover { background: #fecaca; }
  .md-btn.comment { background: #eff6ff; color: #1d4ed8; }
  .md-btn.comment:hover { background: #dbeafe; }
  .md-btn.save { background: #3b82f6; color: white; }
  .md-btn.save:hover { background: #2563eb; }
  .md-btn.sm { padding: 5px 10px; font-size: 12px; border-radius: 7px; }

  table.md-table { width: 100%; border-collapse: collapse; }
  .md-table th { font-size: 11.5px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: #9ca3af; padding: 0 12px 10px; text-align: left; border-bottom: 1px solid #f0eeeb; }
  .md-table th.center { text-align: center; }
  .md-table td { padding: 13px 12px; border-bottom: 1px solid #f9f8f7; font-size: 13.5px; vertical-align: middle; }
  .md-table tr:last-child td { border-bottom: none; }
  .md-table tr:hover td { background: #fafaf9; }
  .md-table td.center { text-align: center; }

  .md-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11.5px; font-weight: 500; }
  .md-badge.q { background: #eff6ff; color: #1d4ed8; }
  .md-badge.on-track { background: #eff6ff; color: #1d4ed8; }
  .md-badge.completed { background: #f0fdf4; color: #15803d; }
  .md-badge.not-started { background: #f5f4f0; color: #6b7280; }
  .md-badge.approved { background: #f0fdf4; color: #15803d; }

  .md-progress-val { font-weight: 600; font-size: 13.5px; }
  .md-progress-val.high { color: #16a34a; }
  .md-progress-val.mid { color: #d97706; }
  .md-progress-val.low { color: #dc2626; }

  .md-empty { padding: 40px; text-align: center; color: #9ca3af; font-size: 13.5px; }

  .md-select {
    padding: 7px 30px 7px 12px; border: 1.5px solid #e5e7eb; border-radius: 9px;
    font-size: 13px; color: #374151; background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 10px center;
    outline: none; font-family: 'DM Sans', sans-serif; cursor: pointer; appearance: none;
  }
  .md-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }

  /* Shared goal modal */
  .md-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem; }
  .md-modal { background: white; border-radius: 18px; padding: 28px; width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
  .md-modal-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
  .md-modal-title { font-size: 16px; font-weight: 600; color: #0f1923; margin: 0 0 4px; }
  .md-modal-sub { font-size: 13px; color: #6b7280; margin: 0; }
  .md-modal-close { background: none; border: none; cursor: pointer; color: #9ca3af; padding: 2px; border-radius: 6px; }
  .md-modal-close:hover { background: #f5f4f0; color: #374151; }
  .md-modal-footer { display: flex; gap: 8px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #f0eeeb; }

  .md-field { margin-bottom: 14px; }
  .md-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .md-label { display: block; font-size: 12px; font-weight: 500; color: #374151; margin-bottom: 5px; }
  .md-input {
    width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 9px;
    font-size: 13.5px; color: #0f1923; background: white; outline: none;
    font-family: 'DM Sans', sans-serif; box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s; appearance: none;
  }
  .md-input:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
  .md-input::placeholder { color: #9ca3af; }
  textarea.md-input { resize: vertical; }

  .md-alert { display: flex; align-items: flex-start; gap: 10px; padding: 11px 14px; border-radius: 10px; font-size: 13px; margin-bottom: 16px; }
  .md-alert.purple { background: #faf5ff; border: 1px solid #e9d5ff; color: #7c3aed; }

  /* Employee checkbox list */
  .md-emp-list { border: 1.5px solid #e5e7eb; border-radius: 9px; background: white; max-height: 160px; overflow-y: auto; }
  .md-emp-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-bottom: 1px solid #f9f8f7; cursor: pointer; transition: background 0.1s; }
  .md-emp-item:last-child { border-bottom: none; }
  .md-emp-item:hover { background: #fafaf9; }
  .md-checkbox { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid #d1d5db; background: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; }
  .md-checkbox.checked { background: #7c3aed; border-color: #7c3aed; }
  .md-emp-name { font-size: 13.5px; color: #0f1923; }
  .md-emp-count { font-size: 12px; color: #7c3aed; margin-top: 5px; font-weight: 500; }

  /* Inline comment box */
  .md-comment-wrap { display: flex; flex-direction: column; gap: 6px; }
  .md-comment-text { font-size: 12px; color: #6b7280; font-style: italic; max-width: 180px; }
  .md-comment-textarea { width: 100%; border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 6px 10px; font-size: 12.5px; font-family: 'DM Sans', sans-serif; outline: none; resize: none; box-sizing: border-box; }
  .md-comment-textarea:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .md-comment-actions { display: flex; gap: 5px; }

  .md-employee-name { font-weight: 500; font-size: 13.5px; }
  .md-goal-title { font-size: 13.5px; color: #374151; }
`

function ManagerDashboard() {
  const [dashboard, setDashboard] = useState([])
  const [approvedGoals, setApprovedGoals] = useState([])
  const [teamUpdates, setTeamUpdates] = useState([])
  const [employees, setEmployees] = useState([])
  const [escalations, setEscalations] = useState([])
  const [commentingUpdate, setCommentingUpdate] = useState(null)
  const [comment, setComment] = useState("")
  const [filterQuarter, setFilterQuarter] = useState("All")
  const [showSharedForm, setShowSharedForm] = useState(false)
  const [sharedForm, setSharedForm] = useState({
    title: "", description: "", goalType: "NUMERIC_MAX",
    targetValue: "", primaryOwnerId: "", employeeIds: [],
  })

  const token = localStorage.getItem("token")
  const headers = { Authorization: token }

  useEffect(() => {
  fetchDashboard()
  fetchApproved()
  fetchTeamUpdates()
  fetchEmployees()
  fetchEscalations()
}, [])

  const fetchDashboard = async () => {
    try { const r = await api.get("/manager/submitted-goals", { headers }); setDashboard(r.data.goals || []) }
    catch (e) { console.log(e) }
  }
  const fetchApproved = async () => {
    try { const r = await api.get("/manager/approved-goals", { headers }); setApprovedGoals(r.data.goals || []) }
    catch (e) { console.log(e) }
  }
  const fetchTeamUpdates = async () => {
    try { const r = await api.get("/manager/quarterly-updates", { headers }); setTeamUpdates(r.data.updates || []) }
    catch (e) { console.log(e) }
  }
  const fetchEmployees = async () => {
    try { const r = await api.get("/manager/employees", { headers }); setEmployees(r.data.employees || []) }
    catch (e) { console.log(e) }
  }
  const fetchEscalations = async () => {
  try {
    const r = await api.get(
      "/manager/escalations",
      { headers }
    )

    setEscalations(
      r.data.escalations || []
    )

  } catch (e) {
    console.log(e)
  }
}

  const approveGoal = async (goalId) => {
    try { await api.put(`/manager/goals/${goalId}/approve`, {}, { headers }); fetchDashboard(); fetchApproved() }
    catch { alert("Failed to approve goal") }
  }
  const rejectGoal = async (goalId) => {
    try { await api.put(`/manager/goals/${goalId}/reject`, {}, { headers }); fetchDashboard(); fetchApproved() }
    catch { alert("Failed to reject goal") }
  }

  const submitComment = async () => {
    if (!comment.trim()) return alert("Please enter a comment")
    try {
      await api.put(`/manager/quarterly-updates/${commentingUpdate}/comment`, { comment }, { headers })
      setCommentingUpdate(null); setComment(""); fetchTeamUpdates()
    } catch { alert("Failed to add comment") }
  }

  const handleSharedFormChange = (e) => setSharedForm({ ...sharedForm, [e.target.name]: e.target.value })

  const toggleEmployee = (empId) => {
    const id = Number(empId)
    setSharedForm((prev) => ({
      ...prev,
      employeeIds: prev.employeeIds.includes(id)
        ? prev.employeeIds.filter((e) => e !== id)
        : [...prev.employeeIds, id],
    }))
  }

  const submitSharedGoal = async () => {
    if (!sharedForm.title || !sharedForm.targetValue || !sharedForm.primaryOwnerId)
      return alert("Please fill all required fields and select a primary owner")
    if (sharedForm.employeeIds.length === 0)
      return alert("Please select at least one employee")
    try {
      await api.post("/manager/shared-goal", {
        title: sharedForm.title, description: sharedForm.description,
        goalType: sharedForm.goalType, targetValue: parseFloat(sharedForm.targetValue),
        primaryOwnerId: Number(sharedForm.primaryOwnerId), employeeIds: sharedForm.employeeIds,
      }, { headers })
      setShowSharedForm(false)
      setSharedForm({ title: "", description: "", goalType: "NUMERIC_MAX", targetValue: "", primaryOwnerId: "", employeeIds: [] })
    } catch (err) { alert(err.response?.data?.error || "Failed to push shared goal") }
  }

  const progressClass = (p) => p >= 80 ? "high" : p >= 50 ? "mid" : "low"
  const filteredUpdates = filterQuarter === "All" ? teamUpdates : teamUpdates.filter((u) => u.quarter === filterQuarter)

  return (
    <DashboardLayout>
      <style>{S}</style>
      <div className="md-root">

        <div className="md-page-header">
          <h1 className="md-page-title">Manager Dashboard</h1>
          <p className="md-page-sub">Review goal submissions, track team progress, and manage shared goals.</p>
        </div>

        {/* Stats */}
        <div className="md-stats">
          <div className="md-stat">
            <div className="md-stat-top">
              <span className="md-stat-label">Pending Requests</span>
              <div className="md-stat-icon blue"><Users size={16} /></div>
            </div>
            <div className="md-stat-value blue">{dashboard?.length || 0}</div>
          </div>
          <div className="md-stat">
            <div className="md-stat-top">
              <span className="md-stat-label">Approved Goals</span>
              <div className="md-stat-icon green"><CheckCircle size={16} /></div>
            </div>
            <div className="md-stat-value green">{approvedGoals?.length || 0}</div>
          </div>
          <div className="md-stat">
            <div className="md-stat-top">
              <span className="md-stat-label">Check-ins Received</span>
              <div className="md-stat-icon orange"><Clock3 size={16} /></div>
            </div>
            <div className="md-stat-value orange">{teamUpdates?.length || 0}</div>
          </div>
        </div>

{/* Escalations */}
<div className="md-card">

  <div className="md-card-header">

    <div>
      <h2 className="md-card-title">
        Pending Escalations
      </h2>

      <p
        style={{
          fontSize: 13,
          color: "#6b7280",
          marginTop: 4,
        }}
      >
        Employees requiring attention
      </p>
    </div>

    <div
      style={{
        background: "#fef2f2",
        color: "#dc2626",
        padding: "5px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {escalations.length} Open
    </div>

  </div>

  {escalations.length === 0 ? (

    <div className="md-escalation-empty">
      No active escalations.
    </div>

  ) : (

    escalations.map((esc) => (

      <div
        key={esc.ID}
        className="md-escalation-row"
      >

        <div className="md-escalation-left">

          <div
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: "#111827",
            }}
          >
            {esc.EmployeeName}
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            {esc.Message}
          </div>

        </div>

        <div className="md-escalation-right">

          <span className="md-level">
            Level {esc.EscalationLevel}
          </span>

          <span
            style={{
              fontSize: 12,
              color: "#9ca3af",
            }}
          >
            {esc.CreatedAt}
          </span>

        </div>

      </div>

    ))

  )}

</div>
        {/* Pending Requests */}
        <div className="md-card">
          <div className="md-card-header">
            <h2 className="md-card-title">Pending Goal Requests</h2>
            {dashboard?.length > 0 && (
              <span style={{ fontSize: 12, background: "#fffbeb", color: "#b45309", padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>
                {dashboard.length} awaiting review
              </span>
            )}
          </div>
          <table className="md-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Goal</th>
                <th className="center">Weightage</th>
                <th className="center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!dashboard?.length && <tr><td colSpan="4" className="md-empty">No pending requests.</td></tr>}
              {dashboard?.filter(Boolean).map((goal, i) => (
                <tr key={i}>
                  <td><span className="md-employee-name">{goal.employeeName}</span></td>
                  <td><span className="md-goal-title">{goal.title}</span></td>
                  <td className="center" style={{ fontWeight: 600, color: "#3b82f6" }}>{goal.weightage}%</td>
                  <td className="center">
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <button className="md-btn approve sm" onClick={() => approveGoal(goal.id)}>
                        <Check size={12} /> Approve
                      </button>
                      <button className="md-btn reject sm" onClick={() => rejectGoal(goal.id)}>
                        <X size={12} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Approved Goals */}
        <div className="md-card">
          <div className="md-card-header">
            <h2 className="md-card-title">Approved Goals Progress</h2>
          </div>
          <table className="md-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Goal</th>
                <th className="center">Weightage</th>
                <th className="center">Progress</th>
                <th className="center">Status</th>
              </tr>
            </thead>
            <tbody>
              {!approvedGoals?.length && <tr><td colSpan="5" className="md-empty">No approved goals yet.</td></tr>}
              {approvedGoals?.filter(Boolean).map((goal, i) => (
                <tr key={i}>
                  <td><span className="md-employee-name">{goal.employeeName}</span></td>
                  <td><span className="md-goal-title">{goal.title}</span></td>
                  <td className="center" style={{ fontWeight: 500 }}>{goal.weightage}%</td>
                  <td className="center">
                    <span className={`md-progress-val ${progressClass(goal.progress)}`}>{goal.progress}%</span>
                  </td>
                  <td className="center">
                    <span className="md-badge approved"><span>●</span> {goal.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Shared Goals */}
        <div className="md-card">
          <div className="md-card-header">
            <h2 className="md-card-title">Shared Goals</h2>
            <button className="md-btn purple" onClick={() => setShowSharedForm(true)}>
              <Share2 size={14} /> Push Shared Goal
            </button>
          </div>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
            Push departmental KPIs to multiple employees. Recipients can only adjust weightage — title and target are locked.
          </p>
        </div>

        {/* Team Check-ins */}
        <div className="md-card">
          <div className="md-card-header">
            <h2 className="md-card-title">Team Quarterly Check-ins</h2>
            <select className="md-select" value={filterQuarter} onChange={(e) => setFilterQuarter(e.target.value)}>
              <option value="All">All Quarters</option>
              <option value="Q1">Q1</option>
              <option value="Q2">Q2</option>
              <option value="Q3">Q3</option>
              <option value="Q4">Q4</option>
            </select>
          </div>
          <table className="md-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Goal</th>
                <th className="center">Quarter</th>
                <th className="center">Planned</th>
                <th className="center">Actual</th>
                <th className="center">Progress</th>
                <th className="center">Status</th>
                <th className="center">Comment</th>
              </tr>
            </thead>
            <tbody>
              {!filteredUpdates?.length && <tr><td colSpan="8" className="md-empty">No check-ins received yet.</td></tr>}
              {filteredUpdates?.filter(Boolean).map((u, i) => (
                <tr key={i}>
                  <td><span className="md-employee-name">{u.employeeName}</span></td>
                  <td><span className="md-goal-title">{u.goalTitle}</span></td>
                  <td className="center"><span className="md-badge q">{u.quarter}</span></td>
                  <td className="center" style={{ fontSize: 13 }}>{u.plannedValue}</td>
                  <td className="center" style={{ fontSize: 13 }}>{u.actualValue}</td>
                  <td className="center">
                    <span className={`md-progress-val ${progressClass(u.progress)}`}>{u.progress}%</span>
                  </td>
                  <td className="center">
                    <span className={`md-badge ${u.status === "Completed" ? "completed" : u.status === "On Track" ? "on-track" : "not-started"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="center">
                    {commentingUpdate === u.id ? (
                      <div className="md-comment-wrap">
                        <textarea
                          className="md-comment-textarea"
                          rows={2}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="md-comment-actions">
                          <button className="md-btn save sm" onClick={submitComment}>Save</button>
                          <button className="md-btn ghost sm" onClick={() => { setCommentingUpdate(null); setComment("") }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="md-comment-wrap" style={{ alignItems: "center" }}>
                        {u.managerComment && <p className="md-comment-text">{u.managerComment}</p>}
                        <button
                          className="md-btn comment sm"
                          onClick={() => { setCommentingUpdate(u.id); setComment(u.managerComment || "") }}
                        >
                          <MessageSquare size={12} />
                          {u.managerComment ? "Edit" : "Add Comment"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Shared Goal Modal */}
        {showSharedForm && (
          <div className="md-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowSharedForm(false)}>
            <div className="md-modal">
              <div className="md-modal-header">
                <div>
                  <p className="md-modal-title">Push Shared Goal</p>
                  <p className="md-modal-sub">Title and target will be read-only for recipients.</p>
                </div>
                <button className="md-modal-close" onClick={() => setShowSharedForm(false)}><X size={18} /></button>
              </div>

              <div className="md-field">
                <label className="md-label">Goal Title</label>
                <input name="title" className="md-input" value={sharedForm.title} onChange={handleSharedFormChange} placeholder="e.g. Department Revenue Target Q2" />
              </div>
              <div className="md-field">
                <label className="md-label">Description</label>
                <textarea name="description" className="md-input" rows={2} value={sharedForm.description} onChange={handleSharedFormChange} placeholder="Brief description…" />
              </div>
              <div className="md-field-grid">
                <div className="md-field">
                  <label className="md-label">Goal Type</label>
                  <select name="goalType" className="md-input" value={sharedForm.goalType} onChange={handleSharedFormChange}>
                    <option value="NUMERIC_MAX">Numeric — Higher is better</option>
                    <option value="NUMERIC_MIN">Numeric — Lower is better</option>
                    <option value="ZERO">Zero — Zero = Success</option>
                  </select>
                </div>
                <div className="md-field">
                  <label className="md-label">Target Value</label>
                  <input name="targetValue" type="number" className="md-input" value={sharedForm.targetValue} onChange={handleSharedFormChange} placeholder="e.g. 1000000" />
                </div>
              </div>
              <div className="md-field">
                <label className="md-label">Primary Owner</label>
                <select name="primaryOwnerId" className="md-input" value={sharedForm.primaryOwnerId} onChange={handleSharedFormChange}>
                  <option value="">Select primary owner…</option>
                  {employees.map((emp) => <option key={emp.ID} value={emp.ID}>{emp.Name}</option>)}
                </select>
              </div>
              <div className="md-field">
                <label className="md-label">Push To Employees</label>
                <div className="md-emp-list">
                  {employees.length === 0 && <div style={{ padding: "12px", fontSize: 13, color: "#9ca3af" }}>No employees found</div>}
                  {employees.map((emp) => (
                    <div key={emp.ID} className="md-emp-item" onClick={() => toggleEmployee(emp.ID)}>
                      <div className={`md-checkbox ${sharedForm.employeeIds.includes(emp.ID) ? "checked" : ""}`}>
                        {sharedForm.employeeIds.includes(emp.ID) && <Check size={10} color="white" strokeWidth={3} />}
                      </div>
                      <span className="md-emp-name">{emp.Name}</span>
                    </div>
                  ))}
                </div>
                {sharedForm.employeeIds.length > 0 && (
                  <p className="md-emp-count">{sharedForm.employeeIds.length} employee{sharedForm.employeeIds.length > 1 ? "s" : ""} selected</p>
                )}
              </div>

              <div className="md-modal-footer">
                <button className="md-btn purple" onClick={submitSharedGoal}>
                  <Share2 size={14} /> Push to Employees
                </button>
                <button className="md-btn ghost" onClick={() => setShowSharedForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}

export default ManagerDashboard