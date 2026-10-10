export type ConfusingSet = {
  title: string;
  items: { name: string; job: string }[];
  tell: string;
  lesson: string;
};

export const CONFUSING_SETS: ConfusingSet[] = [
  {
    title: "Policy vs RBAC vs Locks",
    items: [
      { name: "Azure Policy", job: "What configuration is allowed (regions, SKUs, tags)" },
      { name: "Azure RBAC", job: "Who can do which actions at which scope" },
      { name: "Resource locks", job: "Stop delete (CanNotDelete) or any change (ReadOnly), even for Owners" },
    ],
    tell: "\"Only these regions\" → Policy. \"Let Ana restart VMs\" → RBAC. \"Nobody deletes this\" → Lock.",
    lesson: "governance",
  },
  {
    title: "Blueprints vs ARM templates / Bicep",
    items: [
      { name: "Azure Blueprints", job: "Old package of templates + policy + roles — retired in July 2026" },
      { name: "ARM templates / Bicep", job: "Current infrastructure as code, deployed through Azure Resource Manager" },
    ],
    tell: "Blueprints are a legacy distractor. Repeatable deployments today → ARM templates or Bicep (plus Policy).",
    lesson: "manage-and-deploy",
  },
  {
    title: "Advisor vs Service Health vs Monitor",
    items: [
      { name: "Azure Advisor", job: "Recommendations: cost, security, reliability, performance, operational excellence" },
      { name: "Azure Service Health", job: "Microsoft's incidents and maintenance affecting your subscriptions" },
      { name: "Azure Monitor", job: "Your metrics and logs, alerts, Log Analytics, Application Insights" },
    ],
    tell: "\"How can I improve?\" → Advisor. \"Is Azure broken for me?\" → Service Health. \"What is my app doing?\" → Monitor.",
    lesson: "monitoring",
  },
  {
    title: "NSG vs Azure Firewall vs DDoS Protection",
    items: [
      { name: "Network security group", job: "Basic allow/deny port and IP rules on a subnet or NIC" },
      { name: "Azure Firewall", job: "Managed, stateful, central firewall with FQDN and threat-intel rules" },
      { name: "DDoS Protection", job: "Absorbs traffic floods aimed at public endpoints" },
    ],
    tell: "Simple port rules → NSG. Central managed firewall → Azure Firewall. Flood attack → DDoS Protection.",
    lesson: "networking",
  },
  {
    title: "VPN Gateway vs ExpressRoute vs VNet peering",
    items: [
      { name: "VPN Gateway", job: "Encrypted tunnel to on-premises over the public internet" },
      { name: "ExpressRoute", job: "Private connection to on-premises, not over the internet" },
      { name: "VNet peering", job: "Connect Azure VNets to each other over the Microsoft backbone" },
    ],
    tell: "\"Encrypted over the internet\" → VPN. \"Not over the internet\" → ExpressRoute. VNet-to-VNet → peering.",
    lesson: "networking",
  },
  {
    title: "Availability set vs availability zone vs region pair",
    items: [
      { name: "Availability set", job: "Spread VMs across racks and host updates in one datacenter" },
      { name: "Availability zone", job: "Separate datacenters inside one region" },
      { name: "Region pair", job: "Two regions for disaster recovery" },
    ],
    tell: "Rack failure → set. Datacenter failure → zones. Whole region down → pair.",
    lesson: "regions-and-zones",
  },
  {
    title: "Pricing Calculator vs Cost Management vs Migrate business case",
    items: [
      { name: "Pricing Calculator", job: "Estimate Azure cost before you deploy" },
      { name: "Microsoft Cost Management", job: "Analyze real spend, set budgets and alerts" },
      { name: "Azure Migrate business case", job: "Compare on-premises vs Azure (replaces the retired TCO Calculator)" },
    ],
    tell: "Before → Calculator. After → Cost Management. Should we migrate? → business case.",
    lesson: "cost-management",
  },
  {
    title: "Reservations vs savings plan vs Spot",
    items: [
      { name: "Reservations", job: "Commit to a specific resource for 1 or 3 years" },
      { name: "Savings plan for compute", job: "Commit to hourly compute spend; flexible across sizes and regions" },
      { name: "Spot", job: "Deep discount on spare capacity; can be evicted" },
    ],
    tell: "Steady and fixed → reservation. Steady spend but changing shape → savings plan. Interruptible → Spot.",
    lesson: "cost-management",
  },
  {
    title: "Purview vs Policy vs Service Trust Portal",
    items: [
      { name: "Microsoft Purview", job: "Discover, classify, and govern data" },
      { name: "Azure Policy", job: "Enforce resource configuration rules" },
      { name: "Service Trust Portal", job: "Download Microsoft's audit reports and compliance documents" },
    ],
    tell: "Data → Purview. Resources → Policy. Microsoft's proof for auditors → Service Trust Portal.",
    lesson: "governance",
  },
  {
    title: "Entra ID vs Entra Domain Services vs Conditional Access",
    items: [
      { name: "Microsoft Entra ID", job: "Cloud identity: sign-in, SSO, MFA (formerly Azure AD)" },
      { name: "Entra Domain Services", job: "Managed domain join, LDAP, Kerberos for legacy apps" },
      { name: "Conditional Access", job: "If/then rules on sign-in signals (location, device, risk)" },
    ],
    tell: "Modern sign-in → Entra ID. Legacy domain features → Domain Services. \"If X then require MFA\" → Conditional Access.",
    lesson: "identity",
  },
  {
    title: "Cool vs Cold vs Archive",
    items: [
      { name: "Cool", job: "Online, infrequent access, about 30 days minimum" },
      { name: "Cold", job: "Online, rarely accessed, about 90 days minimum" },
      { name: "Archive", job: "Offline, hours to rehydrate, about 180 days minimum" },
    ],
    tell: "Need it instantly? Not Archive. Cold is still online.",
    lesson: "storage",
  },
  {
    title: "Azure AI services vs Azure Machine Learning",
    items: [
      { name: "Azure AI services", job: "Prebuilt models behind APIs (vision, speech, language)" },
      { name: "Azure Machine Learning", job: "Train, deploy, and manage your own models" },
    ],
    tell: "No data scientists → AI services. Custom models → Machine Learning.",
    lesson: "compute",
  },
];

export type SlaPreset = { name: string; sla: number };

export const SLA_PRESETS: SlaPreset[] = [
  { name: "Single VM (Premium SSD)", sla: 99.9 },
  { name: "VMs in an availability set", sla: 99.95 },
  { name: "VMs across availability zones", sla: 99.99 },
  { name: "App Service (Basic tier or higher)", sla: 99.95 },
  { name: "Azure SQL Database", sla: 99.99 },
  { name: "Azure Functions", sla: 99.95 },
  { name: "Standard Load Balancer", sla: 99.99 },
  { name: "Storage account, LRS (reads)", sla: 99.9 },
];

export const EXAM_DAY_FACTS: { label: string; value: string }[] = [
  { label: "Exam time", value: "45 minutes of answering time; plan for about 65 minutes in the seat with the agreement and survey." },
  { label: "Questions", value: "Usually 40–60. Some unscored questions may be included — you will not know which." },
  { label: "Passing score", value: "700 on a 1–1000 scaled score. It is not a straight percentage." },
  {
    label: "Question types",
    value: "Multiple choice, multiple response (choose two), Yes/No statement sets, sentence completion (drop-down), drag-and-drop matching. No hands-on labs.",
  },
  { label: "Where", value: "Pearson VUE (test center or online proctored at home) or Certiport if you are a student or educator." },
  { label: "Results", value: "Pass/fail appears on screen right after the exam, with a score report by skill area." },
  {
    label: "Retake policy",
    value: "Wait 24 hours after a first failed attempt, then 14 days between later attempts, with at most 5 attempts in 12 months.",
  },
  { label: "Validity", value: "Fundamentals certifications do not expire and do not need renewal." },
];

export const EXAM_DAY_TIPS: string[] = [
  "Try the free Microsoft practice assessment and the exam sandbox once before exam day.",
  "Unanswered questions score zero and there is no penalty for guessing — never leave a blank.",
  "Read the last line of the question first, then the scenario. Look for words like BEST, MOST, LEAST, and NOT.",
  "In Yes/No sets, judge each statement on its own — they are independent.",
  "Use Mark for review and keep moving; come back with the time you saved.",
  "Old names still appear: Azure AD = Microsoft Entra ID, Azure Security Center = Defender for Cloud.",
  "For online proctoring: clear desk, ID ready, close every app, and run the system test the day before.",
];

export const SEVEN_DAY_PLAN: { day: number; focus: string; lessons: string[]; task: string }[] = [
  {
    day: 1,
    focus: "Cloud concepts",
    lessons: ["cloud-computing", "shared-responsibility", "cloud-models", "cloud-benefits", "cloud-service-types"],
    task: "Reread the five cloud lessons, then take Level 1.",
  },
  {
    day: 2,
    focus: "Core architecture and compute",
    lessons: ["regions-and-zones", "resource-hierarchy", "compute"],
    task: "Lessons 06–08, then drill those lessons in Level 3.",
  },
  {
    day: 3,
    focus: "Networking and storage",
    lessons: ["networking", "storage"],
    task: "Lessons 09–10, then the matching Level 3 drill. Learn the confusing pairs for networking.",
  },
  {
    day: 4,
    focus: "Identity and security",
    lessons: ["identity", "security"],
    task: "Lessons 11–12, then take Level 2 (comparisons).",
  },
  {
    day: 5,
    focus: "Management and governance",
    lessons: ["cost-management", "governance", "manage-and-deploy", "monitoring"],
    task: "Lessons 13–16, then the matching Level 3 drill.",
  },
  {
    day: 6,
    focus: "Traps and weak areas",
    lessons: [],
    task: "Take Level 4 (Apply). Restudy every lesson in your weak-area list. Read the Quick cheat sheet.",
  },
  {
    day: 7,
    focus: "Dress rehearsal",
    lessons: [],
    task: "Take the Level 5 timed mock. Aim for 80%+. Review misses, then rest — no cramming late at night.",
  },
];
