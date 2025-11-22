import os from "os";

export const HealthService = {
  getHealth() {
    const uptimeSeconds = process.uptime();

    return {
      status: "ok",
      version: "1.0.0",

      uptime: {
        seconds: uptimeSeconds,
        minutes: (uptimeSeconds / 60).toFixed(2),
        hours: (uptimeSeconds / 3600).toFixed(2),
      },

      system: {
        platform: os.platform(),
        architecture: os.arch(),
        cpu_cores: os.cpus().length,
        memory: {
          free: os.freemem(),
          total: os.totalmem(),
        },
        node_version: process.version,
      },

      timestamp: new Date().toISOString(),
    };
  },
};
