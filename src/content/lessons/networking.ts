import { LEARN } from "../official-modules";
import type { Lesson } from "../types";

export const lesson: Lesson = {
  slug: "networking",
  order: 9,
  title: "Azure networking fundamentals",
  emoji: "🌐",
  domain: "architecture",
  minutes: 17,
  summary:
    "VNets, subnets, peering, Azure DNS, VPN Gateway versus ExpressRoute, and public versus private endpoints.",
  examFocus:
    "VPN Gateway = encrypted tunnel over the public internet. ExpressRoute = private connection that does not go over the public internet. Private endpoint = a private IP for a PaaS service inside your VNet.",
  youWillLearn: [
    "What a virtual network and a subnet are for",
    "How VNet peering connects two VNets",
    "When to use Azure DNS",
    "The difference between VPN Gateway, ExpressRoute, and public vs private endpoints",
    "Basic network access controls: NSGs, Azure Firewall, and DDoS Protection",
  ],
  officialModule: {
    ...LEARN.networking,
    units: [
      "Describe Azure virtual networking",
      "Describe Azure virtual private networks",
      "Describe Azure ExpressRoute",
      "Describe Azure DNS",
    ],
  },
  blocks: [
    {
      type: "lead",
      emoji: "🔌",
      text: "If compute is where code runs, networking is how that code talks to users, to on-premises, and to other Azure services. AZ-900 keeps this at the map level: private networks, name resolution, and two ways to plug the office into Azure.",
    },
    {
      type: "heading",
      text: "1. Virtual networks and subnets",
    },
    {
      type: "p",
      text: "An Azure virtual network (VNet) is your private network in Azure. You pick a private IP address space (for example 10.0.0.0/16) and a region. Resources such as VMs get private IPs from that VNet. A subnet slices the VNet into smaller ranges so you can separate workloads — web tier in one subnet, data tier in another — and attach different network security groups. Subnets live inside one VNet. You cannot stretch a single VNet across two regions; for two regions you create two VNets and connect them.",
    },
    {
      type: "example",
      title: "A VNet is the private office LAN in the cloud",
      body: "The building is the region. The LAN is the VNet. Floors are subnets. Desks are VMs with private IPs. Visitors from the internet only get in if you add a public IP, a load balancer, or another published entry point.",
    },
    {
      type: "diagram",
      title: "One VNet, two subnets",
      ascii: `  VNet  10.0.0.0/16     (East US)
  ┌────────────────────────────────┐
  │  subnet-web  10.0.1.0/24       │
  │     [VM] [VM]                  │
  │  subnet-data 10.0.2.0/24       │
  │     [VM] [DB]                  │
  └────────────────────────────────┘
  Private IPs. Not the public internet.`,
    },
    {
      type: "think",
      text: "VNet = your private network in Azure. Subnet = a slice of that network.",
    },
    {
      type: "heading",
      text: "2. VNet peering",
    },
    {
      type: "p",
      text: "VNet peering connects two Azure virtual networks so resources can talk using private IPs. Traffic stays on the Microsoft backbone — it is not hairpinned out to the public internet. You can peer VNets in the same region or in different regions (global peering). The VNets stay separate management objects; you are not merging them into one giant VNet. Address spaces must not overlap.",
    },
    {
      type: "trap",
      text: "Peering is not a VPN Gateway and it is not ExpressRoute. Peering links Azure VNets to each other. VPN/ExpressRoute link Azure to somewhere else (usually on-premises).",
    },
    {
      type: "heading",
      text: "3. Azure DNS",
    },
    {
      type: "p",
      text: "DNS turns names into IP addresses. Azure DNS is a hosting service for DNS domains that runs on Azure’s name servers. You can host a public zone (contoso.com on the internet) or a private zone that resolves names only inside your VNets (app.internal.contoso). On the exam, Azure DNS is the answer when the need is “host and resolve DNS names in Azure,” not when the need is “connect two networks.”",
    },
    {
      type: "think",
      text: "Azure DNS = name tags. VNet = the private streets. They solve different problems.",
    },
    {
      type: "heading",
      text: "4. VPN Gateway vs ExpressRoute",
    },
    {
      type: "p",
      text: "Both connect on-premises networks to Azure. They do it very differently. Azure VPN Gateway creates an encrypted tunnel over the public internet (site-to-site for offices, point-to-site for individual laptops). It is usually faster to set up and cheaper. ExpressRoute is a private connection through a connectivity provider. Your traffic does not travel over the public internet. You get more reliability, more consistent bandwidth, and often lower latency — at higher cost and with more setup. Encrypted-over-internet vs private-circuit is the distinction Microsoft wants.",
    },
    {
      type: "compare",
      items: [
        {
          title: "Azure VPN Gateway",
          subtitle: "Encrypted over the internet",
          points: [
            "IPsec/IKE tunnels across the public internet",
            "Site-to-site or point-to-site",
            "Good starting hybrid option; bandwidth and latency depend on the internet",
          ],
        },
        {
          title: "ExpressRoute",
          subtitle: "Private connection",
          points: [
            "Dedicated circuit via a provider; not the public internet",
            "More consistent performance and higher bandwidth options",
            "More cost and lead time; used when internet VPN is not enough",
          ],
        },
      ],
    },
    {
      type: "diagram",
      title: "Two ways the office reaches Azure",
      ascii: `  On-premises                          Azure VNet
      │
      │  VPN Gateway:  ==== encrypted ====  (public internet)
      │
      │  ExpressRoute: ---- private fiber -- (not the public internet)
      │
      └───────────────────────────────────►  your subnets`,
    },
    {
      type: "trap",
      text: "ExpressRoute is not “a faster VPN.” It is a different path: private connectivity. VPN Gateway still uses the internet; it just encrypts what it sends.",
    },
    {
      type: "heading",
      text: "5. Public vs private endpoints",
    },
    {
      type: "p",
      text: "A public endpoint is an address reachable from the public internet (a public IP on a VM, or the public HTTPS URL of a storage account). A private endpoint gives a PaaS service a private IP on your VNet using Azure Private Link. Traffic to that storage account or database then stays on the private network instead of going out to a public hostname. Use public when the service must be reached from the internet. Use private when you want the service to look like it lives on your LAN.",
    },
    {
      type: "example",
      title: "Same storage account, two front doors",
      body: "Public endpoint: https://mystuff.blob.core.windows.net from a café Wi-Fi. Private endpoint: 10.0.3.8 on subnet-privatelink, only reachable from your VNet (or from on-premises over VPN/ExpressRoute).",
    },
    {
      type: "exam",
      title: "AZ-900 exam point",
      points: [
        "VNet / subnet — private address space in Azure",
        "Peering — VNet to VNet on the Microsoft backbone",
        "Azure DNS — host and resolve names",
        "VPN Gateway — encrypted hybrid over the internet",
        "ExpressRoute — private hybrid connection",
        "Private endpoint — private IP for a PaaS service in your VNet",
      ],
    },
    {
      type: "heading",
      text: "6. Basic network access controls",
    },
    {
      type: "p",
      text: "Once resources are on a VNet you need to decide what traffic is allowed. A network security group (NSG) is a list of allow/deny rules (source, destination, port, protocol) attached to a subnet or a NIC — the basic filter that says “allow 443 from the internet, deny everything else.” Azure Firewall is a managed, stateful firewall service for the whole network: central rules, application (FQDN) filtering, threat intelligence, logging. Azure DDoS Protection defends public endpoints against distributed denial-of-service floods; a basic level is always on for the platform, and the paid tier adds tuning, alerts, and cost protection for your resources.",
    },
    {
      type: "compare",
      items: [
        {
          title: "NSG",
          subtitle: "Simple allow/deny rules",
          points: ["Attached to a subnet or NIC", "Port, protocol, IP rules", "Free, basic filtering"],
        },
        {
          title: "Azure Firewall",
          subtitle: "Managed central firewall",
          points: ["Stateful, whole-network", "FQDN and threat-intel filtering", "Paid, centrally logged"],
        },
        {
          title: "DDoS Protection",
          subtitle: "Stop traffic floods",
          points: ["Protects public IPs", "Absorbs volumetric attacks", "Not a rule-based filter"],
        },
      ],
    },
    {
      type: "trap",
      text: "An NSG does not stop a DDoS flood, and DDoS Protection does not decide which ports are open. Rules → NSG or Firewall. Floods → DDoS Protection.",
    },
    {
      type: "cheatsheet",
      rows: [
        {
          term: "Network security group",
          what: "Allow/deny rules on a subnet or NIC",
          remember: "Basic port filter",
        },
        {
          term: "Azure Firewall",
          what: "Managed stateful firewall for the network",
          remember: "Central rules + FQDN filtering",
        },
        {
          term: "DDoS Protection",
          what: "Defends public endpoints from floods",
          remember: "Volume attacks, not port rules",
        },
        {
          term: "Virtual network",
          what: "Your private network in Azure",
          remember: "The LAN",
        },
        {
          term: "Subnet",
          what: "A slice of a VNet",
          remember: "A floor in the building",
        },
        {
          term: "VNet peering",
          what: "Private connection between two VNets",
          remember: "Azure to Azure, not a VPN",
        },
        {
          term: "Azure DNS",
          what: "Host DNS zones in Azure",
          remember: "Names → IP addresses",
        },
        {
          term: "VPN Gateway",
          what: "Encrypted tunnel over the internet",
          remember: "Hybrid, uses public internet",
        },
        {
          term: "ExpressRoute",
          what: "Private circuit to Azure",
          remember: "Hybrid, not the public internet",
        },
        {
          term: "Private endpoint",
          what: "Private IP for a PaaS service",
          remember: "Keep PaaS off the public internet",
        },
      ],
    },
    {
      type: "onesentence",
      text: "A VNet with subnets is your private Azure network, peering joins VNets on Microsoft’s backbone, Azure DNS resolves names, VPN Gateway encrypts hybrid traffic over the internet, ExpressRoute uses a private connection instead, and private endpoints put PaaS services on a private IP in your VNet.",
    },
    {
      type: "scenario",
      title: "Exam-style scene",
      setup: "A bank must connect its datacenter to Azure with a dedicated circuit that does not travel over the public internet, and it wants the Azure SQL database to be reachable only via a private IP on the VNet.",
      answer: "ExpressRoute plus a private endpoint for Azure SQL.",
      why: "ExpressRoute is the private on-premises path. A private endpoint gives the database a VNet IP. VPN Gateway would still ride the public internet, and a public endpoint would keep the database on the internet.",
    },
  ],
  quiz: [
    {
      id: "net-1",
      prompt: "What is an Azure virtual network (VNet)?",
      options: [
        "A DNS hosting service",
        "Your private network in Azure, with an address space you define",
        "A physical fiber circuit from your office",
        "A tool that copies blobs between storage accounts",
      ],
      answer: 1,
      explanation:
        "A VNet is the private IP network you create in a region. Subnets divide it. It is not DNS and it is not ExpressRoute.",
    },
    {
      id: "net-2",
      prompt: "What does VNet peering do?",
      options: [
        "Encrypts traffic from a laptop over the public internet",
        "Connects two Azure virtual networks so they can communicate over the Microsoft backbone using private IPs",
        "Assigns a public IP to every VM",
        "Hosts the contoso.com DNS zone",
      ],
      answer: 1,
      explanation:
        "Peering links VNets. Traffic stays on Microsoft’s network. VPN Gateway is the internet-encrypted hybrid option.",
    },
    {
      id: "net-3",
      prompt: "Which service is designed to host DNS domains and resolve names in Azure?",
      options: ["ExpressRoute", "Azure DNS", "Availability sets", "Azure Arc"],
      answer: 1,
      explanation:
        "Azure DNS hosts public and private DNS zones. ExpressRoute is private connectivity, not name hosting.",
    },
    {
      id: "net-4",
      prompt:
        "A company wants an encrypted connection from its office to Azure that travels across the public internet. What should it use?",
      options: [
        "ExpressRoute",
        "Azure VPN Gateway",
        "VNet peering only",
        "A sovereign region",
      ],
      answer: 1,
      explanation:
        "VPN Gateway builds an encrypted tunnel over the public internet. ExpressRoute is the private, not-the-internet path.",
      trap: "If the question says “does not use the public internet,” pick ExpressRoute. If it says “encrypted over the internet,” pick VPN Gateway.",
    },
    {
      id: "net-5",
      prompt: "How is ExpressRoute different from a VPN Gateway?",
      options: [
        "ExpressRoute is cheaper and always uses Wi-Fi",
        "ExpressRoute provides a private connection through a provider and does not go over the public internet",
        "ExpressRoute can only connect two Azure VNets in the same region",
        "ExpressRoute is another name for Azure DNS",
      ],
      answer: 1,
      explanation:
        "ExpressRoute is private connectivity. VPN Gateway encrypts over the public internet. Peering is VNet-to-VNet.",
    },
    {
      id: "net-6",
      prompt: "What is a private endpoint?",
      options: [
        "A public IP address on a virtual machine",
        "A private IP address on your VNet that maps to an Azure PaaS service (Private Link)",
        "A DNS record in a public zone",
        "A second Azure region used as a pair",
      ],
      answer: 1,
      explanation:
        "A private endpoint brings a service such as Storage or Azure SQL onto a private IP in your subnet so clients do not have to use the public endpoint.",
    },
    {
      id: "net-7",
      prompt:
        "You need to allow inbound HTTPS to a web subnet and block all other inbound ports. What is the simplest control?",
      options: [
        "A network security group (NSG) on the subnet",
        "Azure DDoS Protection",
        "ExpressRoute",
        "Azure DNS",
      ],
      answer: 0,
      explanation:
        "NSGs hold allow/deny rules by port, protocol, and IP. DDoS Protection handles floods, not port rules.",
    },
    {
      id: "net-8",
      prompt:
        "A public website is being hit with a massive flood of traffic designed to knock it offline. Which service is designed for this?",
      options: [
        "Azure DDoS Protection",
        "A network security group",
        "VNet peering",
        "A private endpoint",
      ],
      answer: 0,
      explanation:
        "Distributed denial-of-service attacks are absorbed and mitigated by Azure DDoS Protection.",
    },
    {
      id: "net-9",
      prompt:
        "Which VPN Gateway connection type connects a single remote laptop to an Azure VNet?",
      options: ["Point-to-site", "Site-to-site", "ExpressRoute Direct", "VNet peering"],
      answer: 0,
      explanation:
        "Point-to-site connects individual devices. Site-to-site connects a whole on-premises network.",
    },
    {
      id: "net-10",
      prompt:
        "You want centrally managed, stateful network filtering across many VNets, including rules by fully qualified domain name. Which service?",
      options: ["Azure Firewall", "A network security group", "Azure DNS", "Azure Bastion"],
      answer: 0,
      explanation:
        "Azure Firewall is a managed, stateful firewall service with central policy and FQDN filtering. NSGs are simpler, per-subnet/NIC rules.",
    },
  ],
};
