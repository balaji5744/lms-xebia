package com.geeknito.geeknito_backend.event.service;

import com.geeknito.geeknito_backend.event.dto.DashboardStatsDTO;

public interface DashboardService {
    DashboardStatsDTO getDashboardStats(Long creatorId);
}
