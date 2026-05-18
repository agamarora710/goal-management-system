import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function Login() {
  const navigate = useNavigate()
  const [tab, setTab] = useState("login")
  const [managers, setManagers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [name, setName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [role, setRole] = useState("employee")
  const [department, setDepartment] = useState("")
  const [managerId, setManagerId] = useState(0)

  useEffect(() => {
    fetchManagers()
  }, [])

  const fetchManagers = async () => {
    try {
      const res = await api.get("/public/managers")
      setManagers(res.data.managers || [])
    } catch (err) {
      console.log(err)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const response = await api.post("/login", { email, password })
      const token = response.data.token
      const userRole = response.data.user.role
      localStorage.setItem("token", token)
      localStorage.setItem("role", userRole)
      if (userRole === "employee") navigate("/employee-dashboard")
      else if (userRole === "manager") navigate("/manager-dashboard")
      else if (userRole === "admin") navigate("/admin-dashboard")
    } catch {
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = (e) => {
    setRole(e.target.value)
    setDepartment("")
    setManagerId(0)
  }

  const handleDepartmentDropdown = (e) => {
    const selectedDept = e.target.value
    setDepartment(selectedDept)
    const manager = managers.find((m) => m.Department === selectedDept)
    setManagerId(manager ? manager.ID : 0)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")
    if (!name || !regEmail || !regPassword || !department) {
      return setError("Please fill in all required fields.")
    }
    setIsLoading(true)
    try {
      await api.post("/register", {
        name,
        email: regEmail,
        password: regPassword,
        role,
        department,
        managerId,
      })
      setTab("login")
      setName("")
      setRegEmail("")
      setRegPassword("")
      setRole("employee")
      setDepartment("")
      setManagerId(0)
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const departments = [...new Set(managers.map((m) => m.Department).filter(Boolean))]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

        .gm-root {
          min-height: 100vh;
          display: flex;
          background: #f5f4f0;
          font-family: 'DM Sans', sans-serif;
        }

        .gm-left {
          display: none;
          width: 45%;
          background: #0f1923;
          padding: 3rem;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        @media (min-width: 900px) {
          .gm-left { display: flex; }
        }

        .gm-left::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
          top: -100px;
          right: -100px;
          pointer-events: none;
        }

        .gm-left::after {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%);
          bottom: 50px;
          left: -50px;
          pointer-events: none;
        }

        .gm-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gm-brand-icon {
          width: 36px;
          height: 36px;
          background: #3b82f6;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gm-brand-icon svg {
          width: 20px;
          height: 20px;
          fill: none;
          stroke: white;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .gm-brand-name {
          font-size: 15px;
          font-weight: 600;
          color: white;
          letter-spacing: -0.01em;
        }

        .gm-hero {
          position: relative;
          z-index: 1;
        }

        .gm-hero-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3b82f6;
          margin-bottom: 16px;
        }

        .gm-hero h2 {
          font-family: 'DM Serif Display', serif;
          font-size: 2.6rem;
          line-height: 1.15;
          color: white;
          margin: 0 0 20px;
          font-weight: 400;
        }

        .gm-hero p {
          font-size: 15px;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          max-width: 300px;
          margin: 0;
        }

        .gm-stats {
          display: flex;
          gap: 2rem;
          position: relative;
          z-index: 1;
        }

        .gm-stat-value {
          font-size: 22px;
          font-weight: 600;
          color: white;
          letter-spacing: -0.02em;
        }

        .gm-stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-top: 2px;
        }

        .gm-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .gm-card {
          width: 100%;
          max-width: 420px;
        }

        .gm-card-header {
          margin-bottom: 2rem;
        }

        .gm-card-header h1 {
          font-size: 24px;
          font-weight: 600;
          color: #0f1923;
          letter-spacing: -0.02em;
          margin: 0 0 6px;
        }

        .gm-card-header p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .gm-tabs {
          display: flex;
          background: #edecea;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 2rem;
        }

        .gm-tab {
          flex: 1;
          padding: 8px;
          border: none;
          background: transparent;
          border-radius: 7px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
          color: #6b7280;
          font-family: 'DM Sans', sans-serif;
        }

        .gm-tab.active {
          background: white;
          color: #0f1923;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
        }

        .gm-field {
          margin-bottom: 14px;
        }

        .gm-label {
          display: block;
          font-size: 12.5px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
          letter-spacing: 0.01em;
        }

        .gm-input-wrap {
          position: relative;
        }

        .gm-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 9px;
          font-size: 14px;
          color: #0f1923;
          background: white;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
          appearance: none;
          -webkit-appearance: none;
        }

        .gm-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }

        .gm-input::placeholder {
          color: #9ca3af;
        }

        .gm-input-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #9ca3af;
          display: flex;
          align-items: center;
          padding: 0;
          background: none;
          border: none;
          transition: color 0.15s;
        }

        .gm-input-icon:hover { color: #374151; }

        .gm-input-icon svg {
          width: 16px;
          height: 16px;
          stroke: currentColor;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .gm-hint {
          font-size: 12px;
          margin-top: 5px;
          padding-left: 2px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .gm-hint.success { color: #16a34a; }
        .gm-hint.warn { color: #d97706; }

        .gm-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #dc2626;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .gm-error svg {
          width: 15px;
          height: 15px;
          stroke: currentColor;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          flex-shrink: 0;
        }

        .gm-btn {
          width: 100%;
          padding: 11px;
          background: #0f1923;
          color: white;
          border: none;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
          margin-top: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .gm-btn:hover { background: #1e2d3d; }
        .gm-btn:active { transform: scale(0.99); }
        .gm-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .gm-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .gm-divider {
          height: 1px;
          background: #f0eeeb;
          margin: 20px 0;
        }

        .gm-footer-note {
          text-align: center;
          font-size: 12.5px;
          color: #9ca3af;
          margin-top: 1.5rem;
        }
      `}</style>

      <div className="gm-root">
        {/* Left Panel */}
        <div className="gm-left">
          <div className="gm-brand">
            <div className="gm-brand-icon">
              <svg viewBox="0 0 24 24">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <span className="gm-brand-name">GoalTrack</span>
          </div>

          <div className="gm-hero">
            <p className="gm-hero-label">Performance Platform</p>
            <h2>Turn goals into results.</h2>
            <p>Set clear objectives, track real progress, and align your entire team around what actually matters.</p>
          </div>

          <div className="gm-stats">
            <div>
              <div className="gm-stat-value">98%</div>
              <div className="gm-stat-label">Goal visibility</div>
            </div>
            <div>
              <div className="gm-stat-value">3×</div>
              <div className="gm-stat-label">Faster reviews</div>
            </div>
            <div>
              <div className="gm-stat-value">Live</div>
              <div className="gm-stat-label">Progress tracking</div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="gm-right">
          <div className="gm-card">
            <div className="gm-card-header">
              <h1>{tab === "login" ? "Welcome back" : "Create account"}</h1>
              <p>{tab === "login" ? "Sign in to your workspace" : "Get started with GoalTrack"}</p>
            </div>

            <div className="gm-tabs">
              <button className={`gm-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setError("") }}>
                Sign in
              </button>
              <button className={`gm-tab ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setError("") }}>
                Register
              </button>
            </div>

            {error && (
              <div className="gm-error">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            {tab === "login" && (
              <form onSubmit={handleLogin}>
                <div className="gm-field">
                  <label className="gm-label">Email address</label>
                  <input
                    type="email"
                    className="gm-input"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="gm-field">
                  <label className="gm-label">Password</label>
                  <div className="gm-input-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="gm-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ paddingRight: "40px" }}
                      required
                    />
                    <button type="button" className="gm-input-icon" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword
                        ? <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>

                <button type="submit" className="gm-btn" disabled={isLoading}>
                  {isLoading ? <><div className="gm-spinner" /> Signing in…</> : "Sign in"}
                </button>
              </form>
            )}

            {tab === "register" && (
              <form onSubmit={handleRegister}>
                <div className="gm-field">
                  <label className="gm-label">Full name</label>
                  <input
                    type="text"
                    className="gm-input"
                    placeholder="Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="gm-field">
                  <label className="gm-label">Work email</label>
                  <input
                    type="email"
                    className="gm-input"
                    placeholder="jane@company.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="gm-field">
                  <label className="gm-label">Password</label>
                  <div className="gm-input-wrap">
                    <input
                      type={showRegPassword ? "text" : "password"}
                      className="gm-input"
                      placeholder="Create a strong password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      style={{ paddingRight: "40px" }}
                      required
                    />
                    <button type="button" className="gm-input-icon" onClick={() => setShowRegPassword(!showRegPassword)}>
                      {showRegPassword
                        ? <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>

                <div className="gm-field">
                  <label className="gm-label">Role</label>
                  <select value={role} onChange={handleRoleChange} className="gm-input">
                    <option value="employee">Employee</option>
                  </select>
                </div>

                <div className="gm-field">
                  <label className="gm-label">Department</label>
                  {role === "manager" || role === "admin" ? (
                    <input
                      type="text"
                      className="gm-input"
                      placeholder="e.g. Sales, Marketing"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  ) : (
                    <>
                      <select value={department} onChange={handleDepartmentDropdown} className="gm-input">
                        <option value="">Select your department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      {department && managerId > 0 && (
                        <p className="gm-hint success">✓ Manager auto-assigned for {department}</p>
                      )}
                      {department && managerId === 0 && (
                        <p className="gm-hint warn">⚠ No manager found for this department</p>
                      )}
                    </>
                  )}
                </div>

                <button type="submit" className="gm-btn" disabled={isLoading}>
                  {isLoading ? <><div className="gm-spinner" /> Creating account…</> : "Create account"}
                </button>
              </form>
            )}

            <p className="gm-footer-note">
              By continuing, you agree to GoalTrack's Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login