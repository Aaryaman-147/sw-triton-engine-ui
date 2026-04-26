# 🧬 Smith-Waterman Triton Engine (BioCUDA-UI)

A high-performance, GPU-accelerated sequence alignment dashboard. This project utilizes OpenAI Triton to parallelize the Smith-Waterman and Needleman-Wunsch algorithms, achieving massive speedups over traditional CPU-based dynamic programming.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Demo-000000?style=for-the-badge&logo=vercel)](https://sw-triton-engine-ui.vercel.app/)
[![NVIDIA GPU Required](https://img.shields.status.io/badge/GPU-Triton_Accelerated-76b900?style=for-the-badge&logo=nvidia)](https://openai.com/blog/triton/)

## ⚡ The Compute Paradigm: Wavefront Parallelization

Traditional sequence alignment (Smith-Waterman/Needleman-Wunsch) is $O(M \times N)$ on a CPU because each cell depends on its top, left, and top-left neighbors. 

This engine implements *Wavefront Parallelization. By computing cells along the anti-diagonals (waves), we can calculate all independent cells in a wave simultaneously on the GPU. This reduces the time complexity to **$O(M + N - 1)$** parallel execution steps.

https://colab.research.google.com/drive/1irq4iQQCdyUt9q0rT-itS4XgjwORdb4q?usp=sharing
