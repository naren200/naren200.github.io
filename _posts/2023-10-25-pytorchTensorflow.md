---
title: Installing Tensorflow and Pytorch with GPU access 
tags: [Blog]
# style: 
color: secondary
description: Covered installation methods to ensure that PyTorch and TensorFlow can coexist on your Ubuntu system with GPU acceleration
---


# Installing PyTorch and TensorFlow on Ubuntu for GPU Acceleration

If you're looking to set up PyTorch and TensorFlow on an Ubuntu system with GPU acceleration, this guide will walk you through the installation process. We'll cover the key components and potential issues you might encounter, along with solutions. Please note that this guide is current as of my last knowledge update in October 2023, and there may have been updates or changes since then. Let's get started!

## Prerequisites

Before we dive into the installation steps, make sure you have the following prerequisites:

- Ubuntu 20.04 (Budgie Flavour)
- Nvidia GeForce 3060

## 1st Method: Installing PyTorch and TensorFlow Separately

### Installing PyTorch

 - Install Nvidia Drivers: Ensure your Nvidia driver version is at least 535 for compatibility with PyTorch. 

 - Install Global CUDA 12.2: Make sure to install CUDA 12.2 globally. 

 - Install CuDNN: Install CuDNN version 8.9. You can check compatibility on the <a href="https://docs.nvidia.com/deeplearning/cudnn/support-matrix/index.html">NVIDIA CuDNN Support Matrix</a> 

 - Install PyTorch:  You can install PyTorch with the appropriate CUDA version using the following command: 

   ```bash
   conda install pytorch torchvision torchaudio pytorch-cuda=12.2 -c pytorch -c nvidia
   ```

### Installing TensorFlow

 - Install Nvidia Drivers and Global CUDA: Follow the same steps as mentioned for PyTorch. 

 - Install TensorFlow with CUDA: Install TensorFlow with GPU support using pip: 

   ```bash
   python3 -m pip install tensorflow[and-cuda]
   ```

 - Verify GPU Access: You can check if TensorFlow can access the GPU using:  

   ```python
   import tensorflow as tf
   print('Num GPUs Available: ', len(tf.config.list_physical_devices('GPU')))
   ```

## 2nd Method: Troubleshooting Conflicts

If you face issues with conflicting GPU driver versions between PyTorch and TensorFlow, consider the following method:

 - Purge Nvidia and CUDA: Remove existing Nvidia drivers, CUDA installations, and related libraries. 


   ```bash
   sudo apt-get purge nvidia*
   sudo apt-get autoclean
   sudo apt-get autoremove
   sudo rm -rf /usr/local/cuda*
   sudo apt-get --purge remove "*cublas*" "*cufft*" "*curand*" "*cusolver*" "*cusparse*" "*npp*" "*nvjpeg*" "cuda*" "nsight*"
   sudo apt-get --purge remove "*nvidia*"
   sudo rm -rf /etc/apt/sources.list.d/cuda-ubuntu2004-*
   ```

 - Install Compatible Versions: Reinstall Nvidia drivers (version 535) and CUDA (11.8) to match PyTorch's requirements. 

 - Install TensorFlow: After installing the compatible Nvidia drivers and CUDA, you can install TensorFlow with GPU support using pip. 

 - Verify GPU Access: Check if TensorFlow can access the GPU as mentioned earlier. 

## Learnables

 - When checking CUDA versions, use `sudo apt-get nvidia-cuda-toolkit` for CUDA installation rather than relying on `nvcc -V`. 
 - Avoid conflicting global CUDA versions by installing CUDA Toolkit directly from the <a href="https://developer.nvidia.com/cuda-toolkit">NVIDIA website</a> 

## 3rd Method: Working GPU-Accessible Environments with Conda

To ensure both PyTorch and TensorFlow coexist peacefully, create separate Conda environments for each with specific CUDA environments.

### For PyTorch:

1. Create a new Conda environment:

   ```bash
   conda create -n pytorch_env
   ```

2. Activate the environment:

   ```bash
   conda activate pytorch_env
   ```

3. Install PyTorch with CUDA 12.2:

   ```bash
   conda install pytorch torchvision torchaudio pytorch-cuda=12.2 -c pytorch -c nvidia
   ```

### For TensorFlow:

1. Create a new Conda environment:

   ```bash
   conda create -n tensorflow_env
   ```

2. Activate the environment:

   ```bash
   conda activate tensorflow_env
   ```

3. Install TensorFlow with CUDA 11.8:

   ```bash
   conda install -c conda-forge cudatoolkit=11.8
   pip install nvidia-cudnn-cu11
   pip install tensorflow==2.10.*
   ```

After the installations, reboot your system, and you should have both PyTorch and TensorFlow working without conflicts.

## Testing GPU Access

To verify GPU access in your PyTorch and TensorFlow environments, you can use the following commands:

### PyTorch:

```python
python3 -c "import torch; torch.cuda.is_available()"
```

### TensorFlow:

```python
python3 -c "import os; os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'; import tensorflow as tf; print('Num GPUs Available: ', len(tf.config.list_physical_devices('GPU')))"
```

In this guide, we've covered different installation methods to ensure that PyTorch and TensorFlow can coexist on your Ubuntu system with GPU acceleration. Creating separate Conda environments for these libraries is a reliable way to avoid version conflicts and ensure both frameworks work seamlessly. Happy deep learning!