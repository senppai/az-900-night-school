import type { DomainId } from "./types";

export type QuickLine = { term: string; line: string };

export const QUICK_SHEET: Record<DomainId, { group: string; lines: QuickLine[] }[]> = {
  cloud: [
    {
      group: "Cloud computing",
      lines: [
        { term: "Cloud computing", line: "Renting compute, storage, networking over the internet, pay for use" },
        { term: "CapEx vs OpEx", line: "Buy up front (depreciates) vs pay as you go (cloud)" },
        { term: "Consumption-based", line: "No up-front cost; pay only for what you use; stop paying when you stop" },
        { term: "Pay-as-you-go / Reserved / Spot", line: "No commitment / 1–3 yr discount / cheapest but evictable" },
        { term: "Serverless", line: "No servers to manage; event-driven; billed per execution" },
      ],
    },
    {
      group: "Shared responsibility",
      lines: [
        { term: "Always Microsoft", line: "Physical datacenter, network, hosts" },
        { term: "Always customer", line: "Data, devices, accounts and identities" },
        { term: "Moves with the model", line: "OS, network controls, apps: IaaS customer → PaaS shared → SaaS Microsoft" },
      ],
    },
    {
      group: "Cloud models",
      lines: [
        { term: "Public", line: "Provider's shared hardware; no CapEx; fast scale" },
        { term: "Private", line: "One organization only; most control; you pay for hardware" },
        { term: "Hybrid", line: "On-premises + public cloud working together (Azure Arc manages both)" },
        { term: "Multi-cloud", line: "More than one public cloud provider" },
      ],
    },
    {
      group: "Benefits",
      lines: [
        { term: "High availability", line: "Stay up when parts fail (zones, SLAs)" },
        { term: "Scale up / scale out", line: "Bigger instance (vertical) / more instances (horizontal)" },
        { term: "Elasticity", line: "Automatic scale out and in with demand" },
        { term: "Reliability", line: "Recover from failures and keep working" },
        { term: "Predictability", line: "Performance (steady speed) and cost (forecastable bill)" },
        { term: "Security & governance", line: "Platform security + policies applied everywhere" },
        { term: "Manageability", line: "Manage via portal, CLI, APIs, automation from anywhere" },
        { term: "Sustainability", line: "Efficient shared datacenters, renewable energy, less idle hardware" },
      ],
    },
    {
      group: "Service types",
      lines: [
        { term: "IaaS", line: "VMs; most control; you manage OS and up; lift-and-shift" },
        { term: "PaaS", line: "App Service, SQL Database; you manage code and data" },
        { term: "SaaS", line: "Microsoft 365, Dynamics 365; you manage data, users, devices" },
      ],
    },
  ],
  architecture: [
    {
      group: "Core architecture",
      lines: [
        { term: "Region", line: "Datacenters in a geography with low-latency network" },
        { term: "Availability zone", line: "Separate datacenter(s) in a region; min 3 in zone regions" },
        { term: "Region pair", line: "Two regions for DR; staggered updates; prioritized recovery" },
        { term: "Sovereign region", line: "Isolated Azure: Azure Government (US), 21Vianet (China)" },
        { term: "Hierarchy", line: "Management groups → subscriptions → resource groups → resources" },
        { term: "Subscription", line: "Billing and access boundary" },
        { term: "Resource group", line: "Logical container, shared lifecycle; no nesting; one RG per resource" },
        { term: "Management group", line: "Organizes subscriptions; policy/RBAC inherit; 6 levels deep" },
      ],
    },
    {
      group: "Compute",
      lines: [
        { term: "Virtual machine", line: "IaaS; needs size, OS disk, NIC on a VNet/subnet" },
        { term: "VM Scale Sets", line: "Identical VMs that autoscale" },
        { term: "Availability set", line: "Fault + update domains in one datacenter" },
        { term: "Azure Virtual Desktop", line: "Windows desktops and apps from the cloud" },
        { term: "ACI / AKS / Container Apps", line: "Simple container / orchestrated Kubernetes / serverless containers" },
        { term: "Azure Functions", line: "Serverless, event-driven code" },
        { term: "App Service", line: "PaaS for web apps and APIs" },
        { term: "AI services / Machine Learning", line: "Prebuilt AI APIs / train your own models" },
        { term: "IoT Hub / IoT Edge", line: "Manage devices in cloud / run workloads on devices" },
      ],
    },
    {
      group: "Networking",
      lines: [
        { term: "VNet / subnet", line: "Private network in one region / address range inside it" },
        { term: "VNet peering", line: "Connect VNets over the Microsoft backbone (also across regions)" },
        { term: "VPN Gateway", line: "Encrypted over the internet (site-to-site, point-to-site)" },
        { term: "ExpressRoute", line: "Private connection, not over the internet" },
        { term: "Azure DNS", line: "Host DNS zones on Azure infrastructure" },
        { term: "Private vs public endpoint", line: "PaaS on a VNet private IP vs reachable from internet" },
        { term: "NSG / Firewall / DDoS", line: "Port rules / managed central firewall / flood protection" },
      ],
    },
    {
      group: "Storage",
      lines: [
        { term: "Blob / Files / Queue / Table / Disk", line: "Objects / SMB-NFS shares / messages / NoSQL / VM disks" },
        { term: "Hot / Cool / Cold / Archive", line: "Frequent → rare; Archive is offline (hours to rehydrate)" },
        { term: "LRS / ZRS", line: "3 copies in one datacenter / across zones" },
        { term: "GRS / GZRS", line: "LRS or ZRS + copy to secondary region; RA- = read secondary" },
        { term: "Storage account", line: "Globally unique name; Standard GPv2 is the default" },
        { term: "AzCopy / Storage Explorer", line: "Command-line copy / graphical browser" },
        { term: "Azure File Sync", line: "Windows Server ↔ Azure Files, with cloud tiering" },
        { term: "Azure Migrate / Data Box", line: "Assess and migrate workloads / ship data offline" },
      ],
    },
    {
      group: "Identity and security",
      lines: [
        { term: "Microsoft Entra ID", line: "Cloud identity (formerly Azure AD): sign-in, SSO, MFA" },
        { term: "Entra Domain Services", line: "Managed domain join, LDAP, Kerberos — no DCs to run" },
        { term: "SSO / MFA / Passwordless", line: "One sign-in / 2+ factors / Hello, Authenticator, FIDO2" },
        { term: "External identities", line: "B2B guests with own credentials; customer sign-up" },
        { term: "Conditional Access", line: "If signal (location, device, risk) then MFA / block" },
        { term: "Azure RBAC", line: "Who can do what at which scope; least privilege" },
        { term: "Owner / Contributor / Reader", line: "All + grant access / manage, no access grant / view only" },
        { term: "Zero Trust", line: "Verify explicitly, least privilege, assume breach" },
        { term: "Defense-in-depth", line: "Layers: physical → identity → perimeter → network → compute → app → data" },
        { term: "Key Vault / encryption", line: "Store secrets, keys, certs / at rest (disk) vs in transit (TLS)" },
        { term: "Defender for Cloud", line: "Secure Score, recommendations, workload protection, multicloud" },
      ],
    },
  ],
  governance: [
    {
      group: "Cost management",
      lines: [
        { term: "Cost factors", line: "Resource type/size, region, usage, egress, purchase model" },
        { term: "Pricing Calculator", line: "Estimate before you deploy" },
        { term: "Cost Management", line: "Real spend, cost analysis, budgets, alerts" },
        { term: "Tags", line: "Name/value labels for cost and organization — not locks, not inherited" },
        { term: "Reservations / savings plan", line: "Commit to resource / commit to hourly compute spend" },
        { term: "Spot / Hybrid Benefit", line: "Evictable spare capacity / reuse your licenses" },
      ],
    },
    {
      group: "Governance and compliance",
      lines: [
        { term: "Microsoft Purview", line: "Discover, classify, catalog, govern data" },
        { term: "Azure Policy", line: "Allowed configurations; Deny or Audit; initiatives group policies" },
        { term: "Resource locks", line: "CanNotDelete or ReadOnly; inherit; apply to Owners too" },
        { term: "Service Trust Portal", line: "Microsoft's audit reports (ISO, SOC) and compliance docs" },
      ],
    },
    {
      group: "Managing and deploying",
      lines: [
        { term: "Azure portal", line: "Web GUI for everything" },
        { term: "Cloud Shell", line: "Browser shell: Bash or PowerShell with tools preinstalled" },
        { term: "Azure CLI / PowerShell", line: "az commands / Verb-Az cmdlets; same capabilities" },
        { term: "Azure Arc", line: "Manage on-premises and multicloud resources from Azure" },
        { term: "Azure Resource Manager", line: "The management layer every tool goes through" },
        { term: "ARM templates / Bicep", line: "Declarative JSON IaC / simpler language, same ARM deployment" },
      ],
    },
    {
      group: "Monitoring",
      lines: [
        { term: "Azure Advisor", line: "Recommendations: reliability, security, performance, op. excellence, cost" },
        { term: "Status / Service Health / Resource Health", line: "Global public / your subscriptions / one resource" },
        { term: "Azure Monitor", line: "Collects metrics and logs from Azure, on-prem, other clouds" },
        { term: "Log Analytics", line: "Workspace to query logs with KQL" },
        { term: "Alerts", line: "Notify or act when a metric or log condition is met" },
        { term: "Application Insights", line: "APM for live apps: requests, failures, dependencies" },
      ],
    },
  ],
};
