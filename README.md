# 🧬 Smith-Waterman Triton Engine (BioCUDA-UI)

A high-performance, GPU-accelerated sequence alignment dashboard. This project utilizes OpenAI Triton to parallelize the Smith-Waterman and Needleman-Wunsch algorithms, achieving massive speedups over traditional CPU-based dynamic programming.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Demo-000000?style=for-the-badge&logo=vercel)](https://sw-triton-engine-ui.vercel.app/)
[![Triton Acceleraged](https://img.shields.io/badge/Powered_by-Triton-FF6F00?style=for-the-badge&logo=nvidia&logoColor=white)](https://openai.com/blog/triton/)

## Dashboard Preview

![BioCUDA Dashboard](assets/dashboard.png)

## ⚡ The Compute Paradigm: Wavefront Parallelization

Traditional sequence alignment (Smith-Waterman/Needleman-Wunsch) is $O(M \times N)$ on a CPU because each cell depends on its top, left, and top-left neighbors. 

This engine implements *Wavefront Parallelization. By computing cells along the anti-diagonals (waves), we can calculate all independent cells in a wave simultaneously on the GPU. This reduces the time complexity to **$O(M + N - 1)$** parallel execution steps.

## 📊 Performance Benchmarks (Tesla T4 GPU)

Performance is measured in **GCUPS** (Giga Cell Updates Per Second). The Triton Wavefront kernel achieves massive throughput scaling as sequence lengths increase, effectively bypassing the severe bottlenecks of sequential Python `for`-loops.

| Sequence Size (M x N) | Total Matrix Cells | Sequential CPU Time | Triton GPU Time | Throughput (GCUPS) |
| :--- | :--- | :--- | :--- | :--- |
| 100 x 100 | 10,000 | ~15.2 ms | **1.2 ms** | 0.008 |
| 500 x 500 | 250,000 | ~380.0 ms | **4.5 ms** | 0.055 |
| 1,000 x 1,000 | 1,000,000 | ~1,520.0 ms | **12.1 ms** | 0.082 |
| 5,000 x 5,000 | 25,000,000 | ~38,000.0 ms | **185.0 ms** | 0.135 |

> *Note: Network latency via Localtunnel adds a flat ~50-100ms to web-dashboard readouts. The GCUPS metric is calculated using pure GPU execution time.*

## 🛠️ Features

- *Dual-Engine Support:* Toggle between *Local (Smith-Waterman)* for substring matching and *Global (Needleman-Wunsch)* for end-to-end alignment.
- *Triton Kernel:* Custom-written GPU kernel for high-efficiency memory coalescing and parallel compute.
- *Hardware Telemetry:* Real-time tracking of GPU execution time (ms) and wavefront efficiency.
- *Neo-Brutalist UI:* A high-contrast, CRT-inspired dashboard designed for computational biologists.

## 🏗️ Architecture

This project utilizes a *Hybrid-Cloud* setup to provide free access to NVIDIA GPUs:

1. *Frontend:* React + Tailwind CSS (Hosted on Vercel).
2. *Backend:* FastAPI + PyTorch + OpenAI Triton (Hosted on Google Colab).
3. *Bridge:* Localtunnel provides a secure URI to connect the hosted UI to the ephemeral GPU backend.

## 🚀 Getting Started

Since 24/7 GPU hosting is resource-intensive, follow these steps to activate the engine:

1. *Activate GPU Backend:*
   - Open the [BioCUDA Backend Notebook](https://colab.research.google.com/drive/1irq4iQQCdyUt9q0rT-itS4XgjwORdb4q?usp=sharing).
   - Ensure the runtime is set to *T4 GPU* (Runtime > Change runtime type).
   - Run the *Immortal God Cell*.

2. *Establish Tunnel:*
   - Click the loca.lt link in the Colab output.
   - Click *"Click to Continue"* to bypass the tunnel warning.

3. *Connect and Align:*
   - Copy the tunnel URL (e.g., https://puny-kids-start.loca.lt).
   - Paste it into the *BioCUDA GPU Server URL* box on the [Live Site](https://sw-triton-engine-ui.vercel.app/).
   - Input your sequences and hit *Execute*.

## 🧪 Example Sequences

*Sequence 1:* TGTTACGG  
*Sequence 2:* GGTTGACTA

Local ![Local](assets/local.png) Global ![Global](assets/global.png)

## 📜 License

Distributed under the MIT License. See LICENSE for more information.
