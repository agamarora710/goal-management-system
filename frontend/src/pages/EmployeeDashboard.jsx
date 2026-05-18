import { useEffect, useState } from "react"
import DashboardLayout from "../layouts/DashboardLayout"
import api from "../services/api"
import { Target, CheckCircle, Clock3, Plus, Edit2, Send, ClipboardList, Share2, X, AlertTriangle, Info } from "lucide-react"

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

  .ed-root { font-family: 'DM Sans', sans-serif; color: #0f1923; }

  .ed-page-header { margin-bottom: 2rem; }
  .ed-page-title { font-size: 22px; font-weight: 600; letter-spacing: -0.02em; color: #0f1923; margin: 0 0 4px; }
  .ed-page-sub { font-size: 13.5px; color: #6b7280; margin: 0; }

  .ed-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 2rem; }

  .ed-stat {
    background: white;
    border: 1px solid #f0eeeb;
    border-radius: 14px;
    padding: 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .ed-stat-top { display: flex; align-items: center; justify-content: space-between; }
  .ed-stat-label { font-size: 12.5px; font-weight: 500; color: #6b7280; }
  .ed-stat-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
  .ed-stat-icon.blue { background: #eff6ff; color: #3b82f6; }
  .ed-stat-icon.green { background: #f0fdf4; color: #16a34a; }
  .ed-stat-icon.orange { background: #fff7ed; color: #ea580c; }
  .ed-stat-icon.ok { background: #f0fdf4; color: #16a34a; }
  .ed-stat-value { font-size: 28px; font-weight: 600; letter-spacing: -0.03em; line-height: 1; }
  .ed-stat-value.blue { color: #3b82f6; }
  .ed-stat-value.green { color: #16a34a; }
  .ed-stat-value.orange { color: #ea580c; }

  .ed-card {
    background: white;
    border: 1px solid #f0eeeb;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 16px;
  }

  .ed-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .ed-card-title { font-size: 15px; font-weight: 600; color: #0f1923; margin: 0; }

  .ed-actions { display: flex; gap: 8px; }

  .ed-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 9px; font-size: 13px; font-weight: 500;
    cursor: pointer; border: none; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }
  .ed-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .ed-btn.primary { background: #0f1923; color: white; }
  .ed-btn.primary:hover:not(:disabled) { background: #1e2d3d; }
  .ed-btn.success { background: #16a34a; color: white; }
  .ed-btn.success:hover:not(:disabled) { background: #15803d; }
  .ed-btn.ghost { background: #f5f4f0; color: #374151; border: 1px solid #e5e7eb; }
  .ed-btn.ghost:hover { background: #edecea; }
  .ed-btn.blue { background: #3b82f6; color: white; }
  .ed-btn.blue:hover { background: #2563eb; }
  .ed-btn.purple { background: #7c3aed; color: white; }
  .ed-btn.purple:hover { background: #6d28d9; }
  .ed-btn.green-sm { background: #dcfce7; color: #15803d; }
  .ed-btn.green-sm:hover { background: #bbf7d0; }
  .ed-btn.sm { padding: 5px 10px; font-size: 12px; border-radius: 7px; }

  .ed-alert {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 11px 14px; border-radius: 10px; font-size: 13px; margin-bottom: 14px;
  }
  .ed-alert.warn { background: #fff7ed; border: 1px solid #fed7aa; color: #c2410c; }
  .ed-alert.info { background: #f0f9ff; border: 1px solid #bae6fd; color: #0369a1; }
  .ed-alert.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
  .ed-alert.error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
  .ed-alert.purple { background: #faf5ff; border: 1px solid #e9d5ff; color: #7c3aed; }
  .ed-alert svg { flex-shrink: 0; margin-top: 1px; }

  table.ed-table { width: 100%; border-collapse: collapse; }
  .ed-table th {
    font-size: 11.5px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;
    color: #9ca3af; padding: 0 12px 10px; text-align: left; border-bottom: 1px solid #f0eeeb;
  }
  .ed-table th.center { text-align: center; }
  .ed-table td { padding: 13px 12px; border-bottom: 1px solid #f9f8f7; font-size: 13.5px; vertical-align: middle; }
  .ed-table tr:last-child td { border-bottom: none; }
  .ed-table tr:hover td { background: #fafaf9; }
  .ed-table td.center { text-align: center; }

  .ed-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 20px; font-size: 11.5px; font-weight: 500;
  }
  .ed-badge.approved { background: #f0fdf4; color: #15803d; }
  .ed-badge.pending { background: #fffbeb; color: #b45309; }
  .ed-badge.shared { background: #faf5ff; color: #7c3aed; }
  .ed-badge.draft { background: #f5f4f0; color: #6b7280; }
  .ed-badge.q { background: #eff6ff; color: #1d4ed8; }
  .ed-badge.on-track { background: #eff6ff; color: #1d4ed8; }
  .ed-badge.completed { background: #f0fdf4; color: #15803d; }
  .ed-badge.not-started { background: #f5f4f0; color: #6b7280; }

  .ed-goal-title { font-weight: 500; font-size: 13.5px; color: #0f1923; }
  .ed-goal-desc { font-size: 12px; color: #9ca3af; margin-top: 2px; }

  .ed-progress-val { font-weight: 600; font-size: 13.5px; }
  .ed-progress-val.high { color: #16a34a; }
  .ed-progress-val.mid { color: #d97706; }
  .ed-progress-val.low { color: #dc2626; }

  .ed-empty { padding: 40px; text-align: center; color: #9ca3af; font-size: 13.5px; }

  .ed-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.3);
    display: flex; align-items: center; justify-content: center;
    z-index: 50; padding: 1rem;
  }
  .ed-modal {
    background: white; border-radius: 18px; padding: 28px;
    width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  }
  .ed-modal-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
  .ed-modal-title { font-size: 16px; font-weight: 600; color: #0f1923; margin: 0 0 4px; }
  .ed-modal-sub { font-size: 13px; color: #6b7280; margin: 0; }
  .ed-modal-close { background: none; border: none; cursor: pointer; color: #9ca3af; padding: 2px; border-radius: 6px; }
  .ed-modal-close:hover { background: #f5f4f0; color: #374151; }

  .ed-field { margin-bottom: 14px; }
  .ed-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .ed-label { display: block; font-size: 12px; font-weight: 500; color: #374151; margin-bottom: 5px; letter-spacing: 0.01em; }
  .ed-input {
    width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb;
    border-radius: 9px; font-size: 13.5px; color: #0f1923; background: white;
    outline: none; font-family: 'DM Sans', sans-serif; box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s; appearance: none;
  }
  .ed-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .ed-input::placeholder { color: #9ca3af; }
  textarea.ed-input { resize: vertical; }

  .ed-modal-footer { display: flex; gap: 8px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #f0eeeb; }

  .ed-weightage-bar-wrap { margin-bottom: 6px; }
  .ed-weightage-bar-track { height: 5px; background: #f0eeeb; border-radius: 99px; overflow: hidden; }
  .ed-weightage-bar-fill { height: 100%; border-radius: 99px; transition: width 0.3s; }
  .ed-weightage-info { display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; margin-top: 4px; }
`

function EmployeeDashboard() {
  const [goals, setGoals] = useState([])
  const [updates, setUpdates] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showCheckinForm, setShowCheckinForm] = useState(false)
  const [showWeightageForm, setShowWeightageForm] = useState(false)
  const [checkinGoal, setCheckinGoal] = useState(null)
  const [weightageGoal, setWeightageGoal] = useState(null)
  const [newWeightage, setNewWeightage] = useState("")
  const [editingGoal, setEditingGoal] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", goalType: "NUMERIC_MAX", targetValue: "", weightage: "" })
  const [checkinForm, setCheckinForm] = useState({ quarter: "Q1", plannedValue: "", actualValue: "", status: "On Track" })

  useEffect(() => { fetchGoals(); fetchUpdates() }, [])

  const token = localStorage.getItem("token")
  const headers = { Authorization: token }

  const fetchGoals = async () => {
    try { const res = await api.get("/goals", { headers }); setGoals(res.data.goals || []) }
    catch (err) { console.log(err) }
  }

  const fetchUpdates = async () => {
    try { const res = await api.get("/goals/quarterly-updates", { headers }); setUpdates(res.data.updates || []) }
    catch (err) { console.log(err) }
  }

  const totalWeightage = goals.reduce((sum, g) => sum + parseFloat(g.Weightage || 0), 0)
  const approvedCount = goals.filter((g) => g.Approved).length
  const isSubmitted = goals.length > 0 && goals.every((g) => g.Submitted)

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleCheckinFormChange = (e) => setCheckinForm({ ...checkinForm, [e.target.name]: e.target.value })

  const handleCreate = async () => {
    if (!form.title || !form.targetValue || !form.weightage) return alert("Please fill all fields")
    try {
      if (editingGoal) {
        await api.put(`/goals/${editingGoal.ID}`, { title: form.title, description: form.description, goalType: form.goalType, targetValue: parseFloat(form.targetValue), weightage: parseFloat(form.weightage) }, { headers })
      } else {
        await api.post("/goals", { title: form.title, description: form.description, goalType: form.goalType, targetValue: parseFloat(form.targetValue), weightage: parseFloat(form.weightage) }, { headers })
      }
      setForm({ title: "", description: "", goalType: "NUMERIC_MAX", targetValue: "", weightage: "" })
      setShowForm(false); setEditingGoal(null); fetchGoals()
    } catch (err) { alert(err.response?.data?.error || "Failed to save goal") }
  }

  const handleCheckinSubmit = async () => {
    if (!checkinForm.plannedValue || !checkinForm.actualValue) return alert("Please fill all fields")
    try {
      await api.post(`/goals/${checkinGoal.ID}/quarterly-update`, { quarter: checkinForm.quarter, plannedValue: parseFloat(checkinForm.plannedValue), actualValue: parseFloat(checkinForm.actualValue), status: checkinForm.status }, { headers })
      setShowCheckinForm(false); setCheckinGoal(null)
      setCheckinForm({ quarter: "Q1", plannedValue: "", actualValue: "", status: "On Track" })
      fetchUpdates()
    } catch (err) { alert(err.response?.data?.error || "Failed to submit check-in") }
  }

  const handleWeightageUpdate = async () => {
    if (!newWeightage) return alert("Please enter a weightage")
    try {
      await api.put(`/goals/${weightageGoal.ID}/shared-weightage`, { weightage: parseFloat(newWeightage) }, { headers })
      setShowWeightageForm(false); setWeightageGoal(null); setNewWeightage(""); fetchGoals()
    } catch (err) { alert(err.response?.data?.error || "Failed to update weightage") }
  }

  const handleEdit = (goal) => {
    if (goal.Locked) return alert("Goal is locked after approval")
    setEditingGoal(goal)
    setForm({ title: goal.Title, description: goal.Description || "", goalType: goal.GoalType, targetValue: String(goal.TargetValue), weightage: String(goal.Weightage) })
    setShowForm(true)
  }

  const handleSubmitAll = async () => {
    if (goals.length === 0) return alert("No goals to submit")
    if (totalWeightage !== 100) return alert(`Total weightage must be exactly 100%. Currently: ${totalWeightage}%`)
    setSubmitting(true)
    try { await api.post("/submit-goals", {}, { headers }); fetchGoals() }
    catch (err) { alert(err.response?.data?.error || "Failed to submit goals") }
    finally { setSubmitting(false) }
  }

  const goalTypeLabel = (type) => {
    if (type === "NUMERIC_MAX") return "Higher is better"
    if (type === "NUMERIC_MIN") return "Lower is better"
    if (type === "ZERO") return "Zero target"
    return type || "-"
  }

  const statusBadge = (goal) => {
    if (goal.Approved) return <span className="ed-badge approved"><span>●</span> Approved</span>
    if (goal.Submitted) return <span className="ed-badge pending"><span>●</span> Pending</span>
    if (goal.Shared) return <span className="ed-badge shared"><Share2 size={10} /> Shared</span>
    return <span className="ed-badge draft">Draft</span>
  }

  const progressClass = (p) => p >= 80 ? "high" : p >= 50 ? "mid" : "low"

  const barColor = totalWeightage > 100 ? "#dc2626" : totalWeightage === 100 ? "#16a34a" : "#3b82f6"
  const barWidth = Math.min(totalWeightage, 100)

  return (
    <DashboardLayout>
      <style>{S}</style>
      <div className="ed-root">

        <div className="ed-page-header">
          <h1 className="ed-page-title">My Dashboard</h1>
          <p className="ed-page-sub">Track, manage, and submit your performance goals.</p>
        </div>

        {/* Stats */}
        <div className="ed-stats">
          <div className="ed-stat">
            <div className="ed-stat-top">
              <span className="ed-stat-label">Total Goals</span>
              <div className="ed-stat-icon blue"><Target size={16} /></div>
            </div>
            <div className="ed-stat-value blue">{goals.length}</div>
          </div>
          <div className="ed-stat">
            <div className="ed-stat-top">
              <span className="ed-stat-label">Approved</span>
              <div className="ed-stat-icon green"><CheckCircle size={16} /></div>
            </div>
            <div className="ed-stat-value green">{approvedCount}</div>
          </div>
          <div className="ed-stat">
            <div className="ed-stat-top">
              <span className="ed-stat-label">Total Weightage</span>
              <div className={`ed-stat-icon ${totalWeightage === 100 ? "ok" : "orange"}`}>
                <Clock3 size={16} />
              </div>
            </div>
            <div className={`ed-stat-value ${totalWeightage === 100 ? "green" : "orange"}`}>{totalWeightage}%</div>
          </div>
        </div>

        {/* Goals Card */}
        <div className="ed-card">
          <div className="ed-card-header">
            <h2 className="ed-card-title">My Goals</h2>
            <div className="ed-actions">
              {!isSubmitted && goals.length < 8 && (
                <button className="ed-btn primary" onClick={() => { setShowForm(true); setEditingGoal(null); setForm({ title: "", description: "", goalType: "NUMERIC_MAX", targetValue: "", weightage: "" }) }}>
                  <Plus size={14} /> Add Goal
                </button>
              )}
              {!isSubmitted && goals.length > 0 && (
                <button className="ed-btn success" onClick={handleSubmitAll} disabled={submitting || totalWeightage !== 100}>
                  <Send size={14} /> {submitting ? "Submitting…" : "Submit All"}
                </button>
              )}
            </div>
          </div>

          {/* Weightage progress bar */}
          {goals.length > 0 && (
            <div className="ed-weightage-bar-wrap" style={{ marginBottom: 16 }}>
              <div className="ed-weightage-bar-track">
                <div className="ed-weightage-bar-fill" style={{ width: `${barWidth}%`, background: barColor }} />
              </div>
              <div className="ed-weightage-info">
                <span>Weightage allocated</span>
                <span style={{ fontWeight: 500, color: barColor }}>{totalWeightage}% / 100%</span>
              </div>
            </div>
          )}

          {/* Alerts */}
          {goals.length > 0 && totalWeightage !== 100 && !isSubmitted && (
            <div className="ed-alert warn">
              <AlertTriangle size={14} />
              <span>Total weightage is <strong>{totalWeightage}%</strong> — must equal exactly 100% before submitting.</span>
            </div>
          )}
          {totalWeightage > 100 && (
            <div className="ed-alert error">
              <AlertTriangle size={14} />
              <span>Weightage exceeds 100% due to a shared goal assignment. Contact your admin to rebalance.</span>
            </div>
          )}
          {isSubmitted && (
            <div className="ed-alert success">
              <CheckCircle size={14} />
              <span>Goals submitted and pending manager approval. No further edits allowed.</span>
            </div>
          )}
          {goals.some((g) => g.Shared) && (
            <div className="ed-alert purple">
              <Share2 size={14} />
              <span>You have shared goals assigned by your manager. You can only adjust their weightage.</span>
            </div>
          )}

          <table className="ed-table">
            <thead>
              <tr>
                <th>Goal</th>
                <th>Type</th>
                <th className="center">Target</th>
                <th className="center">Weight</th>
                <th className="center">Status</th>
                <th className="center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {goals.length === 0 && (
                <tr><td colSpan="6" className="ed-empty">No goals yet — click <strong>Add Goal</strong> to get started.</td></tr>
              )}
              {goals.map((goal, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      {goal.Shared && <Share2 size={13} style={{ color: "#7c3aed", marginTop: 2, flexShrink: 0 }} />}
                      <div>
                        <div className="ed-goal-title">{goal.Title}</div>
                        {goal.Description && <div className="ed-goal-desc">{goal.Description}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "#6b7280", fontSize: 12.5 }}>{goalTypeLabel(goal.GoalType)}</td>
                  <td className="center" style={{ fontWeight: 500 }}>{goal.TargetValue}</td>
                  <td className="center" style={{ fontWeight: 600, color: "#3b82f6" }}>{goal.Weightage}%</td>
                  <td className="center">{statusBadge(goal)}</td>
                  <td className="center">
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      {!goal.Approved && !goal.Locked && !goal.Shared && (
                        <button className="ed-btn blue sm" onClick={() => handleEdit(goal)}><Edit2 size={12} /> Edit</button>
                      )}
                      {!isSubmitted && goal.Shared && !goal.Submitted && (
                        <button className="ed-btn purple sm" onClick={() => { setWeightageGoal(goal); setNewWeightage(String(goal.Weightage)); setShowWeightageForm(true) }}>
                          <Edit2 size={12} /> Weightage
                        </button>
                      )}
                      {goal.Approved && (
                        <button className="ed-btn green-sm sm" onClick={() => { setCheckinGoal(goal); setCheckinForm({ quarter: "Q1", plannedValue: String(goal.TargetValue), actualValue: "", status: "On Track" }); setShowCheckinForm(true) }}>
                          <ClipboardList size={12} /> Check-in
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Check-in History */}
        {updates.length > 0 && (
          <div className="ed-card">
            <div className="ed-card-header">
              <h2 className="ed-card-title">Check-in History</h2>
            </div>
            <table className="ed-table">
              <thead>
                <tr>
                  <th>Goal</th>
                  <th className="center">Quarter</th>
                  <th className="center">Planned</th>
                  <th className="center">Actual</th>
                  <th className="center">Progress</th>
                  <th className="center">Status</th>
                  <th>Manager Note</th>
                </tr>
              </thead>
              <tbody>
                {updates.map((u, i) => (
                  <tr key={i}>
                    <td className="ed-goal-title">{u.goalTitle}</td>
                    <td className="center"><span className="ed-badge q">{u.quarter}</span></td>
                    <td className="center" style={{ fontSize: 13 }}>{u.plannedValue}</td>
                    <td className="center" style={{ fontSize: 13 }}>{u.actualValue}</td>
                    <td className="center"><span className={`ed-progress-val ${progressClass(u.progress)}`}>{u.progress}%</span></td>
                    <td className="center">
                      <span className={`ed-badge ${u.status === "Completed" ? "completed" : u.status === "On Track" ? "on-track" : "not-started"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12.5, color: "#9ca3af", fontStyle: u.managerComment ? "normal" : "italic" }}>
                      {u.managerComment || "No comment yet"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add / Edit Goal Modal */}
        {showForm && (
          <div className="ed-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
            <div className="ed-modal">
              <div className="ed-modal-header">
                <div>
                  <p className="ed-modal-title">{editingGoal ? "Edit Goal" : "Add New Goal"}</p>
                  <p className="ed-modal-sub">Fill in the details below to {editingGoal ? "update your" : "create a new"} goal.</p>
                </div>
                <button className="ed-modal-close" onClick={() => { setShowForm(false); setEditingGoal(null) }}><X size={18} /></button>
              </div>

              <div className="ed-field" style={{ gridColumn: "span 2" }}>
                <label className="ed-label">Goal Title</label>
                <input name="title" className="ed-input" value={form.title} onChange={handleFormChange} placeholder="e.g. Increase quarterly sales revenue" />
              </div>
              <div className="ed-field">
                <label className="ed-label">Description</label>
                <textarea name="description" className="ed-input" rows={2} value={form.description} onChange={handleFormChange} placeholder="Brief description…" />
              </div>
              <div className="ed-field-grid">
                <div className="ed-field">
                  <label className="ed-label">Goal Type</label>
                  <select name="goalType" className="ed-input" value={form.goalType} onChange={handleFormChange}>
                    <option value="NUMERIC_MAX">Numeric — Higher is better</option>
                    <option value="NUMERIC_MIN">Numeric — Lower is better</option>
                    <option value="ZERO">Zero — Zero = Success</option>
                  </select>
                </div>
                <div className="ed-field">
                  <label className="ed-label">Target Value</label>
                  <input name="targetValue" type="number" className="ed-input" value={form.targetValue} onChange={handleFormChange} placeholder="e.g. 500000" />
                </div>
              </div>
              <div className="ed-field">
                <label className="ed-label">Weightage (%) — min 10%</label>
                <input name="weightage" type="number" min="10" max="100" className="ed-input" value={form.weightage} onChange={handleFormChange} placeholder="e.g. 25" />
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 5 }}>
                  Current total: <strong style={{ color: totalWeightage > 100 ? "#dc2626" : "#3b82f6" }}>{totalWeightage}%</strong> of 100%
                </div>
              </div>

              <div className="ed-modal-footer">
                <button className="ed-btn primary" onClick={handleCreate}>{editingGoal ? "Update Goal" : "Save Goal"}</button>
                <button className="ed-btn ghost" onClick={() => { setShowForm(false); setEditingGoal(null) }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Weightage Modal */}
        {showWeightageForm && weightageGoal && (
          <div className="ed-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowWeightageForm(false)}>
            <div className="ed-modal" style={{ maxWidth: 400 }}>
              <div className="ed-modal-header">
                <div>
                  <p className="ed-modal-title">Update Weightage</p>
                  <p className="ed-modal-sub">{weightageGoal.Title}</p>
                </div>
                <button className="ed-modal-close" onClick={() => { setShowWeightageForm(false); setWeightageGoal(null) }}><X size={18} /></button>
              </div>
              <div className="ed-alert info" style={{ marginBottom: 14 }}>
                <Info size={14} />
                <span>Title and target are read-only for shared goals. You can only adjust the weightage.</span>
              </div>
              <div className="ed-field">
                <label className="ed-label">Weightage (%) — min 10%</label>
                <input type="number" min="10" max="100" className="ed-input" value={newWeightage} onChange={(e) => setNewWeightage(e.target.value)} />
              </div>
              <div className="ed-modal-footer">
                <button className="ed-btn purple" onClick={handleWeightageUpdate}>Update</button>
                <button className="ed-btn ghost" onClick={() => { setShowWeightageForm(false); setWeightageGoal(null) }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Check-in Modal */}
        {showCheckinForm && checkinGoal && (
          <div className="ed-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowCheckinForm(false)}>
            <div className="ed-modal">
              <div className="ed-modal-header">
                <div>
                  <p className="ed-modal-title">Quarterly Check-in</p>
                  <p className="ed-modal-sub">{checkinGoal.Title}</p>
                </div>
                <button className="ed-modal-close" onClick={() => { setShowCheckinForm(false); setCheckinGoal(null) }}><X size={18} /></button>
              </div>
              <div className="ed-field-grid">
                <div className="ed-field">
                  <label className="ed-label">Quarter</label>
                  <select name="quarter" className="ed-input" value={checkinForm.quarter} onChange={handleCheckinFormChange}>
                    <option value="Q1">Q1 (July)</option>
                    <option value="Q2">Q2 (October)</option>
                    <option value="Q3">Q3 (January)</option>
                    <option value="Q4">Q4 (March/April)</option>
                  </select>
                </div>
                <div className="ed-field">
                  <label className="ed-label">Status</label>
                  <select name="status" className="ed-input" value={checkinForm.status} onChange={handleCheckinFormChange}>
                    <option value="Not Started">Not Started</option>
                    <option value="On Track">On Track</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="ed-field">
                  <label className="ed-label">Planned Value</label>
                  <input name="plannedValue" type="number" className="ed-input" value={checkinForm.plannedValue} onChange={handleCheckinFormChange} placeholder="e.g. 100000" />
                </div>
                <div className="ed-field">
                  <label className="ed-label">Actual Achievement</label>
                  <input name="actualValue" type="number" className="ed-input" value={checkinForm.actualValue} onChange={handleCheckinFormChange} placeholder="e.g. 85000" />
                </div>
              </div>
              <div className="ed-modal-footer">
                <button className="ed-btn success" onClick={handleCheckinSubmit}>Submit Check-in</button>
                <button className="ed-btn ghost" onClick={() => { setShowCheckinForm(false); setCheckinGoal(null) }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}

export default EmployeeDashboard