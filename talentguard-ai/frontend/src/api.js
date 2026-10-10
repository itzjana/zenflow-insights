import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const API = axios.create({ baseURL: BASE_URL });

export const getHealth        = () => API.get('/health');
export const getOverview      = () => API.get('/overview');
export const getEDA           = () => API.get('/eda');
export const getEDAChart      = (feat) => API.get(`/eda/chart/${feat}`);
export const getEDAFeatures   = () => API.get('/eda/features');
export const getWatchlist     = (limit=50) => API.get(`/watchlist?limit=${limit}`);
export const getEmployees     = () => API.get('/employees');
export const getEmployee      = (id) => API.get(`/employee/${id}`);
export const getDrafts        = (status='all') => API.get(`/retention/drafts?status=${status}`);
export const approveDraft     = (id, reviewer_id, note='') =>
  API.post(`/retention/approve/${id}`, { reviewer_id, note });
export const rejectDraft      = (id, reviewer_id, note='') =>
  API.post(`/retention/reject/${id}`, { reviewer_id, note });
export const generateGrokPlan = (employee_id) =>
  API.post(`/grok/plan/${employee_id}`);
export const getWhatIfOptions = () => API.get('/whatif/options');
export const runWhatIf        = (employee_id, changes) =>
  API.post('/whatif', { employee_id, changes });
export const getEvaluation    = () => API.get('/evaluation');
export const getEarlyWarning  = (n=50, s=3) => API.get(`/earlywarning/demo?n_employees=${n}&n_snapshots=${s}`);
export const exportWatchlist  = () => `${BASE_URL}/export/watchlist`;
export const exportDrafts     = () => `${BASE_URL}/export/drafts`;
