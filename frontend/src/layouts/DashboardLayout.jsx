import { Link } from "react-router-dom"

function DashboardLayout({ children }) {

  const role = localStorage.getItem("role")

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}

      <div className="w-64 bg-blue-700 text-white p-5">

        <h1 className="text-2xl font-bold mb-10">
          Goal Management
        </h1>

        <div className="space-y-4">

          {/* EMPLOYEE MENU */}

          {role === "employee" && (
            <>
              <Link
                to="/employee-dashboard"
                className="block hover:text-gray-200"
              >
                Dashboard
              </Link>
            </>
          )}

          {/* MANAGER MENU */}

          {role === "manager" && (
            <>
              <Link
                to="/manager-dashboard"
                className="block hover:text-gray-200"
              >
                Dashboard
              </Link>

              <Link
                to="/manager-team"
                className="block hover:text-gray-200"
              >
                Team Overview
              </Link>
            </>
          )}

          {/* ADMIN MENU */}

          {role === "admin" && (
            <>
              <Link
                to="/admin-dashboard"
                className="block hover:text-gray-200"
              >
                Dashboard
              </Link>

              <Link
                to="/admin-users"
                className="block hover:text-gray-200"
              >
                Manage Users
              </Link>
            </>
          )}

        </div>

        {/* LOGOUT */}

        <button
          onClick={() => {
            localStorage.clear()
            window.location.href = "/"
          }}
          className="mt-10 bg-red-500 px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 p-8">

        {children}

      </div>

    </div>

  )

}

export default DashboardLayout