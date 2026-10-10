import type { QuizQuestion } from "./types";

export const practiceExam: QuizQuestion[] = [
  // Domain 1 — Cloud concepts (~28%)
  {
    id: "pe-1",
    prompt:
      "A company wants to avoid buying servers and pay only for the compute and storage it uses each month. Which pricing approach is this?",
    options: [
      "Consumption-based operating expenditure (OpEx)",
      "Capital expenditure (CapEx)",
      "A one-time software license",
      "A dedicated on-premises lease",
    ],
    answer: 0,
    explanation:
      "Azure's pay-as-you-go model is OpEx: you are billed for what you consume. CapEx is buying hardware up front.",
    trap: "Reserved instances still start from a cloud OpEx model; they are not CapEx just because you commit.",
  },
  {
    id: "pe-2",
    prompt:
      "You deploy Azure Virtual Machines. Who is responsible for applying security patches to the guest operating system?",
    options: [
      "The customer",
      "Microsoft, because the VMs run in Azure datacenters",
      "The internet service provider",
      "Azure Advisor, automatically",
    ],
    answer: 0,
    explanation:
      "VMs are IaaS. Microsoft secures the physical host and hypervisor; you own the guest OS, patches, and the apps on the VM.",
    trap: "Do not assume 'it's in Azure so Microsoft patches everything.' That is closer to PaaS or SaaS.",
  },
  {
    id: "pe-3",
    prompt:
      "A company must keep a regulated database in its own datacenter but wants to run a public website in Azure. Which cloud model should you recommend?",
    options: ["Public cloud only", "Private cloud only", "Hybrid cloud", "Sovereign cloud only"],
    answer: 2,
    explanation:
      "Hybrid combines on-premises (or private) with public Azure so each workload can live where it must.",
    trap: "Sovereign regions solve government isolation in Azure, not 'some servers stay in our building.'",
  },
  {
    id: "pe-4",
    prompt:
      "An API runs for a few seconds when a message arrives, then does nothing for hours. You want to pay only when the code runs and you do not want to manage servers. Which compute option is BEST?",
    options: [
      "Azure Functions",
      "An always-on Azure Virtual Machine",
      "Azure Virtual Desktop",
      "A reserved App Service plan sized for peak",
    ],
    answer: 0,
    explanation:
      "Azure Functions is serverless compute: event-driven, no servers for you to manage, typically billed per execution.",
    trap: "App Service can host HTTP APIs, but it is not the best 'pay only when it runs' serverless answer.",
  },
  {
    id: "pe-5",
    prompt:
      "Traffic to a web app spikes every weekday morning. You need more instances added automatically, then removed at night. Which cloud benefit is this?",
    options: [
      "Vertical scaling only",
      "CapEx predictability",
      "Elasticity",
      "A private cloud",
    ],
    answer: 2,
    explanation:
      "Elasticity is automatic scale-out and scale-in as demand changes. Scalability is the ability to grow; elasticity is doing it dynamically.",
    trap: "Vertical scaling (bigger VM) is a different lever and often needs a resize/restart.",
  },
  {
    id: "pe-6",
    prompt:
      "You need to run a third-party application that requires installing custom Windows services and full control of the OS. Which cloud service type should you use?",
    options: ["SaaS", "PaaS", "IaaS", "Serverless functions only"],
    answer: 2,
    explanation:
      "IaaS (Azure VMs) gives you the OS. PaaS hides the OS. SaaS is a finished app you only configure.",
    trap: "App Service is PaaS — great for web apps, not for arbitrary OS-level services.",
  },
  {
    id: "pe-7",
    prompt:
      "A development team wants to deploy a web app and a REST API without managing IIS, the guest OS, or load-balancer VMs. Which service type is BEST?",
    options: [
      "PaaS (for example, Azure App Service)",
      "IaaS virtual machines",
      "SaaS Microsoft 365",
      "A private cloud hypervisor",
    ],
    answer: 0,
    explanation:
      "App Service is PaaS: you bring the code; Azure runs the platform. Microsoft 365 is SaaS productivity, not your custom API host.",
    trap: "IaaS still works, but the question asks for the BEST fit — no OS management points to PaaS.",
  },
  {
    id: "pe-8",
    prompt:
      "Which statement BEST describes high availability in Azure?",
    options: [
      "Moving every resource to a cheaper region",
      "Paying a year in advance for reserved instances",
      "Designing so the app keeps running if a component or datacenter fails",
      "Using Azure Arc to manage on-premises servers",
    ],
    answer: 2,
    explanation:
      "HA is about staying up through failures (multiple instances, zones, SLAs). Reservations save money; Arc extends management.",
    trap: "Disaster recovery across a region pair is related but is geo-recovery, not the definition of HA.",
  },
  {
    id: "pe-9",
    prompt:
      "You resize a single virtual machine from 4 vCPUs to 16 vCPUs to handle more load. What kind of scaling is this?",
    options: [
      "Horizontal scaling (scale out)",
      "Vertical scaling (scale up)",
      "A new availability zone",
      "Elasticity across regions",
    ],
    answer: 1,
    explanation:
      "Vertical scaling changes the size of one resource. Horizontal scaling adds more instances.",
    trap: "Scale sets and extra VMs behind a load balancer are horizontal, not a bigger SKU.",
  },
  {
    id: "pe-10",
    prompt:
      "Your finance team wants email, calendars, and document collaboration with no servers to patch. Which service type is this?",
    options: [
      "IaaS",
      "PaaS",
      "SaaS",
      "A region pair",
    ],
    answer: 2,
    explanation:
      "Microsoft 365 is SaaS: a complete application delivered over the internet. You are a tenant of the app, not the operator of Exchange VMs.",
    trap: "Hosting Exchange on Azure VMs would be IaaS — more control, much more work.",
  },
  {
    id: "pe-11",
    prompt:
      "Which statement about the shared responsibility model is correct?",
    options: [
      "In SaaS, Microsoft is responsible for your user access reviews and data classification",
      "In IaaS, Microsoft is responsible for the physical datacenter; you are responsible for the guest OS",
      "In PaaS, you must patch the hypervisor",
      "The customer is never responsible for identity",
    ],
    answer: 1,
    explanation:
      "Physical infrastructure is always Microsoft's. On IaaS you still patch the VM OS. Identities and data stay with you in every model.",
    trap: "SaaS does not mean Microsoft manages your users' access or how you classify data.",
  },

  // Domain 2 — Azure architecture and services (~38%)
  {
    id: "pe-12",
    prompt:
      "You need to protect a set of VMs from a complete datacenter outage inside one Azure region. What should you use?",
    options: [
      "Availability zones",
      "An availability set in a single rack",
      "A resource lock",
      "Azure Cloud Shell",
    ],
    answer: 0,
    explanation:
      "Availability zones are separate datacenters in a region with independent power, cooling, and networking.",
    trap: "Availability sets spread VMs across fault/update domains in one datacenter — they do not survive that datacenter failing.",
  },
  {
    id: "pe-13",
    prompt:
      "You need geo-disaster recovery so storage can fail over to another region hundreds of miles away. Which Azure concept is designed for that pairing?",
    options: [
      "Availability zones",
      "Resource groups",
      "Region pairs",
      "Management groups",
    ],
    answer: 2,
    explanation:
      "Most regions are paired with another region in the same geography for geo-replication and DR. Zones are inside one region.",
    trap: "Availability zones are not a second region.",
  },
  {
    id: "pe-14",
    prompt:
      "A global company has 20 Azure subscriptions. You need to apply the same Azure Policy and RBAC to all of them from one place. What should you use?",
    options: [
      "Management groups",
      "A single resource group",
      "Azure DNS",
      "An availability set",
    ],
    answer: 0,
    explanation:
      "Management groups sit above subscriptions. Policy and RBAC assigned there inherit downward.",
    trap: "A resource group only contains resources in one subscription.",
  },
  {
    id: "pe-15",
    prompt:
      "You delete a resource group in the Azure portal. What happens to the resources inside it?",
    options: [
      "They move to the subscription root and keep running",
      "They are locked automatically",
      "They fail over to the region pair",
      "They are deleted with the resource group",
    ],
    answer: 3,
    explanation:
      "A resource group is a lifecycle container. Deleting it deletes the resources it contains.",
    trap: "Locks can block the delete — but only if you created a lock. There is no automatic failover.",
  },
  {
    id: "pe-16",
    prompt:
      "A company needs identical VMs that automatically increase from 3 to 15 instances during a sale, then decrease afterward. Which compute option is BEST?",
    options: [
      "A single large VM (vertical scale)",
      "Azure Virtual Desktop",
      "Virtual Machine Scale Sets",
      "Azure Arc",
    ],
    answer: 2,
    explanation:
      "VM Scale Sets are built for horizontal autoscale of identical VMs, typically behind a load balancer.",
    trap: "AVD is desktop virtualization. Arc manages resources outside Azure.",
  },
  {
    id: "pe-17",
    prompt:
      "Users need a Windows desktop from any device, with the control plane hosted in Azure. Which service should you recommend?",
    options: [
      "Azure Functions",
      "Azure Virtual Desktop",
      "AzCopy",
      "Azure DNS",
    ],
    answer: 1,
    explanation:
      "Azure Virtual Desktop provides desktop and RemoteApp virtualization. Session hosts are VMs; Azure runs the broker and gateway.",
    trap: "Functions is serverless code, not a desktop.",
  },
  {
    id: "pe-18",
    prompt:
      "You need a private connection from your on-premises network to Azure that does NOT travel over the public internet. What should you use?",
    options: [
      "Azure VPN Gateway",
      "ExpressRoute",
      "Azure DNS",
      "A public IP on a VM",
    ],
    answer: 1,
    explanation:
      "ExpressRoute is a private circuit through a connectivity provider. Traffic does not go over the public internet.",
    trap: "VPN Gateway encrypts traffic but still uses the public internet. That is the classic mix-up.",
  },
  {
    id: "pe-19",
    prompt:
      "A company wants encrypted connectivity between its office and an Azure VNet. Setup time matters more than a private circuit, and using the internet is acceptable. Which service is BEST?",
    options: [
      "ExpressRoute",
      "VNet peering to the internet",
      "Azure Data Box",
      "Azure VPN Gateway",
    ],
    answer: 3,
    explanation:
      "VPN Gateway creates an IPsec tunnel over the internet. ExpressRoute is private and usually slower to procure.",
    trap: "Peering connects VNets; it does not replace a site-to-site VPN to on-premises.",
  },
  {
    id: "pe-20",
    prompt:
      "You want an Azure Storage account reachable only from a private IP inside your VNet, with no public endpoint required. What should you configure?",
    options: [
      "A public endpoint with a new NSG",
      "A private endpoint",
      "Azure Front Door",
      "ExpressRoute FastPath only",
    ],
    answer: 1,
    explanation:
      "A private endpoint puts a NIC with a private IP in your VNet in front of the PaaS service (Private Link).",
    trap: "NSGs filter traffic to public or private IPs; they do not by themselves give Storage a VNet IP.",
  },
  {
    id: "pe-21",
    prompt:
      "You will store images that are read many times per day. Cost of access should stay low. Which blob access tier is BEST?",
    options: ["Archive", "Cool", "Cold", "Hot"],
    answer: 3,
    explanation:
      "Hot is for frequent access: higher storage price, lowest access cost. Archive is cheapest to store but slow and expensive to read.",
    trap: "Cool/Cold/Archive look cheaper until you start reading the data often.",
  },
  {
    id: "pe-22",
    prompt:
      "A storage account must survive a full regional disaster by keeping a copy in the paired region. Which redundancy option meets that requirement?",
    options: [
      "LRS",
      "ZRS",
      "GRS or GZRS",
      "A single availability zone",
    ],
    answer: 2,
    explanation:
      "GRS and GZRS replicate to the secondary (paired) region. LRS is one datacenter. ZRS is zones in one region only.",
    trap: "ZRS is highly available in a region, not a geo-DR copy.",
  },
  {
    id: "pe-23",
    prompt:
      "Branch offices should keep a fast local file share on Windows Server while Azure Files remains the cloud copy of truth. Which service should you use?",
    options: [
      "AzCopy on a schedule",
      "Azure File Sync",
      "Azure Migrate",
      "Azure Data Box",
    ],
    answer: 1,
    explanation:
      "Azure File Sync caches an Azure file share on Windows Server for hybrid access. AzCopy is a one-way copy tool, not a live cache.",
    trap: "Data Box is offline bulk import. Migrate is for moving servers/apps into Azure.",
  },
  {
    id: "pe-24",
    prompt:
      "You need to ship 80 TB of file data to Azure because the WAN would take weeks. Which option is BEST?",
    options: [
      "Azure Data Box",
      "VNet peering",
      "Azure Advisor",
      "A point-to-site VPN",
    ],
    answer: 0,
    explanation:
      "Data Box is a Microsoft-shipped appliance for offline bulk transfer when the network is too slow.",
    trap: "AzCopy still uses the network. Peering and VPN do not add physical shipping capacity.",
  },
  {
    id: "pe-25",
    prompt:
      "You want partners from other organizations to sign in to your apps as guests without creating full member accounts in your directory. What should you use?",
    options: [
      "Azure RBAC only",
      "Availability zones",
      "Azure Policy",
      "Microsoft Entra external identities (B2B guests)",
    ],
    answer: 3,
    explanation:
      "Entra ID external identities / B2B collaboration invites guest users who authenticate with their own org while you control access.",
    trap: "RBAC assigns Azure resource permissions; it does not create the guest identity.",
  },
  {
    id: "pe-26",
    prompt:
      "Sign-ins from unfamiliar locations should require MFA; sign-ins from compliant devices in the office should not. Which feature implements this if-then rule?",
    options: [
      "Azure Policy",
      "Resource locks",
      "Microsoft Entra Conditional Access",
      "Azure Service Health",
    ],
    answer: 2,
    explanation:
      "Conditional Access is identity if-then policy (user, location, device, app → MFA, block, compliant device).",
    trap: "Azure Policy governs resource configuration (SKUs, locations, tags), not interactive sign-in.",
  },

  // Domain 3 — Management and governance (~34%)
  {
    id: "pe-27",
    prompt:
      "A junior admin must be able to restart VMs but must not create or delete them. Which feature should you use?",
    options: [
      "Azure Policy",
      "Azure RBAC",
      "Microsoft Purview",
      "A ReadOnly resource lock only",
    ],
    answer: 1,
    explanation:
      "RBAC grants a role (for example, Virtual Machine Contributor vs a custom role) to a person at a scope. That is 'who can do what.'",
    trap: "Policy does not grant permissions. A ReadOnly lock would block the restart too.",
  },
  {
    id: "pe-28",
    prompt:
      "You need to prevent anyone — including subscription Owners — from accidentally deleting a production resource group. What should you apply?",
    options: [
      "An Azure Policy initiative that audits tags",
      "Microsoft Entra Conditional Access",
      "Azure Advisor cost recommendations",
      "A CanNotDelete resource lock",
    ],
    answer: 3,
    explanation:
      "CanNotDelete locks block delete until the lock is removed, even for Owners. Policy can deny new noncompliant resources; it is not the 'nobody can delete this' switch.",
    trap: "RBAC cannot stop an Owner. You lock the resource, then still use RBAC for day-to-day access.",
  },
  {
    id: "pe-29",
    prompt:
      "Resources must be created only in East US and West Europe. Noncompliant deployments should be blocked. Which service should you use?",
    options: [
      "Azure Policy",
      "Azure RBAC Owner role",
      "Azure Monitor alerts",
      "AzCopy",
    ],
    answer: 0,
    explanation:
      "Azure Policy can deny disallowed locations. That is resource-compliance, not an identity role.",
    trap: "Making everyone an Owner does not restrict regions. RBAC is too coarse for 'only these SKUs/locations.'",
  },
  {
    id: "pe-30",
    prompt:
      "Finance wants each Azure resource labeled so monthly bills can be split by department. What should you use?",
    options: [
      "Availability zones",
      "ExpressRoute circuits",
      "Resource tags",
      "Azure Functions",
    ],
    answer: 2,
    explanation:
      "Tags are name/value metadata used in Cost Management reports. They do not change how the resource runs.",
    trap: "Resource groups help with lifecycle, but tags are the standard cost-allocation label.",
  },
  {
    id: "pe-31",
    prompt:
      "Before deploying anything, a team wants a monthly cost estimate for VMs, storage, and bandwidth in two regions. Which tool should they use?",
    options: [
      "Azure Service Health",
      "The Azure pricing calculator",
      "Azure Advisor after a week of production",
      "Microsoft Defender for Cloud",
    ],
    answer: 1,
    explanation:
      "The pricing calculator estimates cost before you deploy. Cost Management and Advisor look at real (or existing) environments.",
    trap: "Advisor can later recommend cost savings, but it is not the pre-purchase estimate tool.",
  },
  {
    id: "pe-32",
    prompt:
      "You need to catalog sensitive data across Azure storage and classify it for compliance reporting. Which service is designed for that?",
    options: [
      "Azure VPN Gateway",
      "Virtual Machine Scale Sets",
      "Azure Cloud Shell",
      "Microsoft Purview",
    ],
    answer: 3,
    explanation:
      "Microsoft Purview is data governance: catalog, classification, and compliance over the data estate.",
    trap: "Azure Policy governs resource settings (encryption on, allowed SKUs), not a data catalog.",
  },
  {
    id: "pe-33",
    prompt:
      "You are on a laptop with no Azure tools installed. You need to run az group list from a browser. What should you use?",
    options: [
      "Azure Arc",
      "An ARM template",
      "Azure Cloud Shell",
      "Azure Advisor",
    ],
    answer: 2,
    explanation:
      "Cloud Shell is a terminal in the portal with Azure CLI and PowerShell already available.",
    trap: "Arc is not a shell. ARM templates describe infrastructure; they are not a command prompt.",
  },
  {
    id: "pe-34",
    prompt:
      "You have Windows servers in your datacenter and on another cloud. You want to inventory them in Azure, apply Azure Policy, and use Defender for Cloud — without moving the servers into Azure. Which service should you use?",
    options: [
      "Azure Migrate",
      "Azure Data Box",
      "ExpressRoute",
      "Azure Arc",
    ],
    answer: 3,
    explanation:
      "Azure Arc extends Azure management to resources that stay outside Azure. Migrate and Data Box are about moving data or workloads in.",
    trap: "Arc ≠ migrate. If the question says 'manage where they are,' pick Arc.",
  },
  {
    id: "pe-35",
    prompt:
      "A team wants repeatable deployments described as code. They find ARM JSON templates hard to read. Which language compiles to ARM and deploys through Azure Resource Manager?",
    options: [
      "Azure Cloud Shell",
      "Bicep",
      "Kusto Query Language (KQL)",
      "Azure Service Health",
    ],
    answer: 1,
    explanation:
      "Bicep is cleaner IaC that compiles to ARM JSON and is deployed via ARM. Cloud Shell is only a terminal. KQL queries logs.",
    trap: "ARM the platform is the management layer for every deployment — Bicep still uses it.",
  },
  {
    id: "pe-36",
    prompt:
      "What is Azure Resource Manager (ARM)?",
    options: [
      "A JSON file you store in Git",
      "A tool that migrates VMs from VMware",
      "A browser-based terminal",
      "The management layer that processes create, update, and delete requests for Azure resources",
    ],
    answer: 3,
    explanation:
      "ARM is Azure's control plane. Portal, CLI, PowerShell, REST, ARM templates, and Bicep all go through it.",
    trap: "An ARM template is a file. ARM itself is the platform that applies that file.",
  },
  {
    id: "pe-37",
    prompt:
      "You want personalized recommendations to reduce spend, improve security, and raise reliability of resources you already run. Which service should you open?",
    options: [
      "Azure Advisor",
      "Azure Service Health",
      "The pricing calculator",
      "Azure DNS",
    ],
    answer: 0,
    explanation:
      "Advisor produces recommendations (cost, security, reliability, operational excellence, performance) for your environment.",
    trap: "Service Health tells you about Azure incidents and maintenance, not 'resize this VM.'",
  },
  {
    id: "pe-38",
    prompt:
      "East US has a platform outage that might affect your VMs. You need a personalized view of incidents, planned maintenance, and health advisories for your subscriptions. Which service is BEST?",
    options: [
      "Azure Advisor",
      "Microsoft Entra ID",
      "AzCopy",
      "Azure Service Health",
    ],
    answer: 3,
    explanation:
      "Service Health is the personalized incident and maintenance dashboard for your Azure resources and regions.",
    trap: "Azure Status is the public global page. Monitor collects metrics/logs. Advisor recommends improvements.",
  },
  {
    id: "pe-39",
    prompt:
      "A web app is slow and throwing exceptions in production. You need request rates, failed dependencies, and exception traces from the application itself. Which tool should you use?",
    options: [
      "Azure Service Health",
      "Azure Monitor Application Insights",
      "A resource lock",
      "ExpressRoute",
    ],
    answer: 1,
    explanation:
      "Application Insights is APM under Azure Monitor: live app telemetry (requests, failures, dependencies).",
    trap: "Service Health answers 'is Azure down?' not 'why is my code throwing.'",
  },
  {
    id: "pe-40",
    prompt:
      "You collect diagnostic logs from many Azure resources into one place and want to query them with Kusto Query Language (KQL). Where do those queries run?",
    options: [
      "A Log Analytics workspace",
      "Azure VPN Gateway",
      "Microsoft Entra Domain Services",
      "The pricing calculator",
    ],
    answer: 0,
    explanation:
      "Log Analytics workspaces store Azure Monitor logs. You query them with KQL. Alerts can sit on top of those queries.",
    trap: "Application Insights can send data into a workspace, but the log query store is Log Analytics.",
  },
  {
    id: "pe-41",
    prompt:
      "A web team stores an API key in plain text inside appsettings.json. Security wants the key stored centrally, access-controlled, and audited. What should they use?",
    options: [
      "Azure Key Vault",
      "A resource tag named ApiKey",
      "Azure Advisor",
      "Microsoft Purview",
    ],
    answer: 0,
    explanation:
      "Key Vault stores secrets, keys, and certificates, with access through Entra ID/RBAC and logging of every use.",
    trap: "Tags are visible metadata — never a place for secrets.",
  },
  {
    id: "pe-42",
    prompt:
      "Your web subnet should accept only TCP 443 from the internet. Which Azure feature is the simplest way to enforce that rule?",
    options: [
      "A network security group",
      "Azure DDoS Protection",
      "VNet peering",
      "Azure DNS",
    ],
    answer: 0,
    explanation:
      "NSGs are allow/deny rules by port, protocol, and address on a subnet or NIC.",
    trap: "DDoS Protection mitigates floods; it does not decide which ports are open.",
  },
  {
    id: "pe-43",
    prompt:
      "A compliance officer must give an external auditor Microsoft's ISO 27001 certificate and SOC 2 report for Azure. Where are these published?",
    options: [
      "The Service Trust Portal",
      "Azure Service Health",
      "The Azure Pricing Calculator",
      "Azure Resource Manager",
    ],
    answer: 0,
    explanation:
      "The Service Trust Portal is Microsoft's library of audit reports, compliance guides, and trust documents.",
    trap: "Azure Policy checks YOUR resources against rules; it does not publish Microsoft's audit reports.",
  },
  {
    id: "pe-44",
    prompt:
      "A company will spend about the same on compute every hour for three years, but expects to move workloads between VM families and regions. Which discount option fits BEST?",
    options: [
      "An Azure savings plan for compute",
      "A reservation for one VM size in one region",
      "Spot VMs",
      "Pay-as-you-go",
    ],
    answer: 0,
    explanation:
      "Savings plans commit to an hourly spend and apply across compute sizes and regions. Reservations are tied to a specific resource and region.",
    trap: "Reservations usually give a slightly deeper discount, but they lose value when the workload changes shape.",
  },
  {
    id: "pe-45",
    prompt:
      "Which statement BEST describes how moving to the cloud can support a company's sustainability goals?",
    options: [
      "Highly utilized shared datacenters can run the same workload with less energy and less idle hardware",
      "Cloud workloads use no electricity",
      "Moving to Azure makes the company carbon-neutral automatically",
      "Sustainability is only possible with a private cloud",
    ],
    answer: 0,
    explanation:
      "Efficient, shared, large-scale datacenters and renewable energy reduce the footprint per workload. Customers still help by right-sizing and turning off idle resources.",
  },
];
