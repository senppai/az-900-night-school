import { LEARN } from "../official-modules";
import type { Lesson } from "../types";

export const lesson: Lesson = {
  slug: "cloud-computing",
  order: 1,
  title: "What cloud computing actually is",
  emoji: "☁️",
  domain: "cloud",
  minutes: 16,
  summary:
    "Cloud computing is renting compute, storage, and services over the internet — plus how you pay for it, and what serverless really means.",
  examFocus:
    "AZ-900 wants you to contrast buying hardware (CapEx) with paying for what you use (consumption / OpEx), name the pricing models, and know that serverless still uses servers — you just do not manage them.",
  youWillLearn: [
    "A plain-English definition of cloud computing",
    "Why CapEx, OpEx, and consumption-based billing are different",
    "Pay-as-you-go vs reserved vs spot, at fundamentals level",
    "What serverless is — and what it is not",
  ],
  officialModule: {
    ...LEARN.cloudComputing,
    units: ["What is cloud computing", "Describe the consumption-based model"],
  },
  blocks: [
    {
      type: "lead",
      emoji: "💡",
      text: "Cloud computing is not magic, and it is not \"someone else's computer\" as a joke. It is a business model: instead of buying servers, a building, cooling, and a night-shift operator, you rent computing over the internet and pay for what you use. Azure is Microsoft's version of that rental shop.",
    },
    {
      type: "p",
      text: "Picture electricity. You do not build a power plant behind your house. You plug in, the grid supplies capacity, and the bill tracks how much you used. Cloud computing does the same thing for virtual machines, storage, databases, networks, and software. Microsoft Learn's definition is: the delivery of computing services over the internet, typically with a pay-as-you-go price.",
    },
    {
      type: "think",
      text: "Cloud = rent computing like you rent electricity. You do not own the plant.",
    },
    {
      type: "heading",
      text: "What you are actually renting",
    },
    {
      type: "p",
      text: "Those \"computing services\" are not one product. They include servers (compute), disks and blobs (storage), databases, networking, software, analytics, and AI. You request them on demand, often in minutes, from a shared pool of resources that Microsoft already built and runs in datacenters around the world.",
    },
    {
      type: "list",
      items: [
        "On-demand: you can start a VM on a Tuesday afternoon without ordering hardware",
        "Shared pool: many customers share Microsoft's fleet, isolated from each other",
        "Measured: usage is metered — hours, gigabytes, transactions, executions",
        "Elastic: capacity can grow and shrink without you buying a new rack",
        "Self-service: a portal, CLI, or API, not a ticket to a datacenter team",
      ],
    },
    {
      type: "example",
      title: "Northwind Traders, before and after",
      body: "Northwind used to wait eight weeks for a new database server, then pay for it whether the holiday sale happened or not. In Azure they create a database in minutes, scale it for Black Friday, and scale it back in January. Same business. Completely different relationship with hardware.",
    },
    {
      type: "diagram",
      title: "Own a plant vs plug into the grid",
      ascii: `Traditional IT                         Cloud
---------------                        -----
Buy servers                            Request a service
Build a datacenter                     Microsoft already built it
Hire people to patch, cool, guard      Microsoft operates the plant
Pay whether it is busy or idle         Metered bill for what you used

        You  ──plug in──>  Azure grid`,
    },
    {
      type: "heading",
      text: "CapEx, OpEx, and the consumption-based model",
    },
    {
      type: "p",
      text: "This is where AZ-900 starts scoring easy points. Companies spend money in two big buckets. Capital expenditure (CapEx) is a large upfront purchase of an asset — servers, racks, a building — that you depreciate over years. Operating expenditure (OpEx) is money you spend to run the business this month — electricity, salaries, a cloud bill.",
    },
    {
      type: "compare",
      items: [
        {
          title: "CapEx",
          subtitle: "Buy the asset",
          points: [
            "Big upfront spend: servers, datacenter, SAN, cooling",
            "You own it, whether it sits idle or not",
            "Slow to change — you guessed demand years ahead",
            "Classic on-premises model",
          ],
        },
        {
          title: "OpEx",
          subtitle: "Pay to operate",
          points: [
            "Ongoing costs: subscriptions, power, cloud invoices",
            "Usually easier on cash flow than a giant purchase",
            "Cloud bills are OpEx",
          ],
        },
        {
          title: "Consumption-based",
          subtitle: "A style of OpEx",
          points: [
            "You pay for what you actually used",
            "No (or very little) unused capacity sitting on the floor",
            "Stop the resource, stop most of the bill",
          ],
        },
      ],
    },
    {
      type: "example",
      title: "Gym membership vs paying at the door",
      body: "A monthly gym membership is a fixed OpEx: you pay even if you never go. Paying only on the days you walk in is consumption-based. Most Azure meters work like the door fee — VM hours, gigabytes stored, function executions — not like a membership you cannot pause.",
    },
    {
      type: "think",
      text: "CapEx = buy the oven. OpEx = pay each month. Consumption = pay per pizza you actually bake.",
    },
    {
      type: "trap",
      text: "Cloud is not automatically cheaper. It is more flexible. A VM you leave running 24/7 for three years can cost more than buying a box. The win is not running it when you do not need it — and not buying a warehouse of boxes \"just in case.\"",
    },
    {
      type: "heading",
      text: "Cloud pricing models you must be able to compare",
    },
    {
      type: "p",
      text: "\"Consumption-based\" is the idea. Azure then offers a few common ways to buy that capacity. At AZ-900 level you do not need rate-card math. You need to match a customer's situation to the right model.",
    },
    {
      type: "table",
      caption: "Three models the exam loves to mix up",
      headers: ["Model", "The deal", "Best when", "Watch-out"],
      rows: [
        [
          "Pay-as-you-go",
          "List price, billed for what you use, no term",
          "Unpredictable or short-lived work; experiments",
          "Highest unit price if it runs all year",
        ],
        [
          "Reserved",
          "Commit for 1 or 3 years to a size/region (or similar commitment)",
          "Steady production that will run anyway",
          "You still pay if you over-commit and stop using it",
        ],
        [
          "Spot",
          "Unused Azure capacity at a deep discount",
          "Batch, rendering, tests — work that can be interrupted",
          "Azure can evict the VM when it needs the capacity back",
        ],
      ],
    },
    {
      type: "exam",
      title: "AZ-900 exam points",
      points: [
        "Pay-as-you-go = flexibility, no commitment",
        "Reserved = discount in exchange for a time commitment",
        "Spot = cheapest compute, but interruptible",
        "Consumption-based is the umbrella idea: meter usage instead of buying hardware",
      ],
    },
    {
      type: "trap",
      text: "Reserved is not the same as Spot. Reserved is a commitment you choose so Microsoft can plan capacity. Spot is leftover capacity Microsoft might take back. One is \"I promise to stay.\" The other is \"I will leave if you need the chair.\"",
    },
    {
      type: "heading",
      text: "Serverless: you write code, the cloud runs it",
    },
    {
      type: "p",
      text: "Serverless does not mean there are no servers. It means you do not provision, patch, or scale those servers. You give Azure a piece of code (or a workflow), Azure hosts it, Azure scales it from zero to busy and back, and on a consumption plan you pay when it runs. Azure Functions is the poster child. Logic Apps is the workflow cousin.",
    },
    {
      type: "example",
      title: "PixelForge Games resizes screenshots",
      body: "Every time a player uploads a screenshot, a function fires, resizes the image, and stores a thumbnail. At 3 a.m. the function sits at zero instances and costs almost nothing. At launch day it scales out by itself. Nobody on PixelForge's team picked a VM size or installed IIS.",
      code: "// Mental model, not syntax to memorize\n// Event happens → Azure runs your function → you pay for that execution",
    },
    {
      type: "think",
      text: "Serverless = you own the code. Azure owns the server, the OS, and the scale-out.",
    },
    {
      type: "trap",
      text: "Serverless is not \"free,\" and it is not IaaS. If the question says you must manage the operating system, that is not serverless. If it says you deploy a VM and install your app, that is not serverless either.",
    },
    {
      type: "cheatsheet",
      rows: [
        {
          term: "Cloud computing",
          what: "Rent compute/storage/services over the internet",
          remember: "Electricity grid, not a home generator",
        },
        {
          term: "CapEx",
          what: "Upfront spend on assets you own",
          remember: "Buy the servers",
        },
        {
          term: "OpEx",
          what: "Ongoing operating cost",
          remember: "The monthly cloud bill",
        },
        {
          term: "Consumption-based",
          what: "Pay for metered usage",
          remember: "Stop it, stop paying (mostly)",
        },
        {
          term: "Pay-as-you-go",
          what: "No commitment, list-ish rates",
          remember: "Flexible, pricier per hour",
        },
        {
          term: "Reserved",
          what: "1- or 3-year commitment discount",
          remember: "Steady workloads",
        },
        {
          term: "Spot",
          what: "Unused capacity, can be evicted",
          remember: "Cheap and interruptible",
        },
        {
          term: "Serverless",
          what: "You write code; Azure runs and scales it",
          remember: "Azure Functions, not \"no computers\"",
        },
      ],
    },
    {
      type: "onesentence",
      text: "Cloud computing is renting metered IT like electricity: you trade CapEx for OpEx, pick pay-as-you-go, reserved, or spot depending on how committed and interruptible you are, and serverless is the extreme of \"just run my code.\"",
    },
    {
      type: "scenario",
      title: "Exam-style scene",
      setup: "Fabrikam runs a nightly report that can be restarted if it fails. They want the lowest possible compute price and can tolerate the job being stopped mid-run. They do not want a one- or three-year commitment.",
      answer: "Spot (interruptible unused capacity)",
      why: "Pay-as-you-go would work but costs more. Reserved is a commitment they do not want. Spot is designed for work that can be evicted. Serverless could also fit some jobs, but the exam cue \"lowest price\" plus \"can be interrupted\" is Spot.",
    },
  ],
  quiz: [
    {
      id: "cc-1",
      prompt:
        "Which statement best defines cloud computing for AZ-900?",
      options: [
        "Installing Windows Server on hardware you purchased for the office",
        "Delivering computing services over the internet, typically billed for what you use",
        "A private network that never connects to the internet",
        "A single physical server that several departments share in a closet",
      ],
      answer: 1,
      explanation:
        "Microsoft describes cloud computing as delivering compute, storage, databases, networking, software, and more over the internet, usually on a pay-as-you-go or consumption basis.",
      trap: "Sharing one office server is not cloud. Cloud is an on-demand pool of services, not a dusty tower under someone's desk.",
    },
    {
      id: "cc-2",
      prompt:
        "A company buys racks of servers and a cooling system for a new datacenter. What kind of spending is that?",
      options: [
        "OpEx",
        "Consumption-based billing",
        "CapEx",
        "Spot pricing",
      ],
      answer: 2,
      explanation:
        "Buying assets up front is capital expenditure (CapEx). A monthly Azure invoice is OpEx. Consumption-based is paying for metered use of a service, not buying the rack.",
    },
    {
      id: "cc-3",
      prompt:
        "What is the main idea of a consumption-based model?",
      options: [
        "You pay a fixed annual fee whether you use the service or not",
        "You pay only for the resources you consume",
        "You must buy hardware that Microsoft then manages",
        "You prepay three years and cannot change the VM size",
      ],
      answer: 1,
      explanation:
        "Consumption-based means the bill tracks usage — hours, gigabytes, executions. A fixed fee regardless of use is the opposite. A three-year lock is reserved pricing, which is a different model.",
    },
    {
      id: "cc-4",
      prompt:
        "Tailwind Traders will run the same production VM size in the same region for the next three years. They want the lowest predictable price and can commit. What should they look at first?",
      options: [
        "Spot VMs",
        "Pay-as-you-go only",
        "Reserved pricing (a 1- or 3-year commitment)",
        "Building their own datacenter to avoid Azure fees",
      ],
      answer: 2,
      explanation:
        "Reserved pricing trades a time commitment for a discount on steady workloads. Spot can be cheaper still but is interruptible — a bad default for production that must stay up. Pay-as-you-go is flexible but usually costs more per hour.",
    },
    {
      id: "cc-5",
      prompt:
        "Why would you choose Spot VMs instead of pay-as-you-go?",
      options: [
        "You need a legally binding uptime SLA for a customer-facing storefront",
        "You want unused Azure capacity at a discount and can handle eviction",
        "You want Microsoft to patch the guest OS for you automatically",
        "You want to convert CapEx into a building purchase",
      ],
      answer: 1,
      explanation:
        "Spot uses spare Azure capacity. The discount is the point; eviction is the trade-off. It is not a security feature and it is not how you get OS patching (that is more of a PaaS/SaaS conversation).",
      trap: "Do not pick Spot for \"must never go down\" workloads. That is the classic exam trap.",
    },
    {
      id: "cc-6",
      prompt:
        "A developer wants to run small pieces of code when blobs arrive in storage, without creating or patching servers. Which idea is that?",
      options: [
        "CapEx",
        "A reserved physical rack in a colocation cage",
        "Serverless (for example Azure Functions)",
        "Buying a hypervisor and running it in the office",
      ],
      answer: 2,
      explanation:
        "Serverless means you write the code and the cloud runs it. You do not manage the servers. Azure Functions on a consumption plan is the AZ-900 example.",
    },
    {
      id: "cc-7",
      prompt:
        "Which pair correctly matches the spending type with an example?",
      options: [
        "CapEx = monthly Azure invoice; OpEx = buying a SAN",
        "CapEx = buying servers up front; OpEx = paying monthly for Azure usage",
        "CapEx and OpEx are the same in the cloud",
        "OpEx = a 10-year datacenter lease paid in one go",
      ],
      answer: 1,
      explanation:
        "CapEx is up-front spending on physical assets that depreciate. OpEx is ongoing spending on services as you use them — the default cloud model.",
    },
    {
      id: "cc-8",
      prompt:
        "In serverless computing, what does the customer NOT have to manage?",
      options: [
        "The application code",
        "The servers and infrastructure the code runs on",
        "The data the code processes",
        "Who is allowed to call the function",
      ],
      answer: 1,
      explanation:
        "Serverless still runs on servers — you just never see or manage them. You still own the code, the data, and access decisions.",
      trap: "“Serverless” does not mean “no servers exist.” It means “no servers you manage.”",
    },
    {
      id: "cc-9",
      prompt:
        "Which benefit of the consumption-based model helps a startup most when it is not sure the app will succeed?",
      options: [
        "No up-front hardware cost, and you can stop paying when you stop using it",
        "A guaranteed 100% SLA on every service",
        "Free outbound bandwidth forever",
        "Microsoft writes the application code",
      ],
      answer: 0,
      explanation:
        "Pay-for-what-you-use removes the up-front gamble. If the idea fails, you delete resources and stop paying — no racks to sell.",
    },
    {
      id: "cc-10",
      prompt:
        "Which statement about cloud pricing models is correct?",
      options: [
        "Reserved capacity is cheaper than pay-as-you-go because you commit for 1 or 3 years",
        "Spot is the best choice for workloads that must never stop",
        "Pay-as-you-go always requires a 3-year contract",
        "Serverless is billed per physical server you rent",
      ],
      answer: 0,
      explanation:
        "Reservations trade commitment for a discount. Spot is cheap but interruptible. Pay-as-you-go has no commitment. Serverless bills per execution or resource consumed.",
    },
  ],
};
