import api from "./api"

export const getAnalyticsOverview = async () => {

  const token = localStorage.getItem("token")

  const response = await api.get(
    "/admin/analytics/overview",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}