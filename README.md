<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1WSqyLH4AjEd7F6s8Fx--mlFtCgZIdseC

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

How to Run the Demo
Prerequisites
Node.js ≥ 18
Rust toolchain (rustup)
Casper Testnet account with CSPR
CSPR.click wallet extension
Casper CLI installed
1️⃣ Build & Deploy Smart Contracts
cd contracts
cargo build --release
Deploy contracts to Casper Testnet:
cd ../scripts
npm install
npx ts-node deploy.ts
This will:
Deploy AgreementFactory
Register adapters
Output deployed contract hashes
2️⃣ Run the Demo Flow (On-Chain)
npx ts-node demo_flow.ts
This script:
Creates a new agreement
Funds the agreement
Approves a milestone
Releases funds
Completes the agreement
3️⃣ Run the Frontend
cd frontend
npm install
npm run dev
Open:
👉 http://localhost:3000
Connect with CSPR.click, select a demo agreement, and interact with the live on-chain contract.


TrustFlow
Programmable On-Chain Agreements for Real-World Business

🚀 What is TrustFlow?

TrustFlow is a decentralized agreement and payment automation platform built on the Casper Network. It allows two or more parties to create stateful, milestone-based smart agreements that behave like real-world contracts rather than simple token transfers.
Each agreement lives fully on-chain and progresses through well-defined states (draft, funded, in progress, review, dispute, completed), enforcing conditional fund releases, dispute windows, and approvals. TrustFlow also supports yield-generating escrow via liquid staking, allowing locked funds to remain productive while agreements are active.
TrustFlow is designed for:
Freelancers and agencies
DAOs and service providers
Enterprises testing blockchain-based agreements
Cross-chain payment coordination

✨ Key Features

📝 Stateful Smart Agreements

Agreements are implemented as finite state machines with enforced transitions and role-based permissions.

💸 Milestone-Based Escrow

Funds are released only when predefined conditions are met, supporting partial payouts and deadlines.

🥩 Liquid Staking Escrow (Optional)

Escrowed CSPR can be routed into Casper’s liquid staking system so funds earn yield while locked.

⚖️ Built-In Dispute & Arbitration

Configurable dispute windows with on-chain arbitration logic.

🌉 Interoperability-Ready Settlement

Agreements remain native to Casper while supporting external settlement adapters for future cross-chain payouts.

🧠 Why Casper Is Essential

TrustFlow is intentionally built on Casper because its architecture uniquely supports real-world contract logic:
1. Upgradeable Smart Contracts
Real agreements evolve. Casper’s native support for upgradeable contracts allows TrustFlow agreements to adapt without breaking state or redeploying funds.
2. Predictable Execution with WASM
Casper’s WebAssembly execution model ensures deterministic, auditable, and enterprise-grade contract behavior—critical for legal and financial agreements.
3. Rust-Based Development
Using Rust + Odra enables strong typing, safer state management, and clearer contract logic than typical EVM environments.
4. Native Proof-of-Stake & Liquid Staking
Casper’s PoS design allows TrustFlow to integrate yield-generating escrow directly at the protocol level.
5. Account-Based Permissions
Casper’s account model and named keys make multi-party permissions and roles first-class citizens.
In short: TrustFlow is not just deployed on Casper — it depends on Casper’s strengths to exist.

📌 Status

This project includes:
On-chain components deployed to Casper Testnet
Functional agreement lifecycle
Working frontend demo
Clear extensibility for enterprise and cross-chain use cases

🤝 Team & Acknowledgements

Built for Casper Hackathon 2026 using:
Casper Network
Odra Framework
Rust + WebAssembly
CSPR.click Wallet

🏗️ Project Structure

trustflow/
├── contracts/
│   ├── agreement_factory/     # Deploys and registers agreements
│   ├── agreement_instance/    # Core agreement logic & state machine
│   ├── staking_adapter/       # Liquid staking integration
│   └── settlement_adapter/    # Cross-chain settlement interface
├── frontend/
│   ├── pages/                 # App routes
│   ├── components/            # UI components
│   └── wallet/                # CSPR.click integration
├── scripts/
│   ├── deploy.ts              # Testnet deployment script
│   └── demo_flow.ts           # End-to-end demo scenario
├── README.md
└── demo.md

