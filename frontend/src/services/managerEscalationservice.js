import api from "./api"

export const getManagerEscalations =
  async () => {

  const response = await api.get(
    "/manager/escalations"
  )

  return response.data
}