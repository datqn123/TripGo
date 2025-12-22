import adminAxiosClient from "./adminAxiosClient";

const adminVoucherApi = {
    // Get all vouchers (Admin)
    getAll: (params) => {
        return adminAxiosClient.get('/vouchers', { params });
    },

    // Get by ID
    getById: (id) => {
        return adminAxiosClient.get(`/vouchers/${id}`);
    },

    // Create new voucher
    create: (data) => {
        const formData = new FormData();
        
        // Backend requirement: 'voucher' part as JSON String (Blob)
        // Ensure no 'id' is in data (handled by caller too, but double safety)
        const { id, ...voucherData } = data;
        
        const jsonBlob = new Blob([JSON.stringify(voucherData)], {
            type: 'application/json'
        });
        formData.append('voucher', jsonBlob);
        
        return adminAxiosClient.post('/vouchers', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // Update voucher
    update: (id, data) => {
        const formData = new FormData();
        
        // Ensure no 'id' in the JSON body for update either, if backend doesn't like it
        // Usually PUT updates might allow ID, but better safe if backend is strict
        const { id: _id, ...voucherData } = data;

        const jsonBlob = new Blob([JSON.stringify(voucherData)], {
            type: 'application/json'
        });
        formData.append('voucher', jsonBlob);

        return adminAxiosClient.put(`/vouchers/${id}`, formData, {
            headers: {
                 'Content-Type': 'multipart/form-data'
            }
        });
    },

    // Delete voucher
    delete: (id) => {
        return adminAxiosClient.delete(`/vouchers/${id}`);
    }
};

export default adminVoucherApi;
