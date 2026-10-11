import { LEARN } from "../official-modules";
import type { Lesson } from "../types";

export const lesson: Lesson = {
  slug: "shared-responsibility",
  order: 2,
  title: "The shared responsibility model",
  emoji: "🤝",
  domain: "cloud",
  minutes: 18,
  summary:
    "Security in Azure is a split: Microsoft always owns the physical datacenter, you always own your data and access, and everything in between slides depending on IaaS, PaaS, or SaaS.",
  examFocus:
    "The exam will name a layer — physical hosts, operating system, application, data, identities — and ask who is responsible. If you can shift the line for IaaS vs PaaS vs SaaS, you will catch questions other people guess.",
  youWillLearn: [
    "Why \"the cloud is secure\" is the wrong sentence",
    "What Microsoft always owns vs what you always own",
    "How the split changes for IaaS, PaaS, and SaaS",
    "How to answer \"who patches the OS?\" style questions",
  ],
  officialModule: {
    ...LEARN.cloudComputing,
    units: ["Describe the shared responsibility model"],
  },
  blocks: [
    {
      type: "lead",
      emoji: "🏢",
      text: "Moving to Azure does not mean Microsoft becomes your CISO. Think of an apartment building. The landlord owns the structure, the locks on the front door, the electricity, and the cameras in the lobby. You still lock your own flat, decide who gets a key, and choose whether you leave your laptop on the kitchen table. Shared responsibility is that split, written for cloud.",
    },
    {
      type: "p",
      text: "Microsoft's model is simple once you stop treating \"security\" as one blob. Some duties never leave Microsoft. Some duties never leave you. A middle band — operating systems, network controls, applications — moves toward Microsoft as you go from IaaS to PaaS to SaaS.",
    },
    {
      type: "think",
      text: "Microsoft secures the cloud. You secure what you put in the cloud — especially data and access.",
    },
    {
      type: "heading",
      text: "The layers that never move",
    },
    {
      type: "p",
      text: "Start with the extremes. If you remember only two lists, remember these. They show up on the exam as \"always\" questions.",
    },
    {
      type: "compare",
      items: [
        {
          title: "Always Microsoft",
          subtitle: "The building",
          points: [
            "Physical datacenters (buildings, cages, cameras, guards)",
            "Physical network (cables, core routers, backbone)",
            "Physical hosts (the actual servers under the hypervisor)",
          ],
        },
        {
          title: "Always you (the customer)",
          subtitle: "Your flat",
          points: [
            "Information and data — classification, encryption choices, backups you configure",
            "Accounts and identities — who can sign in, MFA, guest users",
            "Devices and endpoints that your people use",
            "Access management — keys, roles, sharing links",
          ],
        },
      ],
    },
    {
      type: "diagram",
      title: "The stack, from dirt to data",
      ascii: `YOU always                  DATA, identities, access, devices
        ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
moves with IaaS/PaaS/SaaS   Application
                            Runtime / middleware
                            Operating system
                            Network controls
        ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
MICROSOFT always            Physical hosts
                            Physical network
                            Physical datacenter`,
    },
    {
      type: "trap",
      text: "\"Azure is responsible for security\" is too vague to be the answer. Ask: security of what? The building? Yes. Your blob of payroll files and the intern's password? That is still you.",
    },
    {
      type: "heading",
      text: "The line moves with the service type",
    },
    {
      type: "p",
      text: "IaaS, PaaS, and SaaS are taught in the next service-types lesson. For responsibility, you only need this: the more Microsoft provides as a finished service, the more Microsoft patches. You never get to dump data or identity onto them.",
    },
    {
      type: "table",
      caption: "Who typically manages each layer",
      headers: ["Layer", "IaaS (VM)", "PaaS (App Service / Azure SQL)", "SaaS (Microsoft 365)"],
      rows: [
        ["Physical datacenter, network, hosts", "Microsoft", "Microsoft", "Microsoft"],
        ["Operating system", "You", "Microsoft", "Microsoft"],
        ["Runtime / middleware", "You", "Microsoft", "Microsoft"],
        ["Application", "You", "You (your code) / Microsoft (platform)", "Microsoft"],
        ["Data", "You", "You", "You"],
        ["Identities and access", "You", "You", "You"],
      ],
    },
    { type: "interactive", diagram: "shared-responsibility" },
    {
      type: "example",
      title: "Contoso's three different \"servers\"",
      body: "Contoso lifts a Windows VM into Azure (IaaS): they still install patches, antivirus, and IIS. They move a web API to App Service (PaaS): Microsoft patches the OS and the web stack; Contoso still writes secure code and locks down who can call the API. They give staff Outlook on Microsoft 365 (SaaS): Microsoft runs Exchange; Contoso still decides who has a mailbox and whether mail can be forwarded to personal Gmail.",
    },
    {
      type: "think",
      text: "IaaS = you patch the OS. PaaS = Microsoft patches the OS. SaaS = Microsoft runs the app. You always own the data and the keys to the door.",
    },
    {
      type: "heading",
      text: "Physical datacenter vs data vs access vs OS vs application",
    },
    {
      type: "p",
      text: "Exam writers love to name one layer and wait. Walk the stack out loud. Physical datacenter: Microsoft, always — you cannot wander into an Azure region with a badge printer. Data: you, always — Microsoft will not decide your retention policy or whether that spreadsheet is confidential. Access: you — Entra ID roles, shared links, storage keys, SAS tokens. OS: you on a VM, Microsoft on App Service. Application: you if you wrote it, Microsoft if you are using theirs (Outlook, Teams, Dynamics).",
    },
    {
      type: "exam",
      title: "AZ-900 exam points",
      points: [
        "Customer always: data, endpoints, accounts, access",
        "Microsoft always: physical datacenter, physical network, physical hosts",
        "On IaaS you still manage the guest OS",
        "On PaaS Microsoft manages OS and runtime; you manage your app and data",
        "On SaaS Microsoft manages the app; you still manage data and identities",
      ],
    },
    {
      type: "steps",
      items: [
        {
          title: "If the question says \"physical datacenter\" or \"host hardware\"",
          text: "Microsoft. Every service type.",
        },
        {
          title: "If it says \"guest operating system\" on a virtual machine",
          text: "You. That is IaaS. You patch Windows or Linux.",
        },
        {
          title: "If it says \"App Service\" or \"Azure SQL\" and \"patch the OS\"",
          text: "Microsoft. That is PaaS.",
        },
        {
          title: "If it says \"who is responsible for the data in Microsoft 365?\"",
          text: "You. SaaS does not donate your data to Microsoft's responsibility list.",
        },
        {
          title: "If it says \"who configures MFA and guest access?\"",
          text: "You. Identities and access stay with the customer.",
        },
      ],
    },
    {
      type: "trap",
      text: "Do not confuse \"Microsoft offers encryption features\" with \"Microsoft is responsible for your data.\" The platform gives you tools (encryption at rest, Key Vault, sensitivity labels). You choose to use them, you classify the data, you grant access. Tools are not a transfer of ownership.",
    },
    {
      type: "diagram",
      title: "Apartment mapping (keep this in your head)",
      ascii: `Landlord (Microsoft)              Tenant (you)
--------------------              -------------
Building and cameras              What you store in the flat
Electricity and plumbing          Who gets a key (identities)
The hallway locks                 How you share files
The physical server room          Your app code (IaaS/PaaS)
Hypervisor / host OS              Guest OS on a VM (IaaS only)`,
    },
    {
      type: "cheatsheet",
      rows: [
        {
          term: "Shared responsibility",
          what: "Security duties split between Microsoft and you",
          remember: "Not \"Azure handles security\"",
        },
        {
          term: "Physical datacenter",
          what: "Buildings, power, guards, racks",
          remember: "Always Microsoft",
        },
        {
          term: "Data",
          what: "The information you store and process",
          remember: "Always the customer",
        },
        {
          term: "Access / identities",
          what: "Accounts, roles, keys, MFA",
          remember: "Always the customer",
        },
        {
          term: "OS on a VM",
          what: "Windows or Linux guest",
          remember: "Customer (IaaS)",
        },
        {
          term: "OS on App Service",
          what: "The platform's OS",
          remember: "Microsoft (PaaS)",
        },
        {
          term: "SaaS application",
          what: "Outlook, Teams, Dynamics",
          remember: "Microsoft runs the app; you still own data",
        },
      ],
    },
    {
      type: "onesentence",
      text: "Microsoft always owns the physical world under Azure, you always own your data and who can reach it, and the operating system and application slide toward Microsoft as you move from IaaS to PaaS to SaaS.",
    },
    {
      type: "scenario",
      title: "Exam-style scene",
      setup: "Adventure Works deploys a Linux virtual machine in Azure and later moves the same workload to Azure App Service. After the move, who is responsible for applying Linux security patches?",
      answer: "Microsoft, once it is App Service (PaaS). On the VM it was Adventure Works.",
      why: "The guest OS is a customer job on IaaS. App Service is PaaS, so Microsoft maintains the OS and runtime. Adventure Works still owns the app code, the data, and access control either way.",
    },
    {
      type: "scenario",
      title: "Another exam-style scene",
      setup: "A manager says, \"We use Microsoft 365, so Microsoft is responsible if an employee shares a confidential customer list with the wrong person.\" Is that right?",
      answer: "No. Sharing and access are customer responsibilities even on SaaS.",
      why: "Microsoft runs Exchange and SharePoint. The customer still decides sharing policies, guest access, and whether that list should have been there. Data and access never leave the customer column.",
    },
  ],
  quiz: [
    {
      id: "sr-1",
      prompt:
        "In the shared responsibility model, which of these is always Microsoft's responsibility?",
      options: [
        "Classifying which files are confidential",
        "Physical datacenter security",
        "Choosing who is a Global Administrator",
        "Deciding retention for HR records",
      ],
      answer: 1,
      explanation:
        "Physical datacenters, physical networks, and physical hosts are always Microsoft. Data classification, admin roles, and retention are always the customer.",
    },
    {
      id: "sr-2",
      prompt:
        "You run a Windows virtual machine in Azure (IaaS). Who is responsible for installing Windows security updates on that VM?",
      options: [
        "Microsoft, because the VM is in Azure",
        "You, the customer",
        "The hardware vendor who built the host",
        "Nobody — VMs patch themselves with no configuration",
      ],
      answer: 1,
      explanation:
        "IaaS means you get a VM and you manage the guest operating system, including patches. Microsoft maintains the physical host and hypervisor underneath.",
      trap: "\"It is in Azure, so Microsoft patches it\" is the #1 shared-responsibility trap. That sentence is true for PaaS/SaaS OS layers, not for your VM.",
    },
    {
      id: "sr-3",
      prompt:
        "A company hosts a web app on Azure App Service (PaaS). Who typically patches the operating system?",
      options: [
        "The customer, every Patch Tuesday",
        "Microsoft",
        "The customer's ISP",
        "Shared equally, so both must log into the VM",
      ],
      answer: 1,
      explanation:
        "App Service is PaaS. There is no guest OS for you to RDP into. Microsoft manages OS and runtime. You still manage your application code, configuration, and data.",
    },
    {
      id: "sr-4",
      prompt:
        "Which responsibility stays with the customer even when they use Microsoft 365 (SaaS)?",
      options: [
        "Keeping Exchange Online servers online",
        "Physical access to Microsoft's datacenters",
        "Their data and who is allowed to access it",
        "Patching the Outlook service's operating system",
      ],
      answer: 2,
      explanation:
        "SaaS shifts the application and OS to Microsoft. Data, accounts, and access management remain with the customer.",
    },
    {
      id: "sr-5",
      prompt:
        "Fabrikam stores customer photos in Azure Blob Storage. Microsoft encrypts storage at rest. Who is still responsible for not granting public anonymous access to that container?",
      options: [
        "Microsoft, because encryption is on",
        "Fabrikam, because access control is a customer duty",
        "The end customers who uploaded the photos",
        "Azure Policy, automatically, with no configuration",
      ],
      answer: 1,
      explanation:
        "Platform encryption does not decide your sharing. Access — public containers, SAS tokens, RBAC — is on the customer. Encryption at rest is a tool, not a transfer of responsibility.",
    },
    {
      id: "sr-6",
      prompt:
        "As you move from IaaS to PaaS to SaaS, what happens to the shared responsibility line?",
      options: [
        "Microsoft takes on more of the stack; you still own data and access",
        "You take on more of the physical datacenter",
        "All responsibility moves to Microsoft, including your data",
        "The model only applies to public cloud, not Azure",
      ],
      answer: 0,
      explanation:
        "Each step up the as-a-service ladder, Microsoft manages more (OS, then application). Data, identities, and access remain yours in every model.",
    },
    {
      id: "sr-7",
      prompt:
        "Which responsibilities are ALWAYS the customer's, no matter which service type they use?",
      options: [
        "Physical hosts, network, and datacenter",
        "Information and data, devices (mobile and PCs), and accounts and identities",
        "The hypervisor and the host operating system",
        "Power, cooling, and building security",
      ],
      answer: 1,
      explanation:
        "Data, endpoints (devices), and accounts/identities stay with the customer in IaaS, PaaS, and SaaS. The physical layer always stays with Microsoft.",
    },
    {
      id: "sr-8",
      prompt:
        "A company moves from running SQL Server on an Azure VM to Azure SQL Database. Which responsibility moves from the customer to Microsoft?",
      options: [
        "Deciding who can query the data",
        "Patching the database engine and the operating system underneath",
        "Classifying sensitive columns",
        "Choosing strong passwords for admin accounts",
      ],
      answer: 1,
      explanation:
        "Going from IaaS to PaaS hands OS and engine patching to Microsoft. Access, classification, and credentials stay with the customer.",
    },
    {
      id: "sr-9",
      prompt:
        "In an on-premises datacenter, who is responsible for physical security of the servers?",
      options: [
        "Microsoft",
        "The customer",
        "Shared equally by law",
        "The internet provider",
      ],
      answer: 1,
      explanation:
        "On-premises, the customer owns everything, including the building and the locks. The shared responsibility model only shifts duties once you use a cloud provider.",
    },
    {
      id: "sr-10",
      prompt:
        "A user's Microsoft 365 password is phished and an attacker reads their mailbox. Under the shared responsibility model, whose area was breached?",
      options: [
        "Microsoft's — SaaS means Microsoft owns everything",
        "The customer's — accounts and identities are always customer responsibility",
        "Nobody's — SaaS has no responsibilities",
        "The datacenter's physical security team",
      ],
      answer: 1,
      explanation:
        "Accounts and identities stay with the customer even in SaaS. Turning on MFA and training users is on the customer.",
      trap: "SaaS moves the most work to Microsoft, but never your accounts or your data.",
    },
  ],
};
