const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Helper for HTTP requests
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultRole = typeof window !== "undefined" && window.location.pathname.startsWith("/admin") ? "admin" : "citizen";
  const activeRole = options.headers?.["X-User-Role"] || localStorage.getItem("infrasight_role") || defaultRole;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "X-User-Role": activeRole,
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`[InfraSight API] Error reaching ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // 1. Issues list with filters
  async getIssues(params = {}) {
    const query = new URLSearchParams();
    if (params.type && params.type !== "All Types") query.append("type", params.type);
    if (params.status && params.status !== "All Status") query.append("status", params.status);
    if (params.area && params.area !== "All Areas") query.append("area", params.area);
    if (params.min_score) query.append("min_score", params.min_score);
    if (params.max_score) query.append("max_score", params.max_score);
    if (params.sort) query.append("sort", params.sort);
    if (params.order) query.append("order", params.order);

    const qs = query.toString() ? `?${query.toString()}` : "";
    return await request(`/issues${qs}`);
  },

  // 2. Single Issue Detail
  async getIssueById(id) {
    return await request(`/issues/${id}`);
  },

  // 3. Citizen My Reports
  async getMyReports() {
    return await request("/issues/mine");
  },

  // 4. Create new report (multipart)
  async createReport(formData) {
    return await request("/reports", {
      method: "POST",
      body: formData,
    });
  },

  // 4b. On-demand AI image scan
  async scanPhoto(file) {
    const formData = new FormData();
    formData.append("image", file);
    return await request("/reports/scan", {
      method: "POST",
      body: formData,
    });
  },

  // 5. Update issue status
  async updateStatus(id, status, changedBy = "Admin") {
    return await request(`/issues/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, changed_by: changedBy }),
    });
  },

  // 6. Admin Stats & Charts
  async getStats() {
    return await request("/stats");
  },

  // 7. Heatmap Points
  async getHeatmapData(type = "") {
    const qs = type && type !== "All Issue Types" ? `?type=${encodeURIComponent(type)}` : "";
    return await request(`/heatmap${qs}`);
  },

  // 8. Repair Verification
  async verifyRepair(id, formData) {
    return await request(`/issues/${id}/verify-repair`, {
      method: "POST",
      body: formData,
    });
  },

  // 9. Send Complaint to Department
  async sendComplaint(id, toEmail = "") {
    const formData = new FormData();
    if (toEmail) formData.append("to_email", toEmail);
    return await request(`/issues/${id}/complaint/send`, {
      method: "POST",
      body: formData,
      headers: { "X-User-Role": "admin" },
    });
  },

  // 10. Health check
  async getHealth() {
    return await request("/health");
  },
};
