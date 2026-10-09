package com.geeknito.geeknito_backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.stereotype.Component;

import java.lang.management.ManagementFactory;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * StartupProfiler
 * 
 * A lightweight, production-safe, and non-intrusive performance diagnostics component.
 * Tracks major Spring Boot application bootstrap phases via standard framework events.
 * Avoids proxying, bean wrapping, or BeanPostProcessor overhead, ensuring zero impact
 * on runtime behavior. Exposes stats via read-only REST endpoint /api/v1/diagnostics/startup.
 */
@Component
@RestController
@RequestMapping("/api/v1/diagnostics")
@Slf4j
public class StartupProfiler {

    private static final long jvmStartTime = ManagementFactory.getRuntimeMXBean().getStartTime();
    private long contextRefreshTime = 0;
    private long applicationStartedTime = 0;
    private long applicationReadyTime = 0;

    @EventListener
    public void onContextRefreshed(ContextRefreshedEvent event) {
        this.contextRefreshTime = System.currentTimeMillis();
    }

    @EventListener
    public void onApplicationStarted(ApplicationStartedEvent event) {
        this.applicationStartedTime = System.currentTimeMillis();
    }

    @EventListener
    public void onApplicationReady(ApplicationReadyEvent event) {
        this.applicationReadyTime = System.currentTimeMillis();
        printStartupReport();
    }

    private void printStartupReport() {
        long now = System.currentTimeMillis();
        long totalStartupDuration = now - jvmStartTime;
        long springBootstrapDuration = contextRefreshTime > jvmStartTime ? (contextRefreshTime - jvmStartTime) : 0;
        long contextToStartDuration = (applicationStartedTime > contextRefreshTime) ? (applicationStartedTime - contextRefreshTime) : 0;
        long runnersDuration = (applicationReadyTime > applicationStartedTime) ? (applicationReadyTime - applicationStartedTime) : 0;

        log.info("====================================================================");
        log.info("📊 ENTERPRISE LMS LIGHTWEIGHT STARTUP PROFILE REPORT");
        log.info("====================================================================");
        log.info("  JVM Start Timestamp:         {}", new Date(jvmStartTime));
        log.info("  Spring Context Bootstrap:    {}s", String.format("%.3f", springBootstrapDuration / 1000.0));
        log.info("  Context-to-Start Transition: {}s", String.format("%.3f", contextToStartDuration / 1000.0));
        log.info("  Application Runners:         {}s", String.format("%.3f", runnersDuration / 1000.0));
        log.info("  ------------------------------------------------------------------");
        log.info("  TOTAL COLD STARTUP DURATION: {}s", String.format("%.3f", totalStartupDuration / 1000.0));
        log.info("====================================================================");
    }

    @GetMapping("/startup")
    public Map<String, Object> getStartupDiagnostics() {
        Map<String, Object> report = new LinkedHashMap<>();
        long now = System.currentTimeMillis();
        long currentReadyTime = applicationReadyTime > 0 ? applicationReadyTime : now;
        long totalStartupDuration = currentReadyTime - jvmStartTime;

        report.put("jvmStart", new Date(jvmStartTime));
        report.put("totalStartupTimeSec", totalStartupDuration / 1000.0);
        report.put("springBootstrapSec", contextRefreshTime > 0 ? (contextRefreshTime - jvmStartTime) / 1000.0 : null);
        report.put("contextToStartTransitionSec", (applicationStartedTime > 0 && contextRefreshTime > 0) ? (applicationStartedTime - contextRefreshTime) / 1000.0 : null);
        report.put("applicationRunnersSec", (applicationReadyTime > 0 && applicationStartedTime > 0) ? (applicationReadyTime - applicationStartedTime) / 1000.0 : null);
        
        return report;
    }
}
