import axios from 'axios';

// Tạo instance với cấu hình cơ bản
const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// INTERCEPTOR GỬI ĐI: Tự động đính Token vào Header mỗi khi gọi API
apiInstance.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem('userInfo'))?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// INTERCEPTOR NHẬN VỀ: Xử lý dữ liệu và lỗi hệ thống
apiInstance.interceptors.response.use(
  // Thành công: Trả về data bên trong, bỏ qua các thông tin thừa của axios
  (res) => res.data, 
  
  // Thất bại: Xử lý lỗi tập trung
  (err) => {
    // Nếu lỗi 401 (Hết hạn login): Xóa data cũ và đá ra trang Login
    if (err.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default apiInstance;