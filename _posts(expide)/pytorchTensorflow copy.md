---
title: Installing Tensorflow and Pytorch with GPU/CUDA access- Question based documentation
tags: [Blog]
style: fill
color: danger
description: 
---


# Installation Process
## [Pytorch ( Easiest)](https://pytorch.org/get-started/locally/) 
Installed the following versions in Ubuntu 
1) Nvidia Driver >=535
2) Cuda 12.2 ( Global Initialization)
## 1st Method: Tensorflow (Problem Starts when installing Tensorflow)
1) Above mentioned nvidia drivers
2) Above mentioned Global Cuda 12.2 Version 
3) Cudnn installed 8.9 ([`Install compatible Cudnn`](https://docs.nvidia.com/deeplearning/cudnn/support-matrix/index.html) | [`Verify Cudnn version`](https://gist.github.com/Jongbhin/ad9aac8369751dbd84ca6a266a507bc7))
4) Followed by, `python3 -m pip install tensorflow[and-cuda]`. This will work just fine but GPU can't be accessed. `tf.config.get_visible_devices()`

- Bazel 6.1.0 Installed
- Clang 16.0 Installed
- TensorRT ( didn't specify)
- Installation Version Pair for all the components can be found [here](https://www. tensorflow.org/install/source#gpu).
- tensorflow ([Got stuck in this same issue](https:// github.com/tensorflow/tensorflow/issues/53543))



### 3rd Method: Purged Nvidia & Cuda | Restarted
sudo apt-get purge nvidia*
sudo apt-get autoclean
sudo apt-get autoremove
sudo rm -rf /usr/local/cuda*
sudo apt-get --purge remove "*cublas*" "*cufft*" "*curand*"  "*cusolver*" "*cusparse*" "*npp*" "*nvjpeg*" "cuda*" "nsight*"
sudo apt-get --purge remove "*nvidia*"
sudo rm -rf /etc/apt/sources.list.d/cuda-ubuntu2004-*

- Driver 535 Applied in Update Sources Tab
- Installed Cuda 11.8
- Installed Tensorflow and cuda using `python3 -m pip install tensorflow[and-cuda]` and reboot
- Nvidia Driver automatically switched to Driver 520 Open Proprietary after reboot
- Tensorflow GPU was accessible ([Downside is that Driver is too old for Pytorch](https://discuss.pytorch.org/t/userwarning-cuda-initialization-the-nvidia-driver-on-your-system-is-too-old-found-version-10010/141547/4)) So, now pytorch can't access the GPU

#### Log data of 3RD method

Using NVIDIA driver metapackage  from nvidia-driver-520 (proprietary)
| NVIDIA-SMI 520.61.05    Driver Version: 520.61.05    CUDA Version: 11.8     |
LOG of cuda_version: (for working tensorflow - 
{
   "cuda" : {
      "name" : "CUDA SDK",
      "version" : "11.8.0"
   },
   "cuda_cccl" : {
      "name" : "CUDA C++ Core Compute Libraries",
      "version" : "11.8.89"
   },
   "cuda_cudart" : {
      "name" : "CUDA Runtime (cudart)",
      "version" : "11.8.89"
   },
   "cuda_cuobjdump" : {
      "name" : "cuobjdump",
      "version" : "11.8.86"
   },
   "cuda_cupti" : {
      "name" : "CUPTI",
      "version" : "11.8.87"
   },
   "cuda_cuxxfilt" : {
      "name" : "CUDA cu++ filt",
      "version" : "11.8.86"
   },
   "cuda_demo_suite" : {
      "name" : "CUDA Demo Suite",
      "version" : "11.8.86"
   },
   "cuda_gdb" : {
      "name" : "CUDA GDB",
      "version" : "11.8.86"
   },
   "cuda_memcheck" : {
      "name" : "CUDA Memcheck",
      "version" : "11.8.86"
   },
   "cuda_nsight" : {
      "name" : "Nsight Eclipse Plugins",
      "version" : "11.8.86"
   },
   "cuda_nvcc" : {
      "name" : "CUDA NVCC",
      "version" : "11.8.89"
   },
   "cuda_nvdisasm" : {
      "name" : "CUDA nvdisasm",
      "version" : "11.8.86"
   },
   "cuda_nvml_dev" : {
      "name" : "CUDA NVML Headers",
      "version" : "11.8.86"
   },
   "cuda_nvprof" : {
      "name" : "CUDA nvprof",
      "version" : "11.8.87"
   },
   "cuda_nvprune" : {
      "name" : "CUDA nvprune",
      "version" : "11.8.86"
   },
   "cuda_nvrtc" : {
      "name" : "CUDA NVRTC",
      "version" : "11.8.89"
   },
   "cuda_nvtx" : {
      "name" : "CUDA NVTX",
      "version" : "11.8.86"
   },
   "cuda_nvvp" : {
      "name" : "CUDA NVVP",
      "version" : "11.8.87"
   },
   "cuda_sanitizer_api" : {
      "name" : "CUDA Compute Sanitizer API",
      "version" : "11.8.86"
   },
   "fabricmanager" : {
      "name" : "Fabric Manager",
      "version" : "520.61.05"
   },
   "libcublas" : {
      "name" : "CUDA cuBLAS",
      "version" : "11.11.3.6"
   },
   "libcufft" : {
      "name" : "CUDA cuFFT",
      "version" : "10.9.0.58"
   },
   "libcufile" : {
      "name" : "GPUDirect Storage (cufile)",
      "version" : "1.4.0.31"
   },
   "libcurand" : {
      "name" : "CUDA cuRAND",
      "version" : "10.3.0.86"
   },
   "libcusolver" : {
      "name" : "CUDA cuSOLVER",
      "version" : "11.4.1.48"
   },
   "libcusparse" : {
      "name" : "CUDA cuSPARSE",
      "version" : "11.7.5.86"
   },
   "libnpp" : {
      "name" : "CUDA NPP",
      "version" : "11.8.0.86"
   },
   "libnvidia_nscq" : {
      "name" : "NvSwitch Library",
      "version" : "520.61.05"
   },
   "libnvjpeg" : {
      "name" : "CUDA nvJPEG",
      "version" : "11.9.0.86"
   },
   "nsight_compute" : {
      "name" : "Nsight Compute",
      "version" : "2022.3.0.22"
   },
   "nsight_systems" : {
      "name" : "Nsight Systems",
      "version" : "2022.4.2.1"
   },
   "nvidia_driver" : {
      "name" : "NVIDIA Linux Driver",
      "version" : "520.61.05"
   },
   "nvidia_fs" : {
      "name" : "NVIDIA file-system",
      "version" : "2.13.5"
   }
}

```

### System requirements
- Ubuntu 20.04 (Budgie Flavour)
- Nvidia GeForce 3060 

### Learnables
- Often people suggest to use `nvcc -V` for checking cuda versions but `sudo apt-get nvidia-cuda-toolkit` is the only way to access the nvcc but the cuda version 10.1.243 gets installed with it which acted as a conflict in Tensorflow build from source. [Only install Nvidia Cuda Toolkit from this attached site.](https://developer.nvidia.com/cuda-toolkit) and `nvcc -V` won't work but that's fine instead of having conflicting global cuda versions
- 

# Working GPU accessible Pytorch and Tensorflow environment: Conda

Prequisties: Purge all Cuda and Nvidia as done before.

Create Conda environment for pytorch and tensorflow separately and install specific cuda environemnt.

- Applied Nvidia 535 Drivers for Pytorch compatiblity. As Nvidia 520 Drivers are too old.

### Pytorch
- Created a new conda environemnt and installed the necessary requirement with Cuda 12.2 by following this [link](https://pytorch.org/get-started/locally/). When I installed it looks as done as shown below.
```
conda install pytorch torchvision torchaudio pytorch-cuda=12.1 -c pytorch -c nvidia
```
- After Installation, you can notice that `whereis cuda` will display none, as no Globally installed Cuda is available.

### Tensorflow
- Created a new conda environemnt and installed the necessary requirement using the [following link](https://discuss.tensorflow.org/t/tensorflow-2-13-0-does-not-find-gpu-with-cuda-12-1/18939/13).
```
conda create -n tf39 python=3.9.*
conda activate tf39
conda install -c conda-forge cudatoolkit=11.8.*
pip install nvidia-cudnn-cu11
pip install tensorflow==2.10.*
```
- As you can see Cuda 11 is being used inside an cuda environment thus not conflicting the Pytorch environment.
- Reboot the system and you are good to go.

## Test GPU access 
### Pytorch
```
python3 -c "import torch; torch.cuda.is_available()"
```

### Tensorflow
```
python3 -c "import os; os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'; import tensorflow as tf; print('Num GPUs Available: ', len(tf.config.list_physical_devices('GPU')))"
```
Simple command would be as show below
```
python3 -c "import tensorflow as tf; tf.config.get_visible_devices()"

```