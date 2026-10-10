import { LEARN } from "../official-modules";
import type { Lesson } from "../types";

export const lesson: Lesson = {
  slug: "monitoring",
  order: 16,
  title: "Monitoring Azure: Advisor, Service Health, and Monitor",
  emoji: "📡",
  domain: "governance",
  minutes: 18,
  summary:
    "Azure Advisor for recommendations, Azure Service Health for “is my stuff on fire,” and Azure Monitor — Log Analytics, alerts, and Application Insights — for telemetry.",
  examFocus:
    "Advisor suggests. Service Health is personalized to your subscriptions (Status is the public page). Monitor collects metrics and logs; Log Analytics queries them; alerts notify; Application Insights watches your app.",
  youWillLearn: [
    "The five recommendation categories in Azure Advisor",
    "Service Health vs Resource Health vs the public Azure Status page",
    "What Azure Monitor is, including Log Analytics and alerts",
    "When Application Insights is the right name on a question",
  ],
  officialModule: {
    ...LEARN.monitoring,
    units: [
      "Describe the purpose of Azure Advisor",
      "Describe Azure Service Health",
      "Describe Azure Monitor",
    ],
  },
  blocks: [
    {
      type: "lead",
      emoji: "📡",
      text: "Azure can recommend better setups, tell you when Microsoft is having a bad day that actually hits you, and collect the numbers and logs your apps produce. Those are three different products. The exam will offer all three as answers to the same story. We will give each one a job description.",
    },
    {
      type: "p",
      text: "A hospital analogy helps. Azure Advisor is the consultant who walks the wards and says “this bed could be cheaper, this door should be locked.” Azure Service Health is the hospital operator telling you which of your rooms are affected by a water outage. Azure Monitor is the banks of screens: heart rate, temperature, alarms, and a specialist who only watches one patient (your application).",
    },
    {
      type: "heading",
      text: "1. Azure Advisor",
    },
    {
      type: "p",
      text: "Azure Advisor looks at your resources and produces personalized recommendations. It does not deploy them for you unless you choose to act. For AZ-900, memorize the five categories: Cost, Security, Reliability, Operational excellence, and Performance. (You may also see Sustainability in the product; the exam still hangs on those five.) Advisor is not an outage dashboard and it is not a log query tool.",
    },
    {
      type: "list",
      items: [
        "Cost — unused public IPs, idle VMs, reservations you could buy",
        "Security — follow-up on hardening (Defender for Cloud often feeds this story)",
        "Reliability — make things survive failure (zones, backups, redundancy)",
        "Operational excellence — follow good practices, subscriptions, notifications",
        "Performance — SKUs, caching, throughput that is too small",
      ],
    },
    {
      type: "think",
      text: "Advisor = “here is how to run Azure better.” If the scenario is an ongoing Microsoft outage, Advisor is the wrong answer.",
    },
    {
      type: "heading",
      text: "2. Azure Service Health",
    },
    {
      type: "p",
      text: "Azure Service Health is personalized. It knows your subscriptions and tells you about issues that affect you: service problems, planned maintenance, health advisories, and security advisories. You can set up alerts so someone is paged when Microsoft posts an incident on a service you actually use. Resource Health is the sibling view for one resource: “is this particular VM healthy right now, and was it Microsoft's fault?” The public Azure Status page is different — a global billboard for everyone, not tailored to your account.",
    },
    {
      type: "compare",
      items: [
        {
          title: "Azure Status",
          subtitle: "Public billboard",
          points: [
            "status.azure.com (and similar public views)",
            "Worldwide picture of Azure",
            "Not customized to your subscriptions",
          ],
        },
        {
          title: "Azure Service Health",
          subtitle: "Your subscriptions",
          points: [
            "Service issues that hit you",
            "Planned maintenance",
            "Health and security advisories",
            "You can alert on it",
          ],
        },
        {
          title: "Resource Health",
          subtitle: "This one resource",
          points: [
            "Is this VM / SQL / app healthy?",
            "Helps tell platform vs your configuration",
            "Zooms in from Service Health",
          ],
        },
      ],
    },
    {
      type: "trap",
      text: "Azure Status is not Service Health. Status = everyone. Service Health = you. If the question says “notify us when an Azure outage affects our subscription,” the answer is Service Health (with alerts), not the public Status page and not Advisor.",
    },
    {
      type: "heading",
      text: "3. Azure Monitor",
    },
    {
      type: "p",
      text: "Azure Monitor is the umbrella for collecting, analyzing, and acting on telemetry. Metrics are numerical measurements over time (CPU %, request count). Logs are records of events. Monitor sits in the middle: data comes in from Azure resources, from guests, from apps; you chart it, query it, alert on it, and optionally send it out.",
    },
    {
      type: "diagram",
      title: "Monitor is the hub",
      ascii: ` Apps, VMs, Azure resources
            │  metrics + logs
            ▼
      Azure Monitor
       /    |     \\
      /     |      \\
 Log        Alerts   Application
 Analytics           Insights
 (query)    (notify) (your app's APM)`,
    },
    {
      type: "heading",
      text: "4. Log Analytics",
    },
    {
      type: "p",
      text: "Log Analytics is the workspace where logs live and where you query them (the language is Kusto Query Language, or KQL — you do not need to write KQL for AZ-900). Think of it as the searchable archive: “show me failed sign-ins,” “show me disk errors on these VMs.” The workspace is the container. Azure Monitor uses it. Many other services send data into it.",
    },
    {
      type: "heading",
      text: "5. Azure Monitor alerts",
    },
    {
      type: "p",
      text: "Alerts are the “tap someone on the shoulder” piece. A condition fires — CPU over 90% for 10 minutes, a log query returns failures, a Service Health incident starts — and an action group emails, SMS, or calls a webhook. Alerts are not recommendations (that is Advisor) and they are not the public Status page. They are rules you define, watching your data.",
    },
    {
      type: "heading",
      text: "6. Application Insights",
    },
    {
      type: "p",
      text: "Application Insights is Azure Monitor's Application Performance Management (APM) feature. You point it at your web app or service and it tracks request rates, response times, failures, dependencies, and live metrics. If the question is about an application — “why is our website slow, where are the exceptions” — Application Insights is the named answer. If the question is about an Azure region outage, it is Service Health. If it is about unused disks, it is Advisor.",
    },
    {
      type: "exam",
      title: "AZ-900 exam points",
      points: [
        "Advisor: Cost, Security, Reliability, Operational excellence, Performance",
        "Service Health: your issues, maintenance, advisories — not the public Status page",
        "Resource Health: this one resource",
        "Azure Monitor: metrics + logs hub",
        "Log Analytics: query logs in a workspace",
        "Alerts: notify when a condition is true",
        "Application Insights: watch the application's health and performance",
      ],
    },
    {
      type: "cheatsheet",
      rows: [
        {
          term: "Azure Advisor",
          what: "Personalized recommendations",
          remember: "Five categories — not an outage feed",
        },
        {
          term: "Azure Status",
          what: "Public Azure health page",
          remember: "Everyone, not just you",
        },
        {
          term: "Service Health",
          what: "Health for your subscriptions",
          remember: "Issues, maintenance, advisories",
        },
        {
          term: "Resource Health",
          what: "Health of one resource",
          remember: "This VM, right now",
        },
        {
          term: "Azure Monitor",
          what: "Telemetry platform",
          remember: "Metrics, logs, hub of the rest",
        },
        {
          term: "Log Analytics",
          what: "Log workspace + queries",
          remember: "Search the archive",
        },
        {
          term: "Alerts",
          what: "Rules + action groups",
          remember: "Notify a person or system",
        },
        {
          term: "Application Insights",
          what: "APM for your app",
          remember: "Requests, failures, performance",
        },
      ],
    },
    {
      type: "steps",
      items: [
        {
          title: "Save money or tighten a VM size",
          text: "Azure Advisor (Cost / Performance).",
        },
        {
          title: "Email us if Microsoft has an incident on our SQL servers",
          text: "Azure Service Health alerts.",
        },
        {
          title: "Is this one disk or VM unhealthy?",
          text: "Resource Health.",
        },
        {
          title: "Query logs across many resources",
          text: "Log Analytics (Azure Monitor).",
        },
        {
          title: "Page on-call when CPU is high",
          text: "Azure Monitor alerts.",
        },
        {
          title: "Our web app is slow and throwing exceptions",
          text: "Application Insights.",
        },
      ],
    },
    {
      type: "onesentence",
      text: "Advisor recommends how to run Azure better, Service Health tells you when Microsoft's issues (or maintenance) hit your subscriptions — unlike the public Status page — and Azure Monitor is the telemetry hub with Log Analytics to query, alerts to notify, and Application Insights to watch your app.",
    },
    {
      type: "scenario",
      title: "Exam-style scene",
      setup: "An operations lead wants two things: a weekly list of unused public IP addresses to delete, and a text message if Azure reports an outage that affects this company's subscriptions.",
      answer: "Azure Advisor for the unused IPs (Cost); Azure Service Health alerts for the outage texts.",
      why: "Advisor finds waste. Service Health is personalized incident information you can alert on. Application Insights would be for the app's own exceptions. The public Status page would not know which subscriptions are yours.",
    },
  ],
  quiz: [
    {
      id: "mon-1",
      prompt: "Which of the following is a recommendation category in Azure Advisor?",
      options: [
        "Conditional Access",
        "Reliability",
        "CanNotDelete",
        "ExpressRoute",
      ],
      answer: 1,
      explanation:
        "Advisor's five categories are Cost, Security, Reliability, Operational excellence, and Performance. The others are identity, locks, and networking.",
    },
    {
      id: "mon-2",
      prompt:
        "You want a personalized view of Azure outages, planned maintenance, and advisories that affect your subscriptions. Which service?",
      options: [
        "The public Azure Status page only",
        "Azure Service Health",
        "Azure Policy",
        "Microsoft Entra ID",
      ],
      answer: 1,
      explanation:
        "Service Health is scoped to your subscriptions. Azure Status is a public, global page and is not personalized.",
      trap: "Status = everyone. Service Health = you.",
    },
    {
      id: "mon-3",
      prompt: "A single virtual machine looks unhealthy and you want to know if the Azure platform is the cause. Where do you look first?",
      options: [
        "Azure Pricing Calculator",
        "Resource Health",
        "Microsoft Purview",
        "A ReadOnly lock",
      ],
      answer: 1,
      explanation:
        "Resource Health is the per-resource view. Service Health is the broader personalized incident feed. Purview is data governance.",
    },
    {
      id: "mon-4",
      prompt: "Where do you run queries against collected logs in Azure Monitor?",
      options: [
        "Azure Cloud Shell only",
        "Log Analytics",
        "Azure Arc",
        "The Pricing Calculator",
      ],
      answer: 1,
      explanation:
        "Log Analytics workspaces store logs and you query them there (KQL). Cloud Shell is a terminal. Arc extends management outside Azure.",
    },
    {
      id: "mon-5",
      prompt:
        "Developers want request rates, response times, and exception traces for their web app. Which feature?",
      options: [
        "Application Insights",
        "Azure Blueprints",
        "Resource locks",
        "Microsoft Entra Domain Services",
      ],
      answer: 0,
      explanation:
        "Application Insights is APM inside Azure Monitor. It is the named tool for application performance and failures.",
    },
    {
      id: "mon-6",
      prompt:
        "You need an email when CPU on a VM stays above 90% for 15 minutes. What do you create?",
      options: [
        "An Azure Policy initiative",
        "An Azure Monitor alert (with an action group)",
        "A CanNotDelete lock",
        "A B2B guest invitation",
      ],
      answer: 1,
      explanation:
        "That is a metric alert in Azure Monitor, delivered through an action group. Policy enforces configuration. Locks prevent delete. Guest invites are identity.",
    },
    {
      id: "mon-7",
      prompt:
        "Which three experiences make up Azure Service Health?",
      options: [
        "Azure status, Service Health, and Resource Health",
        "Advisor, Policy, and Locks",
        "Log Analytics, alerts, and Application Insights",
        "Portal, CLI, and PowerShell",
      ],
      answer: 0,
      explanation:
        "Azure status is the global public view, Service Health is personalized to your subscriptions and regions, and Resource Health is per resource.",
    },
    {
      id: "mon-8",
      prompt:
        "Which website shows the health of all Azure services globally, without signing in?",
      options: ["Azure status", "Resource Health", "Azure Advisor", "Azure Monitor alerts"],
      answer: 0,
      explanation:
        "The Azure status page is public and global. Service Health and Resource Health are personalized and require signing in.",
    },
    {
      id: "mon-9",
      prompt:
        "Azure Monitor collects which two fundamental types of data?",
      options: [
        "Metrics and logs",
        "Invoices and budgets",
        "Users and groups",
        "Tags and locks",
      ],
      answer: 0,
      explanation:
        "Metrics are numeric values over time (CPU %); logs are records of events. Azure Monitor collects both from Azure, on-premises, and other clouds.",
    },
    {
      id: "mon-10",
      prompt:
        "Azure Advisor recommends enabling MFA for admin accounts. Which Advisor category is that?",
      options: ["Security", "Cost", "Performance", "Operational excellence"],
      answer: 0,
      explanation:
        "Advisor's five categories are Reliability, Security, Performance, Operational excellence, and Cost. MFA is a Security recommendation.",
    },
  ],
};
