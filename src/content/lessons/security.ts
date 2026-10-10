import { LEARN } from "../official-modules";
import type { Lesson } from "../types";

export const lesson: Lesson = {
  slug: "security",
  order: 12,
  title: "Azure access and security",
  emoji: "🛡️",
  domain: "architecture",
  minutes: 16,
  summary:
    "RBAC, Zero Trust, defense-in-depth, encryption with Azure Key Vault, and Microsoft Defender for Cloud — plus a light contrast with Policy and locks so you do not mix the three tools.",
  examFocus:
    "RBAC answers who can do what. Policy answers what is allowed to exist. Locks answer what cannot be deleted. Zero Trust is a mindset. Defender for Cloud is the security score and protection service.",
  youWillLearn: [
    "How Azure RBAC uses roles and scopes",
    "The Zero Trust idea in exam language",
    "Defense-in-depth as stacked layers, not one magic product",
    "What Microsoft Defender for Cloud is for — and how RBAC differs from Policy and locks",
    "Encryption at rest and in transit, and what Azure Key Vault stores",
  ],
  officialModule: {
    ...LEARN.identity,
    units: [
      "Describe Azure role-based access control",
      "Describe Zero Trust model",
      "Describe defense-in-depth",
      "Describe encryption and key management in Azure",
      "Describe Microsoft Defender for Cloud",
    ],
  },
  blocks: [
    {
      type: "lead",
      emoji: "🛡️",
      text: "Identity proved who you are. Security is what happens next: what you are allowed to do, how Azure thinks about trust, how layers pile up, and which service watches your security posture. The exam loves mixing these names. We will keep them in separate drawers.",
    },
    {
      type: "p",
      text: "Picture an office building. The badge at the door is authentication (last lesson). Your job title — receptionist, electrician, CEO — is authorization. Azure's job-title system is role-based access control. Around that sit two bigger ideas: never assume the person in the hallway is safe (Zero Trust), and never rely on a single lock (defense-in-depth).",
    },
    {
      type: "heading",
      text: "1. Azure role-based access control (RBAC)",
    },
    {
      type: "p",
      text: "Azure RBAC is authorization: who can do what, on which scope. You assign a role to a user, group, or service principal, at a management group, subscription, resource group, or single resource. Built-in roles you will see on the exam include Owner (full control, including access), Contributor (create and manage, but not grant access), and Reader (look but do not change). The habit Microsoft wants is least privilege: the smallest role on the smallest scope that still gets the job done.",
    },
    {
      type: "diagram",
      title: "RBAC scope inherits downward",
      ascii: `Management group
        │  (role here applies to everything below)
        ▼
   Subscription
        │
        ▼
   Resource group
        │
        ▼
     Resource`,
    },
    {
      type: "example",
      title: "Least privilege in one sentence",
      body: "A developer needs to restart web apps in the “dev” resource group. Give them Contributor (or a tighter web-app role) on that resource group — not Owner on the whole subscription.",
    },
    {
      type: "think",
      text: "RBAC = job title + floor of the building. Owner / Contributor / Reader are the titles. Management group → subscription → resource group → resource are the floors.",
    },
    {
      type: "heading",
      text: "2. Zero Trust",
    },
    {
      type: "p",
      text: "Old model: if you are on the corporate network, we trust you. Zero Trust says the opposite. Never trust, always verify. Being “inside” is not enough. Every request is checked. Three phrases show up again and again: verify explicitly, use least privilege, assume breach. MFA, Conditional Access, and tight RBAC are how Azure puts that idea to work — but Zero Trust itself is the model, not a single checkbox named Zero Trust.",
    },
    {
      type: "list",
      items: [
        "Verify explicitly — authenticate and authorize using all the signals you have (identity, device, location, risk).",
        "Least privilege — just enough access, just in time, just the right scope.",
        "Assume breach — design as if an attacker is already inside, so one stolen password is not the whole company.",
      ],
    },
    {
      type: "think",
      text: "Zero Trust is a castle where even the king shows a badge at every door. It is a strategy, not a product SKU.",
    },
    {
      type: "heading",
      text: "3. Defense-in-depth",
    },
    {
      type: "p",
      text: "Defense-in-depth means stacked layers. If one layer fails, the next one still has a chance. Azure describes layers from the physical datacenter up through identity, perimeter, network, compute, application, and data. A firewall alone is not defense-in-depth. MFA plus NSGs plus encryption plus RBAC plus physical security — that is the model.",
    },
    {
      type: "diagram",
      title: "Layers, not one wall",
      ascii: `  ┌─────────────────────────────┐
  │ Physical (datacenter)       │
  │  Identity & access          │
  │   Perimeter                 │
  │    Network                  │
  │     Compute                 │
  │      Application            │
  │       Data                  │
  └─────────────────────────────┘
         If one layer fails,
         the others still stand.`,
    },
    {
      type: "heading",
      text: "4. Encryption and key management",
    },
    {
      type: "p",
      text: "Encryption scrambles data so only someone with the key can read it. Azure talks about two states. Encryption at rest protects stored data — Azure Storage, managed disks, and Azure SQL Database encrypt data at rest by default with Microsoft-managed keys. Encryption in transit protects data moving across a network — TLS/HTTPS for web traffic, plus encrypted tunnels like VPN Gateway. If you must control the keys yourself (for compliance), you can use customer-managed keys stored in Azure Key Vault.",
    },
    {
      type: "p",
      text: "Azure Key Vault is the safe for secrets: application secrets (connection strings, passwords, API keys), cryptographic keys, and TLS/SSL certificates. Apps fetch what they need at runtime instead of hard-coding a password in a config file, access is controlled with Entra ID and RBAC, and every use is logged. Managed HSM is the option when you need keys held in dedicated hardware security modules.",
    },
    {
      type: "compare",
      items: [
        {
          title: "At rest",
          subtitle: "Data sitting on disk",
          points: ["Storage, disks, databases", "On by default with Microsoft-managed keys", "Customer-managed keys optional"],
        },
        {
          title: "In transit",
          subtitle: "Data moving on a network",
          points: ["TLS / HTTPS", "VPN Gateway tunnels", "Protects against eavesdropping"],
        },
        {
          title: "Azure Key Vault",
          subtitle: "Where keys and secrets live",
          points: ["Secrets, keys, certificates", "Access via Entra ID + RBAC", "Audited every time it is used"],
        },
      ],
    },
    {
      type: "trap",
      text: "Key Vault stores secrets; it does not encrypt your whole storage account by itself, and it is not an identity provider. And “encrypted at rest by default” does not make your data public-proof — access is still your job.",
    },
    {
      type: "heading",
      text: "5. Microsoft Defender for Cloud",
    },
    {
      type: "p",
      text: "Microsoft Defender for Cloud is Azure's cloud security posture and workload protection service. It looks at how you configured things, gives you a Secure Score, and recommends fixes (turn on MFA, close a public storage account, patch a VM). It can also protect workloads — servers, databases, containers — in Azure and, with extra setup, in hybrid and other clouds. Think of it as a security advisor that also helps shield the workloads, not as RBAC and not as a firewall you draw on a VNet.",
    },
    {
      type: "think",
      text: "Defender for Cloud = “how secure is my estate, and what should I fix?” Azure Advisor also gives security tips, but Defender for Cloud is the dedicated security posture and protection service.",
    },
    {
      type: "heading",
      text: "6. RBAC vs Policy vs locks (light contrast)",
    },
    {
      type: "p",
      text: "Three tools sit near each other on the exam. They are not interchangeable. You will meet Policy and locks in more depth in the governance lesson. For now, only the contrast matters.",
    },
    {
      type: "compare",
      items: [
        {
          title: "RBAC",
          subtitle: "Who can do what",
          points: [
            "Assign roles to people and apps",
            "Owner, Contributor, Reader, and many more",
            "Scoped to MG / subscription / RG / resource",
          ],
        },
        {
          title: "Azure Policy",
          subtitle: "What is allowed",
          points: [
            "Rules such as “only these regions”",
            "Can audit or deny non-compliant resources",
            "About configuration, not job titles",
          ],
        },
        {
          title: "Resource locks",
          subtitle: "Cannot delete (or cannot change)",
          points: [
            "CanNotDelete or ReadOnly",
            "Even an Owner must remove the lock first",
            "A padlock, not a permission set",
          ],
        },
      ],
    },
    {
      type: "trap",
      text: "RBAC does not stop someone with Contributor from deleting a VM they are allowed to manage. A lock does. Policy does not assign the Contributor role. RBAC does. If the question is “who may create VMs,” that is RBAC. If it is “nobody may create VMs in East US,” that is Policy. If it is “do not let anyone delete this production vault,” that is a lock.",
    },
    {
      type: "exam",
      title: "AZ-900 exam points",
      points: [
        "RBAC = authorization: roles + scope, least privilege",
        "Zero Trust = never trust, always verify (verify explicitly, least privilege, assume breach)",
        "Defense-in-depth = many layers, so one failure is not game over",
        "Microsoft Defender for Cloud = security posture (Secure Score) and workload protection",
        "Do not confuse Defender for Cloud with Entra ID or with Azure Policy",
      ],
    },
    {
      type: "cheatsheet",
      rows: [
        {
          term: "Azure Key Vault",
          what: "Safe for secrets, keys, and certificates",
          remember: "No passwords in config files",
        },
        {
          term: "Encryption at rest / in transit",
          what: "Stored data / data moving on a network",
          remember: "Disk vs wire (TLS)",
        },
        {
          term: "Azure RBAC",
          what: "Who can do what, where",
          remember: "Job title + scope",
        },
        {
          term: "Least privilege",
          what: "Smallest role, smallest scope",
          remember: "Not Owner on the subscription “just in case”",
        },
        {
          term: "Zero Trust",
          what: "Never trust, always verify",
          remember: "A model, not a product",
        },
        {
          term: "Defense-in-depth",
          what: "Stacked security layers",
          remember: "Moat + walls + guards + locked chest",
        },
        {
          term: "Defender for Cloud",
          what: "Posture + workload protection",
          remember: "Secure Score and recommendations",
        },
        {
          term: "Policy / locks",
          what: "Allowed config / cannot delete",
          remember: "Not the same as RBAC",
        },
      ],
    },
    {
      type: "onesentence",
      text: "RBAC decides who can do what at which scope, Zero Trust refuses to trust a request just because it is “inside,” defense-in-depth stacks layers so one failure is not fatal, and Defender for Cloud scores and helps protect the estate — while Policy and locks handle allowed configuration and delete protection, not job titles.",
    },
    {
      type: "scenario",
      title: "Exam-style scene",
      setup: "A security lead wants a single Azure service that shows a Secure Score, flags a storage account that is open to the internet, and can add extra protection to VMs and databases.",
      answer: "Microsoft Defender for Cloud",
      why: "That is posture management plus workload protection. Advisor gives broader recommendations including cost. RBAC only assigns roles. Conditional Access only evaluates sign-ins.",
    },
  ],
  quiz: [
    {
      id: "sec-1",
      prompt: "What does Azure RBAC primarily control?",
      options: [
        "Which regions a resource is allowed to use",
        "Who can perform which actions on a scope",
        "Whether a resource can be deleted",
        "Whether a sign-in from another country requires MFA",
      ],
      answer: 1,
      explanation:
        "RBAC is authorization: roles on a scope. Policy covers allowed configuration (such as regions). Locks cover delete/change. Conditional Access covers sign-in if/then rules.",
      trap: "“Who can do what” is RBAC. “What is allowed to exist” is Policy.",
    },
    {
      id: "sec-2",
      prompt:
        "You need a teammate to view everything in a resource group but not change it. Which built-in role fits?",
      options: ["Owner", "Contributor", "Reader", "User Access Administrator"],
      answer: 2,
      explanation:
        "Reader is look-but-do-not-change. Contributor can change resources but not grant access. Owner can do both, including access.",
    },
    {
      id: "sec-3",
      prompt: "Which statement best describes Zero Trust?",
      options: [
        "Trust every request that comes from the corporate network",
        "Never trust, always verify — even “inside” traffic is checked",
        "Put every workload in a single network security group",
        "Turn off MFA once a user is on a VPN",
      ],
      answer: 1,
      explanation:
        "Zero Trust assumes the network is hostile. Verify explicitly, least privilege, assume breach. Being on the VPN is not a free pass.",
    },
    {
      id: "sec-4",
      prompt: "Defense-in-depth means:",
      options: [
        "Buying one very strong firewall and nothing else",
        "Using several independent security layers so one failure is not enough",
        "Assigning every user the Owner role",
        "Storing passwords in a spreadsheet as a backup layer",
      ],
      answer: 1,
      explanation:
        "Layers: physical, identity, perimeter, network, compute, application, data. One product is not the model.",
    },
    {
      id: "sec-5",
      prompt: "Which service is designed to improve cloud security posture and protect workloads?",
      options: [
        "Azure Pricing Calculator",
        "Microsoft Defender for Cloud",
        "Azure Cloud Shell",
        "Azure Arc",
      ],
      answer: 1,
      explanation:
        "Defender for Cloud provides Secure Score, recommendations, and workload protection. The others are cost, command-line, and hybrid management tools.",
    },
    {
      id: "sec-6",
      prompt:
        "You must stop anyone — including Owners — from accidentally deleting a production key vault until a second person removes a protection. What do you use?",
      options: [
        "An Azure Policy initiative",
        "The Reader role",
        "A resource lock (CanNotDelete)",
        "Microsoft Entra Domain Services",
      ],
      answer: 2,
      explanation:
        "Locks block delete (or all changes) even for Owners until the lock is removed. Policy governs configuration. Reader cannot protect against an Owner. Domain Services is identity for legacy apps.",
    },
    {
      id: "sec-7",
      prompt:
        "Developers keep database connection strings in application config files. Where should these secrets be stored instead?",
      options: [
        "Azure Key Vault",
        "Azure Advisor",
        "A resource tag",
        "Azure DNS",
      ],
      answer: 0,
      explanation:
        "Key Vault securely stores secrets, keys, and certificates with access control and auditing. Tags are plain-text labels.",
      trap: "Never put a secret in a tag — tags are visible metadata.",
    },
    {
      id: "sec-8",
      prompt:
        "HTTPS protects a user's data as it travels from the browser to an Azure web app. What is this an example of?",
      options: [
        "Encryption in transit",
        "Encryption at rest",
        "Role-based access control",
        "A resource lock",
      ],
      answer: 0,
      explanation:
        "TLS/HTTPS encrypts data moving on the network — in transit. At rest is about stored data.",
    },
    {
      id: "sec-9",
      prompt:
        "Which of the following is one of the three principles of Zero Trust?",
      options: ["Assume breach", "Trust the internal network", "Use one firewall", "Share admin accounts"],
      answer: 0,
      explanation:
        "Zero Trust principles: verify explicitly, use least-privilege access, assume breach.",
    },
    {
      id: "sec-10",
      prompt:
        "What is Secure Score in Microsoft Defender for Cloud?",
      options: [
        "A measurement of your security posture, with recommendations to raise it",
        "The SLA of a virtual machine",
        "The monthly cost estimate for security services",
        "The number of users with MFA disabled by Microsoft",
      ],
      answer: 0,
      explanation:
        "Secure Score summarizes how well your resources follow security recommendations. Fixing recommendations raises the score.",
    },
  ],
};
