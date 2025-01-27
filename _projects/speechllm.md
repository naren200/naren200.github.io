---
name: Speech-LLM-Speech
tools: [LLM, Docker, ROS2, Whisper.cpp, C++, TTS, GPU, Ollama]
image: ../imgs/projects/speech-llm-speech.png
is_project_page: true
description: "Modularly containerized ROS2 system that converts speech to text, processes it through multiple LLMs, and responds with synthesized speech."
---

# 🗣️ Speech-LLM-Speech: Containerized Conversational AI Pipeline

Developed an end-to-end conversational AI pipeline that processes speech input through three modular components: Automatic Speech Recognition (ASR) using Whisper.cpp, an LLM decision maker integrating OpenAI/Gemini/Ollama APIs, and text-to-speech synthesis via Google Cloud. The system leverages ROS2 for inter-node communication and Docker for seamless deployment.
*Github repo [https://github.com/naren200/speech-llm-speech](https://github.com/naren200/speech-llm-speech)*  

[![ROS2 Iron](https://img.shields.io/badge/ROS2-Iron-%230A2FF1)](https://docs.ros.org/en/iron/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker Setup](https://img.shields.io/badge/Docker-3--container%20setup-informational)](https://hub.docker.com/u/naren200)
[![3 LLM Providers](https://img.shields.io/badge/LLM_Providers-3-success)]()


<div class="mermaid">
%%{init: {'theme': 'dark', 'themeVariables': {
  'background': 'transparent',
  'primaryBorderColor': '#4FD1C550',
  'lineColor': '#4FD1C580',
  'textColor': '#FFFFFF',
  'edgeLabelBackground': '#1d27383d', 
  'edgeLabelColor': '#FFFFFF'

}}}%%
graph LR
    subgraph Docker_Network["Docker Network | ROS2 Domain"]
        direction TB
        A[["Whisper ASR<br/>(Docker Container)"]]:::asr -->|/recognized_speech| B[["Decision Maker<br/>(Docker Container)"]]:::llm
        B -->|/text_to_speak| C[["Google TTS<br/>(Docker Container)"]]:::tts
    end

    D[🎤 Audio Input]:::input --> A
    C --> E[🔈 Synthesized Speech]:::output
    
    F[[GPT-4]]:::openai -->|OpenAI API| B
    G[[Llama 2]]:::huggingface -->|Huggingface API| B
    H[[Ollama]]:::ollama -->|Local LLM| B

    classDef asr fill:#2B7A78,stroke:#38B2AC,color:#FFFFFF
    classDef llm fill:#7295d1b7,stroke:#718096,color:#FFFFFF
    classDef tts fill:#6B46c157,stroke:#9F7AEA,color:#FFFFFF
    classDef openai fill:#3182ce63,stroke:#63B3ED
    classDef huggingface fill:#38a1696e,stroke:#68D391
    classDef ollama fill:#dd6c2069,stroke:#F6AD55
    
</div>


<script> 
  // Initialize Mermaid after DOM load
  document.addEventListener('DOMContentLoaded', function() {
    mermaid.initialize({startOnLoad:true, theme:'dark'});
  });
</script>

<br>

### Technical Highlights

- **Containerized ROS2 Nodes**: Independently deployable Docker containers for ASR (C++), LLM decision maker (C++), and TTS (C++)
- **Multi-LLM Integration**: Dynamic API selection between OpenAI, HuggingFace, and local Ollama models
- **Real-Time Audio Processing**: Whisper.cpp optimization for WAV/MP3 parsing with 2.5s latency

<br>


<div class="row">
<div class="col" markdown="1">

### Key Features
- ROS2 `/recognized_speech` & `/text_to_speak` topics for modular communication
- CMake integration for Whisper.cpp with custom audio preprocessing
- Docker Compose orchestration for multi-container deployment
- GPU acceleration support via NVIDIA Container Toolkit

</div>
<div class="col" markdown="1">

### Challenges Solved
- **Whisper.cpp Integration**: Resolved CMake build issues and audio parsing challenges
- **ROS2-Docker Networking**: Configured cross-container discovery using shared ROS domains
- **LLM Response Optimization**: Implemented confidence-based API fallback mechanism
- **Audio Format Handling**: Added resampling pipeline for MP3/WAV compatibility

</div>
</div>

<br>


### Prerequisites

```bash
sudo apt install -y gnome-terminal 
```
For further instructions, follow [here](https://github.com/naren200/speech-llm-speech?tab=readme-ov-file#dependencies-installation-guide) 

### Launch Full System

```bash
git clone https://github.com/naren200/speech-llm-speech.git
cd speech-llm-speech

# Start all services
./start_all_docker.sh
```

**Demo Video**: [End-to-End System Walkthrough](https://youtu.be/7YaoBxjnQag)

## Technical Deep Dive

### Core Components

| Component | Tech Stack | Optimization |
|-----------|------------|--------------|
| **ASR** | C++17, Whisper.cpp | SIMD acceleration |
| **LLM** | Python3.9, FastAPI | Async API calls |
| **TTS** | gTTS, SoundFile | Audio buffering |


## Troubleshooting

**Common Issues**:

1. **Audio Device Permissions**:
   ```bash
   sudo usermod -aG audio $USER
   sudo reboot
   ```

2. **ROS2 Discovery**:
   ```bash
   export ROS_DOMAIN_ID=42
   export ROS_LOCALHOST_ONLY=0
   ```

**Debugging Modes**:

```bash
# Developer mode with shell access
./start_docker.sh transcribe --developer=true

# Force rebuild containers
./start_docker.sh decide --build=true
```


---


#### Reference information:

**Github Page**: [https://github.com/naren200/speech-llm-speech](https://github.com/naren200/speech-llm-speech)  
**Demo Video**: [https://youtu.be/7YaoBxjnQag](https://youtu.be/7YaoBxjnQag)  
**Docker Hub**: [https://hub.docker.com/u/naren200](https://hub.docker.com/u/naren200)



<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
