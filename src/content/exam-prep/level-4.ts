import { tag } from "./tag";

export const level4 = tag("l4", [
  {
    lesson: "cloud-computing",
    prompt:
      "A research lab runs genome analysis jobs that can be paused and resumed. Budget is the top priority; finishing time is flexible. Which compute purchase option is BEST?",
    options: ["Spot VMs", "Reserved instances for 3 years", "Pay-as-you-go on-demand VMs", "Dedicated hosts"],
    answer: 0,
    explanation: "Interruptible + cheapest = Spot. Reservations suit steady 24/7 workloads.",
    trap: "Reservations are cheap too, but they assume the workload runs constantly for years.",
  },
  {
    lesson: "cloud-computing",
    prompt:
      "A startup's image-resizing code runs a few hundred times a day when users upload photos. They want no idle cost and no servers. Which model fits BEST?",
    options: ["Serverless (Azure Functions)", "A reserved VM", "A VM Scale Set with minimum 2 instances", "Azure Virtual Desktop"],
    answer: 0,
    explanation: "Event-driven, sporadic, no idle cost = serverless.",
    trap: "A scale set with a minimum of 2 instances still costs money when idle.",
  },
  {
    lesson: "shared-responsibility",
    prompt:
      "A company uses Azure SQL Database. A developer accidentally grants a public firewall rule to 0.0.0.0–255.255.255.255. Who is responsible for this misconfiguration?",
    options: ["The customer", "Microsoft, because SQL Database is PaaS", "The internet provider", "Nobody — PaaS has no network settings"],
    answer: 0,
    explanation: "PaaS removes OS and engine patching, but access and network configuration of your database are still yours.",
    trap: "PaaS does not mean Microsoft configures your firewall rules.",
  },
  {
    lesson: "shared-responsibility",
    prompt:
      "Which task does the customer still own for a Windows VM in Azure but NOT for a web app on Azure App Service?",
    options: ["Applying OS security updates", "Protecting user credentials", "Classifying data", "Physical server maintenance"],
    answer: 0,
    explanation: "OS patching is the customer's in IaaS and Microsoft's in PaaS. Credentials and data are always the customer's; physical is always Microsoft's.",
  },
  {
    lesson: "cloud-models",
    prompt:
      "A bank must keep customer records in its own datacenter by law, but wants to use Azure AI services on anonymized data and manage everything from the Azure portal. What should you recommend?",
    options: [
      "Hybrid cloud, using Azure Arc to manage the on-premises servers",
      "Public cloud only",
      "Private cloud only, with no Azure services",
      "A sovereign region",
    ],
    answer: 0,
    explanation: "On-premises data + Azure services = hybrid. Arc gives a single Azure management plane over both.",
    trap: "A sovereign region is still Azure-hosted — it does not keep data in the bank's own building.",
  },
  {
    lesson: "cloud-models",
    prompt:
      "A company says: \"Our servers are in Azure on a VNet with private IPs, so we are a private cloud.\" Which statement is correct?",
    options: [
      "They use the public cloud; private IPs and VNets do not make it a private cloud",
      "They are a private cloud because the IPs are private",
      "They are a hybrid cloud because they use a VNet",
      "They are multi-cloud",
    ],
    answer: 0,
    explanation: "Private cloud means dedicated infrastructure for one organization. A VNet in Azure is logical isolation in the public cloud.",
  },
  {
    lesson: "cloud-benefits",
    prompt:
      "A ticketing website crashes when a big concert goes on sale. Upgrading to the biggest VM did not help enough. What should the team do?",
    options: [
      "Scale out with more instances behind a load balancer and autoscale rules",
      "Scale up to an even bigger VM",
      "Move to a sovereign region",
      "Buy a 3-year reservation",
    ],
    answer: 0,
    explanation: "Vertical scaling has a ceiling. Horizontal scaling plus elasticity handles big spikes.",
    trap: "A reservation lowers cost; it does not add capacity.",
  },
  {
    lesson: "cloud-benefits",
    prompt:
      "Leadership wants every new Azure environment to follow the same naming, region, and tagging rules automatically. Which cloud benefit is this?",
    options: ["Governance", "Elasticity", "High availability", "Vertical scaling"],
    answer: 0,
    explanation: "Enforcing organizational standards is governance.",
  },
  {
    lesson: "cloud-service-types",
    prompt:
      "A company is moving a legacy app with a custom Windows service and specific registry settings. It must move in two weeks with no code changes. Which service type?",
    options: ["IaaS", "PaaS", "SaaS", "Serverless"],
    answer: 0,
    explanation: "No code changes + OS-level customization = lift-and-shift to IaaS VMs.",
    trap: "PaaS is often \"better\", but it would require changes to the app.",
  },
  {
    lesson: "cloud-service-types",
    prompt:
      "A team builds a new API and wants automatic OS patching, built-in scaling, and deployment slots. Which service type and example fit?",
    options: [
      "PaaS — Azure App Service",
      "IaaS — Azure Virtual Machines",
      "SaaS — Microsoft 365",
      "IaaS — Azure Virtual Desktop",
    ],
    answer: 0,
    explanation: "Managed platform features like slots and patching are PaaS.",
  },
  {
    lesson: "regions-and-zones",
    prompt:
      "An app must survive the failure of an entire datacenter with no data loss and minimal downtime, while staying in one region for data residency. What should you use?",
    options: [
      "Deploy across availability zones with zone-redundant services",
      "Deploy to a single VM in an availability set",
      "Deploy to the paired region only",
      "Use a sovereign region",
    ],
    answer: 0,
    explanation: "Zones = separate datacenters in the same region.",
    trap: "The paired region is a different region — the requirement says stay in one region.",
  },
  {
    lesson: "regions-and-zones",
    prompt:
      "Which TWO are benefits of Azure region pairs?",
    kind: "multi",
    options: [
      "Planned platform updates are rolled out to one region of the pair at a time",
      "During a broad outage, recovery of one region in each pair is prioritized",
      "Region pairs automatically replicate every resource for free",
      "Region pairs are always in the same datacenter",
    ],
    answer: 0,
    answers: [0, 1],
    explanation: "Staggered updates and prioritized recovery are pair benefits. Replication depends on the service (for example GRS storage) and is not automatic for everything.",
    trap: "VMs are not automatically copied to the paired region.",
  },
  {
    lesson: "resource-hierarchy",
    prompt:
      "A company has 40 subscriptions across Sales, IT, and R&D. Security wants one policy applied to all IT subscriptions, and another to all R&D subscriptions. What is the MOST efficient design?",
    options: [
      "Create management groups for IT and R&D and assign the policies there",
      "Assign each policy to every resource group individually",
      "Put all resources in one resource group",
      "Create one subscription and delete the rest",
    ],
    answer: 0,
    explanation: "Management groups apply policy and RBAC to many subscriptions at once by inheritance.",
  },
  {
    lesson: "resource-hierarchy",
    prompt:
      "A dev team creates many short-lived test resources and wants to delete everything for a project in one action when it ends. What should they do?",
    options: [
      "Put each project's resources in its own resource group and delete the group",
      "Tag the resources and delete the tag",
      "Create a management group per project",
      "Apply a ReadOnly lock",
    ],
    answer: 0,
    explanation: "Resource groups share a lifecycle — deleting the group deletes everything in it.",
    trap: "Deleting a tag only removes a label, not the resources.",
  },
  {
    lesson: "compute",
    prompt:
      "A company needs to run a containerized web app that should scale to zero when idle, with no cluster to manage. Which option is the BEST fit?",
    options: [
      "Azure Container Apps",
      "Azure Kubernetes Service",
      "A VM with Docker installed",
      "An availability set",
    ],
    answer: 0,
    explanation: "Container Apps is serverless containers with scale-to-zero. AKS means managing a cluster; a VM means managing an OS.",
  },
  {
    lesson: "compute",
    prompt:
      "Three VMs must keep running if one server rack loses power or one host is updated, inside a single datacenter. Which feature addresses this specifically?",
    options: ["Availability set", "Region pair", "VM Scale Set autoscale", "Azure Virtual Desktop"],
    answer: 0,
    explanation: "Availability sets spread VMs across fault domains (racks/power) and update domains (host updates).",
    trap: "Scale sets can also spread VMs, but the question is about rack and host-update protection — the classic availability set description.",
  },
  {
    lesson: "compute",
    prompt:
      "A manufacturer wants AI defect detection to run on cameras on the factory floor, even when the internet connection drops. Which service is designed for that?",
    options: ["Azure IoT Edge", "Azure IoT Hub only", "Azure Virtual Desktop", "Azure DNS"],
    answer: 0,
    explanation: "IoT Edge runs cloud workloads, including AI models, on devices — offline-capable.",
    trap: "IoT Hub is the cloud-side gateway; it does not run code on the device.",
  },
  {
    lesson: "networking",
    prompt:
      "Two VNets in different Azure regions must communicate privately with low latency, without gateways or the public internet. What should you use?",
    options: ["Global VNet peering", "Site-to-site VPN", "ExpressRoute", "Azure DNS"],
    answer: 0,
    explanation: "VNet peering (global, across regions) connects VNets over the Microsoft backbone.",
    trap: "ExpressRoute connects on-premises to Azure, not VNet to VNet.",
  },
  {
    lesson: "networking",
    prompt:
      "A company must connect its HQ to Azure with predictable bandwidth and compliance rules forbidding traffic on the public internet. It also wants a backup path if that connection fails. What is the BEST design?",
    options: [
      "ExpressRoute as primary, with a site-to-site VPN Gateway as backup",
      "Point-to-site VPN for each employee",
      "Public endpoints on every VM",
      "VNet peering to HQ",
    ],
    answer: 0,
    explanation: "ExpressRoute = private and predictable. A VPN is a common failover path.",
  },
  {
    lesson: "networking",
    prompt:
      "An internal app's storage account must not be reachable from the internet at all; VMs in the VNet must still reach it. What should you configure?",
    options: [
      "A private endpoint and disable public network access",
      "An NSG on the storage account's public endpoint only",
      "Azure DNS public zone",
      "DDoS Protection",
    ],
    answer: 0,
    explanation: "A private endpoint gives the storage account a VNet IP; turning off public access removes the internet path.",
  },
  {
    lesson: "storage",
    prompt:
      "Compliance requires 7 years of retention for audit logs that are read maybe once a year, and retrieval within 15 hours is acceptable. Which tier minimizes cost?",
    options: ["Archive", "Cold", "Cool", "Hot"],
    answer: 0,
    explanation: "Archive is cheapest to store; hours of rehydration are acceptable here.",
    trap: "Cold is cheap and online, but Archive is cheaper when you can wait hours.",
  },
  {
    lesson: "storage",
    prompt:
      "A read-heavy global app wants its storage to survive a regional outage AND let users read from the secondary region before any failover. Which redundancy option?",
    options: ["RA-GRS or RA-GZRS", "GRS", "ZRS", "LRS"],
    answer: 0,
    explanation: "RA- variants allow reading the secondary at any time.",
    trap: "Plain GRS replicates to the secondary, but you cannot read it until failover.",
  },
  {
    lesson: "storage",
    prompt:
      "A company wants to discover its 300 on-premises VMware VMs, assess Azure readiness and cost, then migrate them. Which service is the hub for this?",
    options: ["Azure Migrate", "Azure Data Box", "AzCopy", "Azure File Sync"],
    answer: 0,
    explanation: "Azure Migrate discovers, assesses, and migrates servers, databases, and apps.",
  },
  {
    lesson: "storage",
    prompt:
      "Which TWO tools can copy files into Azure Blob Storage?",
    kind: "multi",
    options: ["AzCopy", "Azure Storage Explorer", "Azure Advisor", "Microsoft Entra ID"],
    answer: 0,
    answers: [0, 1],
    explanation: "AzCopy (command line) and Storage Explorer (GUI) both move data to and from Azure Storage.",
  },
  {
    lesson: "identity",
    prompt:
      "Users should be blocked from signing in from countries where the company does not operate, and must use MFA when on unmanaged devices. Which feature implements both?",
    options: ["Microsoft Entra Conditional Access", "Azure Policy", "Azure RBAC", "Network security groups"],
    answer: 0,
    explanation: "Conditional Access evaluates signals (location, device, risk) and enforces block or MFA.",
    trap: "Azure Policy governs resources, not user sign-ins.",
  },
  {
    lesson: "identity",
    prompt:
      "An old line-of-business app needs Kerberos and domain-joined VMs in Azure. The team does not want to deploy, patch, or back up domain controllers. What should they use?",
    options: [
      "Microsoft Entra Domain Services",
      "Microsoft Entra ID alone",
      "AD DS on two Azure VMs they manage",
      "Azure Key Vault",
    ],
    answer: 0,
    explanation: "Entra Domain Services provides managed domain join, Group Policy, LDAP, and Kerberos/NTLM.",
    trap: "Running AD DS on VMs works but means managing the domain controllers yourself.",
  },
  {
    lesson: "identity",
    prompt:
      "A partner company's consultants need access to one SharePoint site and one Azure resource group using their own corporate credentials. What should you use?",
    options: [
      "Entra External ID B2B collaboration (guest users)",
      "Create new member accounts with new passwords",
      "Microsoft Entra Domain Services",
      "Share an admin account",
    ],
    answer: 0,
    explanation: "B2B guests sign in with their home organization's identity while you control their access.",
  },
  {
    lesson: "security",
    prompt:
      "A support engineer needs to restart VMs in one resource group only. Following least privilege, what should you assign?",
    options: [
      "A role that allows VM operations, scoped to that resource group",
      "Owner on the subscription",
      "Contributor on the management group",
      "Global Administrator in Entra ID",
    ],
    answer: 0,
    explanation: "Least privilege = smallest permissions at the narrowest scope.",
  },
  {
    lesson: "security",
    prompt:
      "A security team wants one service that assesses Azure, AWS, and on-premises servers against best practices, gives a score, and provides threat protection. Which service?",
    options: ["Microsoft Defender for Cloud", "Azure Advisor", "Azure Policy", "Microsoft Purview"],
    answer: 0,
    explanation: "Defender for Cloud covers hybrid and multicloud posture management and workload protection.",
  },
  {
    lesson: "security",
    prompt:
      "Regulators require the company to control and rotate the encryption keys used for data at rest in Azure Storage. What should they use?",
    options: [
      "Customer-managed keys stored in Azure Key Vault",
      "Microsoft-managed keys only",
      "A resource tag named EncryptionKey",
      "A ReadOnly lock",
    ],
    answer: 0,
    explanation: "Customer-managed keys in Key Vault let you control, rotate, and revoke keys.",
  },
  {
    lesson: "cost-management",
    prompt:
      "A finance team sees a large bill increase after a data analytics project started sending results from Azure to an on-premises system. Which cost factor is most likely?",
    options: ["Outbound data transfer (egress)", "Inbound data transfer", "Resource group count", "Number of tags"],
    answer: 0,
    explanation: "Data leaving Azure is billed; inbound is generally free.",
  },
  {
    lesson: "cost-management",
    prompt:
      "Each department must see its own monthly Azure spend, even though departments share subscriptions. What is the BEST approach?",
    options: [
      "Apply a Department tag to resources and group costs by tag in Cost Management",
      "Create a ReadOnly lock per department",
      "Use the Pricing Calculator monthly",
      "Use Azure Service Health",
    ],
    answer: 0,
    explanation: "Tags + Cost Management cost analysis split shared subscriptions by owner.",
  },
  {
    lesson: "cost-management",
    prompt:
      "A team \"stops\" a VM from inside the guest OS to save money, but billing continues. What should they do?",
    options: [
      "Stop (deallocate) the VM from Azure so compute is released",
      "Delete the resource group's tags",
      "Move the VM to another resource group",
      "Apply a CanNotDelete lock",
    ],
    answer: 0,
    explanation: "Shutting down inside the OS leaves the VM allocated. Stop (deallocate) in Azure stops compute charges (disks still bill).",
  },
  {
    lesson: "governance",
    prompt:
      "An Owner tries to create a VM in East US and is blocked, even though they have full permissions. What is the MOST likely cause?",
    options: [
      "An Azure Policy that restricts allowed locations",
      "A missing RBAC role",
      "A CanNotDelete lock",
      "An expired Azure Advisor recommendation",
    ],
    answer: 0,
    explanation: "Policy applies regardless of RBAC role. Owner permissions do not override a Deny policy.",
    trap: "A CanNotDelete lock blocks deletion, not creation.",
  },
  {
    lesson: "governance",
    prompt:
      "A ReadOnly lock is applied to a storage account. What could be an unexpected side effect?",
    options: [
      "Some operations that seem like reads, such as listing storage account keys, are blocked because they are POST operations",
      "The data is deleted",
      "The account moves to the Archive tier",
      "Nothing at all changes",
    ],
    answer: 0,
    explanation: "ReadOnly blocks all write operations at the management plane, which can include listing keys. Test locks before applying them broadly.",
  },
  {
    lesson: "manage-and-deploy",
    prompt:
      "A team must deploy the same 30-resource environment to dev, test, and prod with identical settings, and review changes in Git. What should they use?",
    options: [
      "Infrastructure as code with Bicep or ARM templates",
      "The Azure portal, clicking carefully each time",
      "Azure Advisor",
      "Azure Service Health",
    ],
    answer: 0,
    explanation: "IaC gives repeatable, version-controlled deployments.",
  },
  {
    lesson: "manage-and-deploy",
    prompt:
      "You redeploy an ARM template that has already been deployed with no changes. What happens?",
    options: [
      "Nothing changes — template deployments are idempotent",
      "All resources are duplicated",
      "All resources are deleted and recreated",
      "The deployment always fails",
    ],
    answer: 0,
    explanation: "Declarative templates describe the desired end state; deploying again gives the same result.",
  },
  {
    lesson: "monitoring",
    prompt:
      "Users report a web app is slow. Azure status shows no problems. The team needs to find which dependency call is slow inside the app. Which tool?",
    options: ["Application Insights", "Azure Service Health", "Azure Advisor", "Azure Policy"],
    answer: 0,
    explanation: "Application Insights traces requests and dependencies inside your app.",
    trap: "Service Health tells you about Azure platform issues, not your code's slow database call.",
  },
  {
    lesson: "monitoring",
    prompt:
      "An admin wants to be notified automatically if Microsoft schedules maintenance that will affect VMs in their region. Which service should they configure alerts in?",
    options: ["Azure Service Health", "Application Insights", "Azure Policy", "Azure Pricing Calculator"],
    answer: 0,
    explanation: "Service Health tracks planned maintenance, incidents, and advisories for your subscriptions and can alert you.",
  },
  {
    lesson: "monitoring",
    prompt:
      "A VM shows as unavailable. You want to know whether that specific VM is affected by an Azure platform problem. Which view is MOST specific?",
    options: ["Resource Health", "Azure status page", "Azure Advisor", "Cost Management"],
    answer: 0,
    explanation: "Resource Health shows the health of an individual resource. Azure status is global; Service Health is per subscription and region.",
  },
]);
