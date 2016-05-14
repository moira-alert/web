import {full_sched} from './schedule';

export var triggers = {
  list: [
    {
      warn_value: 0,
      error_value: -1,
      sched: full_sched,
      name: "Moira service status",
      tags: [
        "DevOps",
        "Moira"
      ],
      throttling: false,
      timestamp: 1439203861,
      ttl_state: "NODATA",
      targets: [
        "DevOps.systemd.moira*.running"
      ],
      patterns: [
        "DevOps.systemd.moira*.running"
      ],
      ttl: 600,
      last_check: {
        metrics: {
          "DevOps.systemd.moira-notifier.running": {
            "timestamp": 1441867057,
            "state": "OK",
            "value": 1
          },
          "DevOps.systemd.moira-api.running": {
            "timestamp": 1441867057,
            "state": "OK",
            "value": 1
          },
          "DevOps.systemd.moira-checker.running": {
            "timestamp": 1441867057,
            "state": "OK",
            "value": 1
          },
          "DevOps.systemd.moira-cache.running": {
            "timestamp": 1441867057,
            "state": "WARN",
            "value": 1
          }
        },
        timestamp: 1441867117,
        state: "OK",
        score: 0
      },
      expression: "",
      id: "c681cf70-9336-4be5-a175-fb9f6044e284"
    },
    {
      warn_value: 1200,
      error_value: 1500,
      sched: full_sched,
      name: "Throttling",
      tags: [
        "Throttling"
      ],
      throttling: true,
      timestamp: 1438757161,
      ttl_state: "NODATA",
      targets: [
        "DevOps.moira.cache.received.total.one-minute"
      ],
      patterns: [
        "DevOps.moira.cache.received.total.one-minute"
      ],
      ttl: 600,
      last_check: {
        metrics: {
          "DevOps.moira.cache.received.total.one-minute": {
            "timestamp": 1441867032,
            "state": "NODATA"
          },
        },
        timestamp: 1441867092,
        state: "OK",
        score: 1000
      },
      expression: "",
      id: "17b3e2d9-49cc-46e5-8eb0-42c16cec8dea"
    },
  ]
}