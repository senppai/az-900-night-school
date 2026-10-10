import { LEARN } from "../official-modules";
import type { Lesson } from "../types";

export const lesson: Lesson = {
  slug: "cloud-benefits",
  order: 4,
  title: "Benefits of using cloud services",
  emoji: "📈",
  domain: "cloud",
  minutes: 16,
  summary:
    "High availability, scale-up vs scale-out, elasticity, reliability, cost and performance predictability, security, governance, and manageability — the reasons companies actually move.",
  examFocus:
    "Microsoft will describe a symptom (Black Friday traffic, a failed disk, a surprise bill, a patch Tuesday) and want the benefit by name. Vertical vs horizontal scaling is the mix-up they never get tired of.",
  youWillLearn: [
    "High availability vs reliability, in human language",
    "Vertical scaling, horizontal scaling, and elasticity",
    "Performance predictability vs cost predictability",
    "What security, governance, and manageability mean in the cloud",
    "Why sustainability is now on the list of cloud benefits",
  ],
  officialModule: {
    ...LEARN.cloudBenefits,
    units: [
      "Describe the benefits of high availability and scalability in the cloud",
      "Describe the benefits of reliability and predictability in the cloud",
      "Describe the benefits of security and governance in the cloud",
      "Describe the benefits of manageability in the cloud",
      "Describe sustainability considerations in the cloud",
    ],
  },
  blocks: [
    {
      type: "lead",
      emoji: "🎯",
      text: "Companies do not move to Azure because \"cloud\" sounds modern. They move because a well-designed cloud app can stay up, grow when it is busy, shrink when it is quiet, fail over when hardware dies, and be managed without a plane ticket to a datacenter. This lesson is the vocabulary for those wins.",
    },
    {
      type: "p",
      text: "AZ-900 groups the benefits into four clusters: high availability and scalability; reliability and predictability; security and governance; manageability. Learn the clusters, then learn the words inside them so a scenario maps to one term, not a vague \"it's better.\"",
    },
    {
      type: "think",
      text: "Every benefit answers a pain: downtime, sudden load, surprise bills, patch chaos, or \"who is allowed to do what.\"",
    },
    {
      type: "heading",
      text: "High availability",
    },
    {
      type: "p",
      text: "Availability is the percentage of time a system does what users need. High availability (HA) means you designed it so a single failure does not take the whole thing down — extra instances, extra datacenters, load balancers, SLAs. Azure regions and availability zones exist so you can spread risk. An SLA like 99.99% is a contract about that design, not a magic spell.",
    },
    {
      type: "example",
      title: "One oven vs two kitchens",
      body: "A restaurant with one oven is cheap until the oven dies on Saturday night. Two kitchens on two streets is high availability. In Azure that might be two VMs in two availability zones behind a load balancer, not a bigger single VM.",
    },
    {
      type: "heading",
      text: "Scalability: up vs out",
    },
    {
      type: "p",
      text: "Scalability is the ability to increase (or decrease) capacity when load changes. There are two directions, and the exam will use both names.",
    },
    {
      type: "compare",
      items: [
        {
          title: "Vertical scaling",
          subtitle: "Scale up / scale down",
          points: [
            "Same machine, more (or less) CPU, RAM, or disk",
            "Like replacing a laptop with a workstation",
            "Simple, but you eventually hit a ceiling",
            "Often involves a resize (and sometimes a reboot)",
          ],
        },
        {
          title: "Horizontal scaling",
          subtitle: "Scale out / scale in",
          points: [
            "More machines (or fewer), same role",
            "Like opening more checkout lanes",
            "The cloud-native way to handle huge load",
            "Needs a load balancer and an app that can run in many copies",
          ],
        },
      ],
    },
    {
      type: "diagram",
      title: "Up is bigger. Out is more.",
      ascii: `VERTICAL (scale up)              HORIZONTAL (scale out)

   [  small VM  ]                  [ VM ] [ VM ]
          ↓                        [ VM ] [ VM ] [ VM ]
   [   BIG VM   ]                     more copies

  one box, more power             more boxes, same job`,
    },
    {
      type: "p",
      text: "Elasticity is scalability with an automatic spring. The system adds capacity when load rises and removes it when load falls, without a human opening a ticket. Black Friday is the story: scale out at 6 p.m., scale in at 2 a.m., stop paying for idle VMs. Scalability says you can grow. Elasticity says you grow and shrink by itself.",
    },
    {
      type: "think",
      text: "Scale up = bigger box. Scale out = more boxes. Elasticity = the boxes appear and vanish on their own.",
    },
    {
      type: "trap",
      text: "High availability is not the same as scalability. HA is \"still up when something breaks.\" Scale is \"handles more work.\" A single huge VM can be scalable vertically and still be a terrible HA story — that one VM is a single point of failure.",
    },
    {
      type: "heading",
      text: "Reliability and predictability",
    },
    {
      type: "p",
      text: "Reliability is the system's ability to recover from failures and keep providing a consistent service — resiliency plus availability. Disaster recovery is the big-failure cousin: restore within an acceptable time (RTO) with an acceptable amount of data loss (RPO). The cloud helps because you can copy workloads to another region without buying a second building first.",
    },
    {
      type: "p",
      text: "Predictability has two flavors on AZ-900, and they are not interchangeable. Performance predictability means the app behaves consistently — you can size, test, and autoscale so users do not see random slowness. Cost predictability means you can forecast the bill — budgets, reservations, alerts — instead of discovering a surprise invoice. Same word, two exam answers.",
    },
    {
      type: "example",
      title: "Northwind wants both kinds of predictable",
      body: "Finance wants a forecast within 10% each month (cost predictability) so they buy reservations for the always-on VMs. The website team wants checkout to stay under 200 ms even at noon (performance predictability) so they load-test and set autoscale rules. Both are \"predictability.\" The scenario tells you which one.",
    },
    {
      type: "heading",
      text: "Security and governance",
    },
    {
      type: "p",
      text: "Security in the cloud is not \"Microsoft already did it\" — you saw that in shared responsibility. The benefit is that you inherit a huge physical security program, plus a catalog of tools (identity, encryption, network controls, threat detection) that a 20-person company could not build alone. You still configure them.",
    },
    {
      type: "p",
      text: "Governance is how the organization stays in control: policies, standards, who can create what, which regions are allowed, tags for cost owners, audits. In Azure that later becomes Azure Policy, management groups, and RBAC. For this lesson, remember the idea: cloud makes it easier to apply the same rules everywhere, instead of hoping each office's server closet matches the spreadsheet.",
    },
    {
      type: "exam",
      title: "AZ-900 exam points",
      points: [
        "HA: design so failures do not take you fully down",
        "Vertical = bigger VM; horizontal = more VMs",
        "Elasticity = automatic scale out and in",
        "Reliability: recover and keep serving",
        "Predictability: performance and/or cost",
        "Security: platform capabilities + your configuration",
        "Governance: enforce organizational rules at scale",
      ],
    },
    {
      type: "heading",
      text: "Manageability in the cloud",
    },
    {
      type: "p",
      text: "Manageability is the unglamorous superpower. You manage resources through a browser (Azure portal), command lines (CLI, PowerShell, Cloud Shell), APIs, and templates — from anywhere, without a crash cart. Microsoft can patch the platform underneath PaaS and SaaS. You can automate the boring work. A related word you will see is agility: the ability to stand up a new environment in minutes when the business changes its mind.",
    },
    {
      type: "diagram",
      title: "Benefits as a map",
      ascii: `Stay up ─────────── High availability
Handle more ─────── Scalability (up or out)
Auto spring ─────── Elasticity
Get back up ─────── Reliability / DR
No surprises ────── Predictability (perf + cost)
Stay safe ───────── Security
Stay in control ─── Governance
Run it without flying to a rack ── Manageability`,
    },
    {
      type: "heading",
      text: "Sustainability",
    },
    {
      type: "p",
      text: "The newest benefit on the Microsoft Learn list is sustainability. Large cloud datacenters run hardware much more efficiently than a server closet: servers are shared by many customers, so fewer machines sit idle; cooling and power are engineered at huge scale; and Microsoft buys renewable energy for its regions. When you scale in at night or delete what you do not use, you also stop drawing power for it. Microsoft gives customers carbon-emissions reporting so they can see the footprint of their cloud usage.",
    },
    {
      type: "think",
      text: "Sustainability = do the same work with less energy and less idle hardware. Right-sizing and elasticity save money AND carbon.",
    },
    {
      type: "trap",
      text: "Sustainability does not mean “Azure is carbon-free by default” or “you no longer have responsibilities.” You still choose sizes, regions, and when to turn things off. Unused resources still burn energy and money.",
    },
    {
      type: "cheatsheet",
      rows: [
        {
          term: "Sustainability",
          what: "Efficient shared datacenters, renewable energy, emissions reporting",
          remember: "Turn off what you do not use",
        },
        {
          term: "High availability",
          what: "Keep serving when parts fail",
          remember: "Extra instances, zones, SLAs",
        },
        {
          term: "Vertical scaling",
          what: "Bigger (or smaller) machine",
          remember: "Scale up / down",
        },
        {
          term: "Horizontal scaling",
          what: "More (or fewer) machines",
          remember: "Scale out / in",
        },
        {
          term: "Elasticity",
          what: "Automatic scale with demand",
          remember: "The spring, not just the ability",
        },
        {
          term: "Reliability",
          what: "Recover and stay consistent",
          remember: "Resiliency + availability",
        },
        {
          term: "Predictability",
          what: "Stable performance and/or forecastable cost",
          remember: "Read which one the story wants",
        },
        {
          term: "Governance",
          what: "Org policies applied to cloud resources",
          remember: "Control, not just security tools",
        },
        {
          term: "Manageability",
          what: "Operate via portal, CLI, APIs, automation",
          remember: "No plane ticket to the rack",
        },
      ],
    },
    {
      type: "onesentence",
      text: "Cloud benefits are staying up (HA), growing the right way (scale up vs out, elasticity), recovering (reliability), avoiding surprises (predictable performance and cost), and running the place with security, governance, and remote manageability.",
    },
    {
      type: "scenario",
      title: "Exam-style scene",
      setup: "PixelForge's game store dies every launch day because one web server maxes out. They can tolerate many identical servers behind a load balancer, and they want extra servers to appear only during launches, then disappear.",
      answer: "Horizontal scaling plus elasticity (scale out automatically, then scale in)",
      why: "A bigger single server would be vertical scaling and still one point of failure. The \"appear and disappear\" language is elasticity, not a one-time resize.",
    },
  ],
  quiz: [
    {
      id: "cb-1",
      prompt:
        "A team resizes a virtual machine from 4 vCPUs to 16 vCPUs. What is that?",
      options: [
        "Horizontal scaling (scale out)",
        "Vertical scaling (scale up)",
        "A new availability zone",
        "Governance",
      ],
      answer: 1,
      explanation:
        "Same resource, more power = vertical / scale up. Horizontal would add more VMs.",
    },
    {
      id: "cb-2",
      prompt:
        "An online shop automatically adds web servers when CPU is high and removes them at night. Which benefit is that primarily?",
      options: [
        "CapEx",
        "Elasticity",
        "Private cloud",
        "Spot eviction",
      ],
      answer: 1,
      explanation:
        "Automatic grow-and-shrink with demand is elasticity. Scalability is the broader ability to grow; elasticity is the automatic spring.",
    },
    {
      id: "cb-3",
      prompt:
        "A company deploys two VMs in two availability zones behind a load balancer so a datacenter issue does not take the site down. Which benefit is the main goal?",
      options: [
        "High availability",
        "Vertical scaling",
        "Cost CapEx",
        "Multi-cloud",
      ],
      answer: 0,
      explanation:
        "Spreading instances so a failure does not kill the service is high availability. Vertical scaling would have been \"make the one VM bigger.\"",
      trap: "Do not call this elasticity unless the story also says instances appear and vanish automatically with load.",
    },
    {
      id: "cb-4",
      prompt:
        "Finance wants next quarter's Azure bill to be forecastable within a range, using reservations and budgets. Which benefit is that?",
      options: [
        "Performance predictability",
        "Cost predictability",
        "Horizontal scaling",
        "Physical datacenter ownership",
      ],
      answer: 1,
      explanation:
        "Predictability splits into performance and cost. Budgets and reservations are cost. Load tests and autoscale for latency are performance.",
    },
    {
      id: "cb-5",
      prompt:
        "Which statement best describes governance in the cloud?",
      options: [
        "Microsoft physically guards the datacenter so you need no policies",
        "Applying organizational rules and standards to cloud resources",
        "Always choosing the largest VM size",
        "Deleting all logs to save money",
      ],
      answer: 1,
      explanation:
        "Governance is control: policies, allowed regions, naming, tags, who can deploy. Physical guards are Microsoft's security of the building, which is not the same thing.",
    },
    {
      id: "cb-6",
      prompt:
        "An admin in another country updates a resource group from Cloud Shell in a browser. Which benefit is that illustrating?",
      options: [
        "Manageability",
        "Spot pricing",
        "Private cloud hardware exclusive use",
        "Vertical scaling",
      ],
      answer: 0,
      explanation:
        "Manageability is operating the environment remotely through portal, CLI, APIs, and automation — without standing in the datacenter.",
    },
    {
      id: "cb-7",
      prompt:
        "Which statement describes how the cloud can support sustainability goals?",
      options: [
        "Shared, efficiently run datacenters mean less idle hardware and energy per workload",
        "Cloud resources use no electricity",
        "Microsoft guarantees every customer is carbon-neutral automatically",
        "Sustainability only applies to private clouds",
      ],
      answer: 0,
      explanation:
        "High utilization of shared hardware, efficient cooling, and renewable energy purchases reduce the footprint per workload. Customers still choose what to run and when.",
    },
    {
      id: "cb-8",
      prompt:
        "A web app recovers automatically when a VM fails and keeps serving users. Which benefit is described?",
      options: ["Reliability", "Cost predictability", "Governance", "Vertical scaling"],
      answer: 0,
      explanation:
        "Reliability is the ability to recover from failures and keep functioning. HA is closely related; the recovery wording points to reliability.",
    },
    {
      id: "cb-9",
      prompt:
        "A company wants to use templates and policies so every new environment is deployed the same way and stays compliant. Which benefit pair is this?",
      options: [
        "Governance and manageability",
        "Elasticity and Spot pricing",
        "High availability and region pairs",
        "CapEx and depreciation",
      ],
      answer: 0,
      explanation:
        "Standard templates and policies are governance; deploying and managing them through automation is manageability.",
    },
    {
      id: "cb-10",
      prompt:
        "Which phrase describes scaling OUT?",
      options: [
        "Adding more instances of a resource",
        "Adding more CPU to a single instance",
        "Moving the app to another region",
        "Reducing the price with a reservation",
      ],
      answer: 0,
      explanation:
        "Scale out = more instances (horizontal). Scale up = more power per instance (vertical).",
    },
  ],
};
