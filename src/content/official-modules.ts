const BASE = "https://learn.microsoft.com/en-us/training/modules";

export const LEARN = {
  cloudComputing: {
    title: "Describe cloud computing",
    url: `${BASE}/describe-cloud-compute/`,
  },
  cloudBenefits: {
    title: "Describe the benefits of using cloud services",
    url: `${BASE}/describe-benefits-use-cloud-services/`,
  },
  cloudServiceTypes: {
    title: "Describe cloud service types",
    url: `${BASE}/describe-cloud-service-types/`,
  },
  coreArchitecture: {
    title: "Describe the core architectural components of Azure",
    url: `${BASE}/describe-core-architectural-components-of-azure/`,
  },
  compute: {
    title: "Describe Azure compute services",
    url: `${BASE}/describe-azure-compute-networking-services/`,
  },
  networking: {
    title: "Describe Azure networking services",
    url: `${BASE}/describe-azure-networking-services/`,
  },
  storage: {
    title: "Describe Azure storage services",
    url: `${BASE}/describe-azure-storage-services/`,
  },
  identity: {
    title: "Describe Azure identity, access, and security",
    url: `${BASE}/describe-azure-identity-access-security/`,
  },
  cost: {
    title: "Describe cost management in Azure",
    url: `${BASE}/describe-cost-management-azure/`,
  },
  governance: {
    title: "Describe features and tools in Azure for governance and compliance",
    url: `${BASE}/describe-features-tools-azure-for-governance-compliance/`,
  },
  manageDeploy: {
    title: "Describe features and tools for managing and deploying Azure resources",
    url: `${BASE}/describe-features-tools-manage-deploy-azure-resources/`,
  },
  monitoring: {
    title: "Describe monitoring tools in Azure",
    url: `${BASE}/describe-monitoring-tools-azure/`,
  },
} as const;
