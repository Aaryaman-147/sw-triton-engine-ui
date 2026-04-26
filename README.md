# 🧬 Smith-Waterman Triton Engine (BioCUDA-UI)

A high-performance, GPU-accelerated sequence alignment dashboard. This project utilizes OpenAI Triton to parallelize the Smith-Waterman and Needleman-Wunsch algorithms, achieving massive speedups over traditional CPU-based dynamic programming.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Demo-000000?style=for-the-badge&logo=vercel)](https://sw-triton-engine-ui.vercel.app/)
[![NVIDIA GPU Required](https://img.shields.status.io/badge/GPU-Triton_Accelerated-76b900?style=for-the-badge&logo=nvidia)](https://openai.com/blog/triton/)

## ⚡ The Compute Paradigm: Wavefront Parallelization

Traditional sequence alignment (Smith-Waterman/Needleman-Wunsch) is $O(M \times N)$ on a CPU because each cell depends on its top, left, and top-left neighbors. 

This engine implements *Wavefront Parallelization. By computing cells along the anti-diagonals (waves), we can calculate all independent cells in a wave simultaneously on the GPU. This reduces the time complexity to **$O(M + N - 1)$** parallel execution steps.

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
   - Ensure the runtime is set to *GPU* (Runtime > Change runtime type).
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

## 📜 License

Distributed under the MIT License. See LICENSE for more information.
