import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
Line,
CartesianGrid,
Legend,
} from "recharts"
import { AlertTriangle } from "lucide-react"
import DashboardLayout from "../layouts/DashboardLayout"
import api from "../services/api"
import { getAnalyticsOverview } from "../services/analyticsService"
import { Users, Target, ShieldCheck, ClipboardList, Unlock, Share2, X, Download, UserPlus, Check } from "lucide-react"

const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

  .ad-root { font-family: 'DM Sans', sans-serif; color: #0f1923; }

  .ad-page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 12px; }
  .ad-page-title { font-size: 22px; font-weight: 600; letter-spacing: -0.02em; color: #0f1923; margin: 0 0 4px; }
  .ad-page-sub { font-size: 13.5px; color: #6b7280; margin: 0; }

  .ad-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 2rem; }
  .ad-stat { background: white; border: 1px solid #f0eeeb; border-radius: 14px; padding: 18px 20px; display: flex; flex-direction: column; gap: 10px; }
  .ad-stat-top { display: flex; align-items: center; justify-content: space-between; }
  .ad-stat-label { font-size: 12px; font-weight: 500; color: #6b7280; }
  .ad-stat-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .ad-stat-icon.blue { background: #eff6ff; color: #3b82f6; }
  .ad-stat-icon.purple { background: #faf5ff; color: #7c3aed; }
  .ad-stat-icon.orange { background: #fff7ed; color: #ea580c; }
  .ad-stat-icon.green { background: #f0fdf4; color: #16a34a; }
  .ad-stat-value { font-size: 26px; font-weight: 600; letter-spacing: -0.03em; line-height: 1; }
  .ad-stat-value.blue { color: #3b82f6; }
  .ad-stat-value.purple { color: #7c3aed; }
  .ad-stat-value.orange { color: #ea580c; }
  .ad-stat-value.green { color: #16a34a; }
  .ad-stat-sub { font-size: 11.5px; color: #9ca3af; }

  /* Tabs */
  .ad-tabs { display: flex; gap: 2px; background: #f0eeeb; border-radius: 11px; padding: 4px; margin-bottom: 1.5rem; width: fit-content; }
  .ad-tab { padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; background: transparent; color: #6b7280; font-family: 'DM Sans', sans-serif; transition: all 0.15s; white-space: nowrap; }
  .ad-tab.active { background: white; color: #0f1923; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .ad-tab:hover:not(.active) { color: #374151; }

  .ad-card { background: white; border: 1px solid #f0eeeb; border-radius: 16px; padding: 24px; margin-bottom: 16px; }
  .ad-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
  .ad-card-title { font-size: 15px; font-weight: 600; color: #0f1923; margin: 0; }
  .ad-card-sub { font-size: 12.5px; color: #6b7280; margin: 4px 0 0; }

  .ad-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 9px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.15s; font-family: 'DM Sans', sans-serif; white-space: nowrap; }
  .ad-btn.primary { background: #0f1923; color: white; }
  .ad-btn.primary:hover { background: #1e2d3d; }
  .ad-btn.green { background: #16a34a; color: white; }
  .ad-btn.green:hover { background: #15803d; }
  .ad-btn.purple { background: #7c3aed; color: white; }
  .ad-btn.purple:hover { background: #6d28d9; }
  .ad-btn.blue { background: #3b82f6; color: white; }
  .ad-btn.blue:hover { background: #2563eb; }
  .ad-btn.orange-soft { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
  .ad-btn.orange-soft:hover { background: #ffedd5; }
  .ad-btn.ghost { background: #f5f4f0; color: #374151; border: 1px solid #e5e7eb; }
  .ad-btn.ghost:hover { background: #edecea; }
  .ad-btn.sm { padding: 5px 10px; font-size: 12px; border-radius: 7px; }

  table.ad-table { width: 100%; border-collapse: collapse; }
  .ad-table th { font-size: 11.5px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: #9ca3af; padding: 0 12px 10px; text-align: left; border-bottom: 1px solid #f0eeeb; }
  .ad-table th.center { text-align: center; }
  .ad-table td { padding: 12px; border-bottom: 1px solid #f9f8f7; font-size: 13.5px; vertical-align: middle; }
  .ad-table tr:last-child td { border-bottom: none; }
  .ad-table tr:hover td { background: #fafaf9; }
  .ad-table td.center { text-align: center; }

  .ad-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11.5px; font-weight: 500; }
  .ad-badge.admin { background: #fef2f2; color: #dc2626; }
  .ad-badge.manager { background: #eff6ff; color: #1d4ed8; }
  .ad-badge.employee { background: #f0fdf4; color: #15803d; }
  .ad-badge.locked { background: #f5f4f0; color: #6b7280; }
  .ad-badge.approved { background: #f0fdf4; color: #15803d; }
  .ad-badge.pending { background: #fffbeb; color: #b45309; }
  .ad-badge.draft { background: #f5f4f0; color: #6b7280; }
  .ad-badge.action { background: #eff6ff; color: #1d4ed8; }
  .ad-badge.escalation {
  background: #fef2f2;
  color: #dc2626;
}

.ad-badge.open {
  background: #fff7ed;
  color: #c2410c;
}

.ad-badge.resolved {
  background: #f0fdf4;
  color: #15803d;
}

  .ad-empty { padding: 40px; text-align: center; color: #9ca3af; font-size: 13.5px; }

  .ad-kv { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f9f8f7; }
  .ad-kv:last-child { border-bottom: none; }
  .ad-kv-label { font-size: 13.5px; color: #374151; }
  .ad-kv-value { font-size: 13.5px; font-weight: 600; }

  .ad-activity-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f9f8f7; gap: 12px; }
  .ad-activity-row:last-child { border-bottom: none; }
  .ad-activity-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .ad-activity-user { font-weight: 500; font-size: 13.5px; color: #0f1923; }
  .ad-activity-dot { color: #d1d5db; font-size: 10px; }
  .ad-activity-entity { font-size: 13px; color: #6b7280; }
  .ad-activity-time { font-size: 12px; color: #9ca3af; white-space: nowrap; }

  .ad-overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .ad-overview-wide { grid-column: span 2; }

  /* Modal */
  .ad-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem; }
  .ad-modal { background: white; border-radius: 18px; padding: 28px; width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
  .ad-modal-sm { max-width: 480px; }
  .ad-modal-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
  .ad-modal-title { font-size: 16px; font-weight: 600; color: #0f1923; margin: 0 0 4px; }
  .ad-modal-sub { font-size: 13px; color: #6b7280; margin: 0; }
  .ad-modal-close { background: none; border: none; cursor: pointer; color: #9ca3af; padding: 2px; border-radius: 6px; }
  .ad-modal-close:hover { background: #f5f4f0; color: #374151; }
  .ad-modal-footer { display: flex; gap: 8px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #f0eeeb; }

  .ad-field { margin-bottom: 14px; }
  .ad-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .ad-label { display: block; font-size: 12px; font-weight: 500; color: #374151; margin-bottom: 5px; }
  .ad-input { width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 9px; font-size: 13.5px; color: #0f1923; background: white; outline: none; font-family: 'DM Sans', sans-serif; box-sizing: border-box; transition: border-color 0.15s, box-shadow 0.15s; appearance: none; }
  .ad-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .ad-input.purple:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
  .ad-input::placeholder { color: #9ca3af; }
  textarea.ad-input { resize: vertical; }

  .ad-hint { font-size: 12px; color: #16a34a; margin-top: 4px; display: flex; align-items: center; gap: 4px; }

  .ad-emp-list { border: 1.5px solid #e5e7eb; border-radius: 9px; background: white; max-height: 160px; overflow-y: auto; }
  .ad-emp-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-bottom: 1px solid #f9f8f7; cursor: pointer; transition: background 0.1s; }
  .ad-emp-item:last-child { border-bottom: none; }
  .ad-emp-item:hover { background: #fafaf9; }
  .ad-checkbox { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid #d1d5db; background: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; }
  .ad-checkbox.checked { background: #7c3aed; border-color: #7c3aed; }
  .ad-emp-name { font-size: 13.5px; color: #0f1923; }
  .ad-emp-dept { font-size: 12px; color: #9ca3af; }
  .ad-emp-count { font-size: 12px; color: #7c3aed; margin-top: 5px; font-weight: 500; }

  .ad-empty-state { text-align: center; padding: 3rem 2rem; color: #9ca3af; }
  .ad-empty-state svg { margin: 0 auto 12px; opacity: 0.25; display: block; }
  .ad-empty-state p { font-size: 13.5px; margin: 0; }
`

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [goals, setGoals] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [employees, setEmployees] = useState([])
  const [escalations, setEscalations] = useState([])
  const [activeTab, setActiveTab] = useState("overview")
  const [showSharedForm, setShowSharedForm] = useState(false)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [analytics, setAnalytics] = useState(null)
  const [sharedForm, setSharedForm] = useState({ title: "", description: "", goalType: "NUMERIC_MAX", targetValue: "", primaryOwnerId: "", employeeIds: [] })
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "manager", department: "", managerId: 0 })

  const token = localStorage.getItem("token")
  const headers = { Authorization: token }

useEffect(() => {
  fetchUsers()
  fetchGoals()
  fetchAuditLogs()
  fetchEmployees()
  fetchEscalations()
  fetchAnalytics()
}, [])

  const fetchUsers = async () => { try { const r = await api.get("/admin/users", { headers }); setUsers(r.data.users || []) } catch (e) { console.log(e) } }
  const fetchGoals = async () => { try { const r = await api.get("/admin/goals", { headers }); setGoals(r.data.goals || []) } catch (e) { console.log(e) } }
  const fetchAuditLogs = async () => { try { const r = await api.get("/admin/audit-logs", { headers }); setAuditLogs(r.data.logs || []) } catch (e) { console.log(e) } }
  const fetchEmployees = async () => { try { const r = await api.get("/admin/employees", { headers }); setEmployees(r.data.employees || []) } catch (e) { console.log(e) } }
  const fetchEscalations = async () => {
  try {

    const r = await api.get(
      "/admin/escalations",
      { headers }
    )

    setEscalations(r.data.escalations || [])

  } catch (e) {
    console.log(e)
  }
}
  const unlockGoal = async (goalId) => {
    if (!window.confirm("Are you sure you want to unlock this goal?")) return
    try { await api.put(`/admin/goals/${goalId}/unlock`, {}, { headers }); fetchGoals(); fetchAuditLogs() }
    catch (err) { alert(err.response?.data?.error || "Failed to unlock goal") }
  }
  const fetchAnalytics = async () => {
  try {
    const data = await getAnalyticsOverview()

    console.log("ANALYTICS DATA:", data)

    setAnalytics(data)
  } catch (error) {
    console.log(error)
  }
}

  const handleExportCSV = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/export", { headers: { Authorization: token } })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a"); a.href = url; a.download = "achievement_report.csv"; a.click()
      URL.revokeObjectURL(url)
    } catch { alert("Failed to export report") }
  }

  const handleUserFormChange = (e) => {
    const { name, value } = e.target
    if (name === "role") setUserForm({ ...userForm, role: value, department: "", managerId: 0 })
    else setUserForm({ ...userForm, [name]: value })
  }

  const handleUserDeptChange = (e) => {
    const dept = e.target.value
    const mgr = users.find((u) => u.Role === "manager" && u.Department === dept)
    setUserForm({ ...userForm, department: dept, managerId: mgr ? mgr.ID : 0 })
  }

  const submitCreateUser = async () => {
    if (!userForm.name || !userForm.email || !userForm.password || !userForm.department) return alert("Please fill all fields")
    try {
      await api.post("/register", { name: userForm.name, email: userForm.email, password: userForm.password, role: userForm.role, department: userForm.department, managerId: userForm.managerId })
      setShowCreateUser(false)
      setUserForm({ name: "", email: "", password: "", role: "manager", department: "", managerId: 0 })
      fetchUsers(); fetchEmployees()
    } catch (err) { alert(err.response?.data?.error || "Failed to create user") }
  }

  const handleSharedFormChange = (e) => setSharedForm({ ...sharedForm, [e.target.name]: e.target.value })

  const toggleEmployee = (empId) => {
    const id = Number(empId)
    setSharedForm((prev) => ({ ...prev, employeeIds: prev.employeeIds.includes(id) ? prev.employeeIds.filter((e) => e !== id) : [...prev.employeeIds, id] }))
  }

  const submitSharedGoal = async () => {
    if (!sharedForm.title || !sharedForm.targetValue || !sharedForm.primaryOwnerId) return alert("Please fill all required fields and select a primary owner")
    if (sharedForm.employeeIds.length === 0) return alert("Please select at least one employee")
    try {
      await api.post("/manager/shared-goal", { title: sharedForm.title, description: sharedForm.description, goalType: sharedForm.goalType, targetValue: parseFloat(sharedForm.targetValue), primaryOwnerId: Number(sharedForm.primaryOwnerId), employeeIds: sharedForm.employeeIds }, { headers })
      setShowSharedForm(false)
      setSharedForm({ title: "", description: "", goalType: "NUMERIC_MAX", targetValue: "", primaryOwnerId: "", employeeIds: [] })
      fetchGoals()
    } catch (err) { alert(err.response?.data?.error || "Failed to push shared goal") }
  }

  const totalEmployees = users.filter((u) => u.Role === "employee").length
  const totalManagers = users.filter((u) => u.Role === "manager").length
  const pendingGoals = goals.filter((g) => g.submitted && !g.approved).length
  const approvedGoals = goals.filter((g) => g.approved).length
  const lockedGoals = goals.filter((g) => g.locked).length
  const managerDepts = [...new Set(users.filter((u) => u.Role === "manager").map((u) => u.Department).filter(Boolean))]

  const statusBadge = (goal) => {
    if (goal.locked) return <span className="ad-badge locked">Locked</span>
    if (goal.approved) return <span className="ad-badge approved"><span>●</span> Approved</span>
    if (goal.submitted) return <span className="ad-badge pending"><span>●</span> Pending</span>
    return <span className="ad-badge draft">Draft</span>
  }

  const roleBadge = (role) => {
    if (role === "admin") return <span className="ad-badge admin">Admin</span>
    if (role === "manager") return <span className="ad-badge manager">Manager</span>
    return <span className="ad-badge employee">Employee</span>
  }
  const statusData = [
  {
    name: "Draft",
    value: goals.filter((g) => !g.submitted && !g.approved).length,
    color: "#6b7280",
  },
  {
    name: "Pending",
    value: pendingGoals,
    color: "#f59e0b",
  },
  {
    name: "Approved",
    value: approvedGoals,
    color: "#16a34a",
  },
  {
    name: "Locked",
    value: lockedGoals,
    color: "#dc2626",
  },
]
const trendData = [
  {
    quarter: "Q1",
    approved: 12,
  },
  {
    quarter: "Q2",
    approved: 18,
  },
  {
    quarter: "Q3",
    approved: 9,
  },
  {
    quarter: "Q4",
    approved: approvedGoals,
  },
]
const managerPerformance = [
  {
    name: "Engineering Manager",
    team: 2,
    approved: 2,
    checkins: 5,
    completion: 92,
  },
  {
    name: "riya",
    team: 1,
    approved: 1,
    checkins: 3,
    completion: 81,
  },
  {
    name: "vinod",
    team: 0,
    approved: 0,
    checkins: 0,
    completion: 0,
  },
]
const employeeProgress = [
  {
    employee: "Aman",
    progress: 92,
  },
  {
    employee: "agam",
    progress: 76,
  },
  {
    employee: "kat",
    progress: 48,
  },
]

  const formatDate = (d) => d || "-"

  const deptBreakdown = Object.entries(users.reduce((acc, u) => { const d = u.Department || "Unknown"; acc[d] = (acc[d] || 0) + 1; return acc }, {}))

  const departmentData = deptBreakdown.map(([dept, count]) => ({
  name: dept,
  users: count,
}))
const tabs = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "goals", label: "All Goals" },
  { id: "shared", label: "Shared Goals" },
  { id: "audit", label: "Audit Log" },
  { id: "escalations", label: "Escalations" },
]
const goalStatusData = [
  {
    name: "Approved",
    value: analytics?.approved_goals || 0,
  },
  {
    name: "Pending",
    value: analytics?.pending_goals || 0,
  },
  {
    name: "Rejected",
    value: analytics?.rejected_goals || 0,
  },
]



const COLORS = ["#16a34a", "#f59e0b", "#dc2626"]
  return (
    <DashboardLayout>
      <style>{S}</style>
      <div className="ad-root">

        <div className="ad-page-header">
          <div>
            <h1 className="ad-page-title">Admin Dashboard</h1>
            <p className="ad-page-sub">Manage users, goals, and system-wide activity.</p>
          </div>
          <button className="ad-btn green" onClick={handleExportCSV}>
            <Download size={14} /> Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="ad-stats">
          <div className="ad-stat">
            <div className="ad-stat-top">
              <span className="ad-stat-label">Total Users</span>
              <div className="ad-stat-icon blue"><Users size={15} /></div>
            </div>
            <div className="ad-stat-value blue">{users.length}</div>
            <div className="ad-stat-sub">{totalEmployees} employees · {totalManagers} managers</div>
          </div>
          <div className="ad-stat">
            <div className="ad-stat-top">
              <span className="ad-stat-label">Total Goals</span>
              <div className="ad-stat-icon purple"><Target size={15} /></div>
            </div>
            <div className="ad-stat-value purple">{goals.length}</div>
            <div className="ad-stat-sub">{pendingGoals} pending · {approvedGoals} approved</div>
          </div>
          <div className="ad-stat">
            <div className="ad-stat-top">
              <span className="ad-stat-label">Locked Goals</span>
              <div className="ad-stat-icon orange"><ShieldCheck size={15} /></div>
            </div>
            <div className="ad-stat-value orange">{lockedGoals}</div>
            <div className="ad-stat-sub">Require admin unlock</div>
          </div>
          <div className="ad-stat">
            <div className="ad-stat-top">
              <span className="ad-stat-label">Audit Events</span>
              <div className="ad-stat-icon green"><ClipboardList size={15} /></div>
            </div>
            <div className="ad-stat-value green">{auditLogs.length}</div>
            <div className="ad-stat-sub">Total logged actions</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="ad-tabs">
          {tabs.map((t) => (
            <button key={t.id} className={`ad-tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="md-grid">

</div>

<div className="md-card">
  <h2>Analytics Overview</h2>

  <div className="analytics-overview">
  <div className="analytics-card">
    <span>Total Goals</span>
    <h2>{analytics?.total_goals}</h2>
  </div>

  <div className="analytics-card approved">
    <span>Approved Goals</span>
    <h2>{analytics?.approved_goals}</h2>
  </div>

  <div className="analytics-card pending">
    <span>Pending Goals</span>
    <h2>{analytics?.pending_goals}</h2>
  </div>

  <div className="analytics-card rejected">
    <span>Rejected Goals</span>
    <h2>{analytics?.rejected_goals}</h2>
  </div>
</div>
</div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="ad-overview-grid">
           <div className="ad-card">
  <div className="ad-card-header">
    <h2 className="ad-card-title">
      Users by Department
    </h2>
  </div>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={departmentData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="users" fill="#2563eb" />
    </BarChart>
  </ResponsiveContainer>
</div>
           <div className="ad-card">
  <div className="ad-card-header">
    <h2 className="ad-card-title">
      Goal Status Breakdown
    </h2>
  </div>

  <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={statusData}
      dataKey="value"
      nameKey="name"
      outerRadius={100}
      label
    >
      {statusData.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={entry.color}
        />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
</div>
<div className="ad-card" style={{ marginTop: "24px" }}>
  <div className="ad-card-header">
    <h2 className="ad-card-title">
      Goal Approval Trends
    </h2>
  </div>

  <ResponsiveContainer width="100%" height={320}>
    <LineChart data={trendData}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="quarter" />

      <YAxis />

      <Tooltip />

      <Legend />

      <Line
        type="monotone"
        dataKey="approved"
        stroke="#2563eb"
        strokeWidth={3}
      />
    </LineChart>
  </ResponsiveContainer>
</div>
<div className="ad-card" style={{ marginTop: "24px" }}>
  <div className="ad-card-header">
    <h2 className="ad-card-title">
      Manager Effectiveness
    </h2>
  </div>

  <div className="ad-table-wrapper">
    <table className="ad-table">
      <thead>
        <tr>
          <th>Manager</th>
          <th>Team Size</th>
          <th>Approved Goals</th>
          <th>Check-ins</th>
          <th>Completion %</th>
        </tr>
      </thead>

      <tbody>
        {managerPerformance.map((manager) => (
          <tr key={manager.name}>
            <td>{manager.name}</td>
            <td>{manager.team}</td>
            <td>{manager.approved}</td>
            <td>{manager.checkins}</td>
            <td>
              <span
                style={{
                  color:
                    manager.completion >= 80
                      ? "#16a34a"
                      : "#dc2626",
                  fontWeight: 700,
                }}
              >
                {manager.completion}%
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
<div className="ad-card" style={{ marginTop: "24px" }}>
  <div className="ad-card-header">
    <h2 className="ad-card-title">
      Team Progress Heatmap
    </h2>
  </div>

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      marginTop: "20px",
    }}
  >
    {employeeProgress.map((emp) => (
      <div key={emp.employee}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
            fontWeight: 600,
          }}
        >
          <span>{emp.employee}</span>
          <span>{emp.progress}%</span>
        </div>

        <div
          style={{
            width: "100%",
            height: "16px",
            background: "#e5e7eb",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${emp.progress}%`,
              height: "100%",
              background:
                emp.progress >= 80
                  ? "#16a34a"
                  : emp.progress >= 50
                  ? "#f59e0b"
                  : "#dc2626",
              borderRadius: "999px",
              transition: "0.4s",
            }}
          />
        </div>
      </div>
    ))}
  </div>
</div>
            <div className="ad-card ad-overview-wide">
              <div className="ad-card-header"><h2 className="ad-card-title">Recent Activity</h2></div>
              {auditLogs.length === 0 && <p className="ad-empty">No activity yet.</p>}
              {auditLogs.slice(0, 6).map((log, i) => (
                <div key={i} className="ad-activity-row">
                  <div className="ad-activity-meta">
                    <span className="ad-activity-user">{log.userName}</span>
                    <span className="ad-activity-dot">●</span>
                    <span className="ad-badge action" style={{ fontSize: 11 }}>{log.action}</span>
                    <span className="ad-activity-dot">●</span>
                    <span className="ad-activity-entity">{log.entity} #{log.entityId}</span>
                  </div>
                  <span className="ad-activity-time">{formatDate(log.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <>
            <div className="ad-card">
              <div className="ad-card-header">
                <div>
                  <h2 className="ad-card-title">All Users</h2>
                  <p className="ad-card-sub">{users.length} total · {totalEmployees} employees · {totalManagers} managers</p>
                </div>
                <button className="ad-btn primary" onClick={() => setShowCreateUser(true)}>
                  <UserPlus size={14} /> Create User
                </button>
              </div>
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th className="center">Role</th>
                    <th>Department</th>
                    <th className="center">Manager ID</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && <tr><td colSpan="5" className="ad-empty">No users found.</td></tr>}
                  {users.map((u, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{u.Name}</td>
                      <td style={{ color: "#6b7280", fontSize: 13 }}>{u.Email}</td>
                      <td className="center">{roleBadge(u.Role)}</td>
                      <td style={{ color: "#374151" }}>{u.Department || <span style={{ color: "#d1d5db" }}>—</span>}</td>
                      <td className="center" style={{ color: "#9ca3af", fontSize: 13 }}>{u.ManagerID || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* GOALS */}
        {activeTab === "goals" && (
          <div className="ad-card">
            <div className="ad-card-header">
              <h2 className="ad-card-title">All Goals</h2>
              <span style={{ fontSize: 12, background: "#f5f4f0", color: "#6b7280", padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>{goals.length} total</span>
            </div>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Goal</th>
                  <th className="center">Weight</th>
                  <th className="center">Progress</th>
                  <th className="center">Status</th>
                  <th className="center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {goals.length === 0 && <tr><td colSpan="7" className="ad-empty">No goals found.</td></tr>}
                {goals.map((goal, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{goal.employeeName}</td>
                    <td style={{ color: "#6b7280", fontSize: 13 }}>{goal.department}</td>
                    <td style={{ color: "#374151" }}>{goal.title}</td>
                    <td className="center" style={{ fontWeight: 600, color: "#3b82f6" }}>{goal.weightage}%</td>
                    <td className="center" style={{ fontWeight: 600, color: "#374151" }}>{goal.progress}%</td>
                    <td className="center">{statusBadge(goal)}</td>
                    <td className="center">
                      {goal.locked && (
                        <button className="ad-btn orange-soft sm" onClick={() => unlockGoal(goal.id)}>
                          <Unlock size={12} /> Unlock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SHARED GOALS */}
        {activeTab === "shared" && (
          <div className="ad-card">
            <div className="ad-card-header">
              <div>
                <h2 className="ad-card-title">Push Shared Goal</h2>
                <p className="ad-card-sub">Push a departmental KPI to multiple employees org-wide.</p>
              </div>
              <button className="ad-btn purple" onClick={() => setShowSharedForm(true)}>
                <Share2 size={14} /> New Shared Goal
              </button>
            </div>
            <div className="ad-empty-state">
              <Share2 size={36} />
              <p>Click "New Shared Goal" to push a KPI to multiple employees.</p>
            </div>
          </div>
        )}

        {/* AUDIT LOG */}
        {activeTab === "audit" && (
          <div className="ad-card">
            <div className="ad-card-header">
              <h2 className="ad-card-title">Audit Log</h2>
              <span style={{ fontSize: 12, background: "#f5f4f0", color: "#6b7280", padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>{auditLogs.length} events</span>
            </div>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th className="center">ID</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 && <tr><td colSpan="5" className="ad-empty">No audit logs yet.</td></tr>}
                {auditLogs.map((log, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{log.userName}</td>
                    <td><span className="ad-badge action">{log.action}</span></td>
                    <td style={{ color: "#6b7280", fontSize: 13 }}>{log.entity}</td>
                    <td className="center" style={{ color: "#9ca3af", fontSize: 13 }}>#{log.entityId}</td>
                    <td style={{ color: "#6b7280", fontSize: 12.5 }}>{formatDate(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ESCALATIONS */}
{activeTab === "escalations" && (
  <div className="ad-card">

    <div className="ad-card-header">

      <div>
        <h2 className="ad-card-title">
          Escalation Center
        </h2>

        <p className="ad-card-sub">
          Automated workflow violations and unresolved actions.
        </p>
      </div>

      <span
        style={{
          fontSize: 12,
          background: "#fef2f2",
          color: "#dc2626",
          padding: "3px 10px",
          borderRadius: 20,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 6
        }}
      >
        <AlertTriangle size={12} />
        {escalations.length} open
      </span>

    </div>

    <table className="ad-table">

      <thead>

        <tr>

          <th>Assigned To</th>
          <th>Type</th>
          <th>Message</th>
          <th className="center">Level</th>
          <th className="center">Escalated To</th>
          <th>Status</th>
          <th>Created</th>

        </tr>

      </thead>

      <tbody>

        {escalations.length === 0 && (
          <tr>
            <td colSpan="7" className="ad-empty">
              No escalations found.
            </td>
          </tr>
        )}

        {escalations.map((esc, i) => (

          <tr key={i}>

            <td
              style={{
                fontWeight: 600,
                color: "#0f1923"
              }}
            >
              {esc.UserName}
            </td>

            <td>

              <span className="ad-badge escalation">
                {esc.Type}
              </span>

            </td>

            <td
              style={{
                color: "#374151",
                maxWidth: 280
              }}
            >
              {esc.Message}
            </td>

            <td className="center">

              <span
                style={{
                  fontWeight: 600,
                  color: "#7c3aed"
                }}
              >
                L{esc.EscalationLevel}
              </span>

            </td>

            <td className="center">
              {esc.EscalatedToName}
            </td>

            <td>

              <span className="ad-badge open">
                {esc.Status}
              </span>

            </td>

            <td
              style={{
                color: "#6b7280",
                fontSize: 12.5
              }}
            >
              {formatDate(esc.CreatedAt)}
            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>
)}
        {/* Create User Modal */}
        {showCreateUser && (
          <div className="ad-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowCreateUser(false)}>
            <div className="ad-modal ad-modal-sm">
              <div className="ad-modal-header">
                <div>
                  <p className="ad-modal-title">Create User</p>
                  <p className="ad-modal-sub">Add a new manager, admin, or employee account.</p>
                </div>
                <button className="ad-modal-close" onClick={() => setShowCreateUser(false)}><X size={18} /></button>
              </div>

              <div className="ad-field-grid">
                <div className="ad-field">
                  <label className="ad-label">Full Name</label>
                  <input name="name" className="ad-input" value={userForm.name} onChange={handleUserFormChange} placeholder="Jane Smith" />
                </div>
                <div className="ad-field">
                  <label className="ad-label">Email</label>
                  <input name="email" type="email" className="ad-input" value={userForm.email} onChange={handleUserFormChange} placeholder="jane@company.com" />
                </div>
                <div className="ad-field">
                  <label className="ad-label">Password</label>
                  <input name="password" type="password" className="ad-input" value={userForm.password} onChange={handleUserFormChange} placeholder="Set a password" />
                </div>
                <div className="ad-field">
                  <label className="ad-label">Role</label>
                  <select name="role" className="ad-input" value={userForm.role} onChange={handleUserFormChange}>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>
              </div>
              <div className="ad-field">
                <label className="ad-label">Department</label>
                {userForm.role === "manager" || userForm.role === "admin" ? (
                  <input name="department" className="ad-input" value={userForm.department} onChange={handleUserFormChange} placeholder="e.g. Sales, Marketing, HR" />
                ) : (
                  <>
                    <select className="ad-input" value={userForm.department} onChange={handleUserDeptChange}>
                      <option value="">Select Department</option>
                      {managerDepts.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {userForm.department && userForm.managerId > 0 && (
                      <p className="ad-hint"><Check size={12} /> Manager auto-assigned for {userForm.department}</p>
                    )}
                  </>
                )}
              </div>

              <div className="ad-modal-footer">
                <button className="ad-btn primary" onClick={submitCreateUser}><UserPlus size={14} /> Create Account</button>
                <button className="ad-btn ghost" onClick={() => setShowCreateUser(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Shared Goal Modal */}
        {showSharedForm && (
          <div className="ad-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowSharedForm(false)}>
            <div className="ad-modal">
              <div className="ad-modal-header">
                <div>
                  <p className="ad-modal-title">Push Shared Goal</p>
                  <p className="ad-modal-sub">Recipients can only adjust weightage — title and target are locked.</p>
                </div>
                <button className="ad-modal-close" onClick={() => setShowSharedForm(false)}><X size={18} /></button>
              </div>

              <div className="ad-field">
                <label className="ad-label">Goal Title</label>
                <input name="title" className="ad-input purple" value={sharedForm.title} onChange={handleSharedFormChange} placeholder="e.g. Organization Revenue Target Q2" />
              </div>
              <div className="ad-field">
                <label className="ad-label">Description</label>
                <textarea name="description" className="ad-input purple" rows={2} value={sharedForm.description} onChange={handleSharedFormChange} placeholder="Brief description…" />
              </div>
              <div className="ad-field-grid">
                <div className="ad-field">
                  <label className="ad-label">Goal Type</label>
                  <select name="goalType" className="ad-input purple" value={sharedForm.goalType} onChange={handleSharedFormChange}>
                    <option value="NUMERIC_MAX">Numeric — Higher is better</option>
                    <option value="NUMERIC_MIN">Numeric — Lower is better</option>
                    <option value="ZERO">Zero — Zero = Success</option>
                  </select>
                </div>
                <div className="ad-field">
                  <label className="ad-label">Target Value</label>
                  <input name="targetValue" type="number" className="ad-input purple" value={sharedForm.targetValue} onChange={handleSharedFormChange} placeholder="e.g. 1000000" />
                </div>
              </div>
              <div className="ad-field">
                <label className="ad-label">Primary Owner</label>
                <select name="primaryOwnerId" className="ad-input purple" value={sharedForm.primaryOwnerId} onChange={handleSharedFormChange}>
                  <option value="">Select primary owner…</option>
                  {employees.map((emp) => <option key={emp.ID} value={emp.ID}>{emp.Name} · {emp.Department}</option>)}
                </select>
              </div>
              <div className="ad-field">
                <label className="ad-label">Push To Employees</label>
                <div className="ad-emp-list">
                  {employees.length === 0 && <div style={{ padding: 12, fontSize: 13, color: "#9ca3af" }}>No employees found</div>}
                  {employees.map((emp) => (
                    <div key={emp.ID} className="ad-emp-item" onClick={() => toggleEmployee(emp.ID)}>
                      <div className={`ad-checkbox ${sharedForm.employeeIds.includes(emp.ID) ? "checked" : ""}`}>
                        {sharedForm.employeeIds.includes(emp.ID) && <Check size={10} color="white" strokeWidth={3} />}
                      </div>
                      <div>
                        <div className="ad-emp-name">{emp.Name}</div>
                        <div className="ad-emp-dept">{emp.Department}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {sharedForm.employeeIds.length > 0 && (
                  <p className="ad-emp-count">{sharedForm.employeeIds.length} employee{sharedForm.employeeIds.length > 1 ? "s" : ""} selected</p>
                )}
              </div>

              <div className="ad-modal-footer">
                <button className="ad-btn purple" onClick={submitSharedGoal}><Share2 size={14} /> Push to Employees</button>
                <button className="ad-btn ghost" onClick={() => setShowSharedForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard