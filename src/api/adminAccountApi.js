import adminAxiosClient from "./adminAxiosClient";

const adminAccountApi = {
  // 1. Get all accounts
  // API: GET /api/admin/accounts
  getAll: (params) => {
    return adminAxiosClient.get('/accounts', { params });
  },

  // 2. Update account status (Lock/Unlock)
  // API: PUT /api/admin/accounts/{id}/status?status={status}
  // status: ACTIVE, LOCKED
  updateStatus: (id, status) => {
      return adminAxiosClient.put(`/accounts/${id}/status`, null, {
          params: { status }
      });
  },

  // 3. Update account role
  // API: PUT /api/admin/accounts/{id}/role?role={role}
  // role: ADMIN, USER, STAFF
  updateRole: (id, role) => {
      return adminAxiosClient.put(`/accounts/${id}/role`, null, {
          params: { role }
      });
  }
};

export default adminAccountApi;
