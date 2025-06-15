// Dynamic LLM Chat with Gemma 3 1B - Three User Types
console.log('webllm-chat.js: Starting import of WebLLM...');
import * as webllm from "https://esm.run/@mlc-ai/web-llm";
console.log('webllm-chat.js: WebLLM imported successfully:', webllm);

// Utility function to create a safe copy of chatState for localStorage
function createSafeChatState() {
  if (!window.chatState) return {};
  return {
    initialized: window.chatState.initialized,
    isOpen: window.chatState.isOpen,
    isProcessing: window.chatState.isProcessing,
    lastResponse: window.chatState.lastResponse,
    miniMode: window.chatState.miniMode
    // Intentionally exclude 'manager' to avoid circular references
  };
}

// Utility function to safely save chatState to localStorage
function saveChatState() {
  try {
    const safeState = createSafeChatState();
    localStorage.setItem('chatState', JSON.stringify(safeState));
  } catch (error) {
    console.warn('Failed to save chat state:', error);
  }
}

// Load comprehensive context data
let narenContext = null;

// Load context from JSON file
async function loadContext() {
  try {
    const response = await fetch('/assets/js/naren-context.json');
    narenContext = await response.json();
    console.log('Context loaded successfully');
  } catch (error) {
    console.error('Failed to load context:', error);
    // Fallback context
    narenContext = {
      profile: {
        name: "Narendhiran Saravanane (Naren)",
        current_status: "Recent M.S. Robotics graduate from Arizona State University (2024)",
        contact: {
          email: "narendhiran2000@gmail.com",
          linkedin: "linkedin.com/in/narendhiran2000"
        }
      }
    };
  }
}

// User classification system
const userClassification = {
  recruiter: {
    keywords: ["hire", "hiring", "position", "job", "opportunity", "candidate", "recruit", "salary", "compensation", "available", "resume", "cv"],
    greeting_prompt: "A recruiter just opened chat. Give a professional welcome introducing yourself as Naren, highlighting your robotics engineering background and asking what role they're hiring for. Keep it under 80 words.",
    persona: "professional_showcase"
  },
  colleague: {
    keywords: ["robotics", "ROS", "research", "technical", "developer", "algorithm", "autonomous", "navigation", "sensor", "simulation", "gazebo", "carla"],
    greeting_prompt: "A fellow robotics engineer just opened chat. Give a friendly technical welcome as Naren, mentioning your ROS2 expertise and asking what robotics topic interests them. Keep it under 80 words.",
    persona: "technical_peer"
  },
  explorer: {
    keywords: ["about", "projects", "portfolio", "curious", "hello", "hi", "tell me", "background", "experience", "learn"],
    greeting_prompt: "A general visitor just opened chat. Give a warm welcome as Naren, briefly introducing your robotics background and asking what they'd like to know. Keep it under 80 words.",
    persona: "friendly_guide"
  }
};

// Dynamic Chat Manager with User Classification
class DynamicChatManager {
  constructor() {
    this.initialized = false;
    this.messages = [];
    this.isProcessing = false;
    this.engine = null;
    this.userType = 'explorer'; // default
    this.conversationStarted = false;
    this.thinkingMessages = [
      "Feel free to explore my portfolio while I'm thinking... 🤔",
      "Browse through my projects while I craft a response! 🚀",
      "Check out my experience section while I'm processing... 💭",
      "Take a look at my skills while I think about your question! 🧠",
      "Explore my research work while I'm formulating an answer... 📚",
      "Navigate through the site while I'm working on this! 🔍",
      "Discover my robotics projects while I think... 🤖",
      "Browse my achievements while I prepare a response! 🏆"
    ];
    this.currentThinkingInterval = null;
    this.notificationSound = null;
    this.setupNotificationSound();
  }
  
  // Create system prompts for different user types
  createSystemPrompt(userType) {
    if (!narenContext) {
      console.warn('Context not loaded, using fallback');
      return this.createFallbackPrompt(userType);
    }

    const basePrompt = `You are Narendhiran Saravanane (Naren), a robotics engineer chatting on your portfolio website.

BACKGROUND:
- ${narenContext.profile.current_status}
- Former ${narenContext.experience.current.title} at ${narenContext.experience.current.company} (${narenContext.experience.current.duration})
- Expert in ROS2 (${narenContext.skills.robotics.ROS_ROS2}), autonomous systems, AI/ML integration
- Published research in IEEE Control Systems Society (multi-agent systems)
- ${narenContext.education.bachelors.degree} from ${narenContext.education.bachelors.institution}
- e-Yantra national finalist (99.7 percentile)

KEY SKILLS:
- Programming: Python (${narenContext.skills.programming.Python}), C/C++ (${narenContext.skills.programming["C/C++"]}), MATLAB (${narenContext.skills.programming.MATLAB})
- Robotics: ROS/ROS2 (${narenContext.skills.robotics.ROS_ROS2}), Gazebo (${narenContext.skills.robotics.Gazebo}), autonomous navigation, sensor fusion
- AI/ML: TensorFlow (${narenContext.skills.ai_ml.TensorFlow}), PyTorch (${narenContext.skills.ai_ml.PyTorch}), computer vision, LLM integration
- Hardware: Embedded systems (${narenContext.skills.hardware.Embedded_Systems}), GPS/sensor integration, motor control

NOTABLE PROJECTS:
- ${narenContext.projects.featured[0].name}: ${narenContext.projects.featured[0].description}
- ${narenContext.projects.featured[1].name}: ${narenContext.projects.featured[1].description}
- ${narenContext.projects.featured[2].name}: ${narenContext.projects.featured[2].description}

CONTACT: ${narenContext.profile.contact.email}, LinkedIn: ${narenContext.profile.contact.linkedin}

AVAILABILITY: ${narenContext.availability.status}, ${narenContext.availability.start_date}`;

    const personas = {
      professional_showcase: `
PERSONA: Professional but approachable recruiter conversation
- Focus on experience relevance, technical fit, availability
- Provide specific examples and achievements
- Ask about role requirements and team challenges
- Show enthusiasm for opportunities
- Keep responses focused and results-oriented`,

      technical_peer: `
PERSONA: Technical colleague discussion
- Dive deep into technical details when appropriate
- Share insights from research and practical experience
- Ask technical questions to understand their work
- Discuss challenges, solutions, and best practices
- Be collaborative and knowledge-sharing focused`,

      friendly_guide: `
PERSONA: Friendly portfolio guide
- Be welcoming and help them explore your background
- Adapt to their interests (technical, professional, or casual)
- Provide overviews that can lead to deeper discussion
- Ask what specifically interests them
- Be conversational and engaging`
    };

    return basePrompt + personas[userClassification[userType].persona];
  }
  
  createFallbackPrompt(userType) {
    const fallbackPrompt = `You are Narendhiran Saravanane (Naren), a robotics engineer chatting on your portfolio website.

BACKGROUND:
- Recent M.S. Robotics graduate from Arizona State University (2024)
- Former Robotics Software Engineer at Padma Agrobotics
- Expert in ROS2, autonomous systems, AI/ML integration
- Published research in multi-agent systems
- Looking for robotics and AI engineering opportunities

CONTACT: narendhiran2000@gmail.com, LinkedIn: narendhiran2000`;

    const personas = {
      professional_showcase: "\nPERSONA: Professional recruiter conversation focused on experience and opportunities.",
      technical_peer: "\nPERSONA: Technical colleague discussion about robotics and research.",
      friendly_guide: "\nPERSONA: Friendly portfolio guide helping visitors explore background."
    };

    return fallbackPrompt + personas[userClassification[userType].persona];
  }
  
  async initialize() {
    console.log('DynamicChatManager: Starting initialization...');
    if (this.initialized) {
      console.log('DynamicChatManager: Already initialized, skipping...');
      return;
    }
    
    try {
      // Load context data first
      console.log('DynamicChatManager: Loading context data...');
      this.updateLoadingStage('Loading Profile Data', 'Fetching Naren\'s background information and context...');
      await loadContext();
      console.log('DynamicChatManager: Context data loaded successfully');
      
      // Load the WebLLM model with detailed progress
      console.log('DynamicChatManager: Starting WebLLM initialization...');
      await this.loadWebLLM();
      console.log('DynamicChatManager: WebLLM loaded successfully');
      
      // Finalize initialization
      this.updateLoadingStage('Ready to Chat!', 'AI model loaded successfully. You can now start chatting.');
      this.updateProgress(100);
      
      this.initialized = true;
      console.log('DynamicChatManager: Initialization completed successfully');
      
      // Small delay to show completion
      setTimeout(() => {
        this.hideLoading();
        this.enableInput();
        // Start with initial classification conversation
        this.startInitialConversation();
      }, 1000);
      
    } catch (error) {
      console.error('DynamicChatManager: Failed to initialize chat:', error);
      console.error('Initialization error details:', {
        message: error.message,
        stack: error.stack,
        contextLoaded: !!narenContext,
        webllmAvailable: !!webllm,
        engineStatus: this.engine ? 'Created' : 'Not Created'
      });
      
      // Show detailed error in UI
      const errorMessage = `❌ **Chat Initialization Failed**\n\nError: ${error.message}\n\nThis could be due to:\n- Browser compatibility issues\n- Network connectivity problems\n- WebLLM model loading failure\n\nPlease check the browser console for detailed logs and try refreshing the page.`;
      
      this.showError(errorMessage);
      
      // Also add an error message to the chat
      setTimeout(() => {
        this.addMessage({
          role: 'assistant',
          content: errorMessage
        });
      }, 1000);
    }
  }
  
  async loadWebLLM() {
    try {
      console.log('loadWebLLM: Starting WebLLM engine creation...');
      this.updateLoadingStage('Initializing AI Model', 'Fetching model configuration and preparing download...');
      
      // Check if webllm is available
      if (!webllm || !webllm.CreateMLCEngine) {
        throw new Error('WebLLM library not loaded properly. Please refresh the page.');
      }
      
      // Use Llama 3.2 1B model with correct WebLLM model ID
      console.log('loadWebLLM: Creating MLC Engine with Llama-3.2-1B-Instruct-q4f16_1-MLC...');
      this.engine = await webllm.CreateMLCEngine(
        "Llama-3.2-1B-Instruct-q4f16_1-MLC", // Correct WebLLM model ID
        {
          initProgressCallback: (report) => {
            // Detailed progress reporting based on WebLLM stages
            const progress = Math.round(report.progress * 100);
            let stage = 'Loading AI Model';
            let details = '';
            
            console.log(`loadWebLLM: Progress update - ${progress}% - Report:`, report);
            
            if (progress < 10) {
              stage = 'Fetching Model Data';
              details = 'Downloading model configuration and metadata...';
            } else if (progress < 30) {
              stage = 'Downloading Model';
              details = 'Downloading AI model files from server...';
            } else if (progress < 70) {
              stage = 'Caching Model';
              details = 'Caching model data locally for faster future access...';
            } else if (progress < 95) {
              stage = 'Initializing Model';
              details = 'Loading model into memory and preparing for chat...';
            } else {
              stage = 'Finalizing Setup';
              details = 'Completing initialization and setting up chat interface...';
            }
            
            console.log(`loadWebLLM: Stage - ${stage}: ${details}`);
            this.updateLoadingStage(stage, details);
            this.updateProgress(progress);
          }
        }
      );
      
      console.log('loadWebLLM: WebLLM AI model engine initialized successfully');
      
      // Test the engine with a simple message
      console.log('loadWebLLM: Testing engine with simple message...');
      const testResponse = await this.engine.chat.completions.create({
        messages: [{ role: "user", content: "Say hello" }],
        temperature: 0.7,
        max_tokens: 10
      });
      console.log('loadWebLLM: Engine test successful:', testResponse);
      
    } catch (error) {
      console.error('loadWebLLM: WebLLM loading error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        webllmAvailable: !!webllm,
        createMLCEngineAvailable: !!(webllm && webllm.CreateMLCEngine)
      });
      
      this.updateLoadingStage('❌ Error Loading Model', `Failed to load AI model: ${error.message}. Check console for details.`);
      
      // Show the error in the UI
      this.showError(`AI Model Loading Failed: ${error.message}`);
      
      throw new Error(`Failed to load AI model: ${error.message}`);
    }
  }
  
  async startInitialConversation() {
    // Start with a general welcome and let user input determine type
    const generalWelcome = {
      role: 'assistant',
      content: `Hi there! 👋 I'm Naren, a robotics engineer with expertise in ROS2, autonomous systems, and AI integration.

I recently completed my M.S. in Robotics at Arizona State University and worked as a Robotics Software Engineer at Padma Agrobotics.

What brings you to my portfolio today?`
    };
    
    this.addMessage(generalWelcome);
    this.messages.push(generalWelcome);
  }
  
  classifyUserType(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for recruiter keywords
    for (const keyword of userClassification.recruiter.keywords) {
      if (lowerMessage.includes(keyword)) {
        return 'recruiter';
      }
    }
    
    // Check for technical colleague keywords
    for (const keyword of userClassification.colleague.keywords) {
      if (lowerMessage.includes(keyword)) {
        return 'colleague';
      }
    }
    
    // Default to explorer
    return 'explorer';
  }
  
  async generateDynamicGreeting(userType) {
    try {
      const greetingPrompt = userClassification[userType].greeting_prompt;
      const systemPrompt = this.createSystemPrompt(userType);
      
      const response = await this.engine.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: greetingPrompt }
        ],
        temperature: 0.8,
        max_tokens: 100
      });
      
      return response.choices[0].message.content;
      
    } catch (error) {
      console.error('Greeting generation error:', error);
      // Fallback greetings
      const fallbacks = {
        recruiter: "Thanks for your interest! I'm actively seeking robotics engineering opportunities. What role are you looking to fill?",
        colleague: "Great to meet a fellow robotics enthusiast! What aspect of robotics are you working on?",
        explorer: "Thanks for visiting! Feel free to ask me anything about my projects, experience, or robotics background."
      };
      return fallbacks[userType];
    }
  }
  
  async sendMessage() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const message = input.value.trim();
    
    if (!message || this.isProcessing) return;
    
    console.log('sendMessage: Processing message:', message);
    
    // Add error display helper
    const showErrorMessage = (errorMsg) => {
      this.addMessage({ 
        role: 'assistant', 
        content: `❌ **Error**: ${errorMsg}\n\nPlease check the browser console for more details. You can also try refreshing the page.` 
      });
      console.error('Chat Error:', errorMsg);
    };
    
    // Set processing state and disable inputs
    this.isProcessing = true;
    input.disabled = true;
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';
    
    // Add user message
    this.addMessage({ role: 'user', content: message });
    input.value = '';
    
    // Update global state
    if (window.chatState) {
      window.chatState.isProcessing = true;
      // Create a safe copy without circular references for localStorage
      const safeState = {
        initialized: window.chatState.initialized,
        isOpen: window.chatState.isOpen,
        isProcessing: window.chatState.isProcessing,
        lastResponse: window.chatState.lastResponse,
        miniMode: window.chatState.miniMode
        // Intentionally exclude 'manager' to avoid circular references
      };
      try {
        localStorage.setItem('chatState', JSON.stringify(safeState));
      } catch (error) {
        console.warn('Failed to save chat state to localStorage:', error);
      }
    }
    
    try {
      // Classify user type on first message
      if (!this.conversationStarted) {
        this.userType = this.classifyUserType(message);
        this.conversationStarted = true;
        console.log('sendMessage: User classified as:', this.userType);
        
        // Generate personalized greeting based on classification
        this.showTyping();
        
        try {
          console.log('sendMessage: Generating dynamic greeting...');
          const greeting = await this.generateDynamicGreeting(this.userType);
          this.hideTyping();
          this.addMessage({ role: 'assistant', content: greeting });
          this.messages.push({ role: 'assistant', content: greeting });
          console.log('sendMessage: Dynamic greeting generated successfully');
        } catch (error) {
          console.error('sendMessage: Greeting error:', error);
          this.hideTyping();
          showErrorMessage(`Failed to generate greeting: ${error.message || error}`);
        }
      }
      
      // Process the actual message
      this.showTyping();
      
      console.log('sendMessage: Processing user message with AI...');
      
      // Check if engine is available before processing
      if (!this.engine) {
        throw new Error('AI engine not initialized. Please refresh the page and try again.');
      }
      
      const response = await this.processUserMessage(message);
      console.log('sendMessage: AI response received:', response.substring(0, 100) + '...');
      this.hideTyping();
      this.addMessage({ role: 'assistant', content: response });
      
    } catch (error) {
      console.error('sendMessage: Processing error:', error);
      this.hideTyping();
      showErrorMessage(`Failed to process message: ${error.message || error}`);
    } finally {
      // Always re-enable input, regardless of success or failure
      this.isProcessing = false;
      input.disabled = false;
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send';
      
      // Update global state
      if (window.chatState) {
        window.chatState.isProcessing = false;
        // Create a safe copy without circular references for localStorage
        const safeState = {
          initialized: window.chatState.initialized,
          isOpen: window.chatState.isOpen,
          isProcessing: window.chatState.isProcessing,
          lastResponse: window.chatState.lastResponse,
          miniMode: window.chatState.miniMode
          // Intentionally exclude 'manager' to avoid circular references
        };
        try {
          localStorage.setItem('chatState', JSON.stringify(safeState));
        } catch (error) {
          console.warn('Failed to save chat state to localStorage:', error);
        }
      }
    }
  }
  
  async processUserMessage(message) {
    try {
      console.log('processUserMessage: Starting AI processing...');
      
      // Update thinking message to show we're generating
      this.updateThinkingMessage('🧠 Analyzing your message...');
      
      // Add user message to conversation history
      this.messages.push({ role: "user", content: message });
      
      // Create conversation context with appropriate system prompt
      const systemPrompt = this.createSystemPrompt(this.userType);
      const conversation = [
        { role: "system", content: systemPrompt },
        ...this.messages
      ];
      
      console.log('processUserMessage: Sending to AI model...');
      this.updateThinkingMessage('🤖 Generating response...');
      
      // Get AI response using WebLLM
      const response = await this.engine.chat.completions.create({
        messages: conversation,
        temperature: 0.7,
        max_tokens: 400,
        stream: false
      });
      
      const aiResponse = response.choices[0].message.content;
      console.log('processUserMessage: AI response generated successfully');
      
      // Add AI response to conversation history
      this.messages.push({ role: "assistant", content: aiResponse });
      
      return aiResponse;
      
    } catch (error) {
      console.error('processUserMessage: AI processing error:', error);
      
      // Log detailed error information
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        engineStatus: this.engine ? 'Initialized' : 'Not Initialized',
        messagesLength: this.messages.length,
        userType: this.userType
      });
      
      return `❌ **Processing Error**: ${error.message || error}\n\nDetailed error logged to console. This could be due to:\n- Model not fully loaded\n- Network connectivity\n- Browser compatibility\n\nPlease check the browser console and try refreshing.\n\n📧 narendhiran2000@gmail.com\n🔗 linkedin.com/in/narendhiran2000`;
    }
  }
  
  updateLoadingStage(stage, details) {
    const loadingStage = document.getElementById('loading-stage');
    const loadingDetails = document.getElementById('loading-details');
    
    if (loadingStage) {
      loadingStage.textContent = stage;
    }
    if (loadingDetails) {
      loadingDetails.textContent = details;
    }
  }
  
  updateProgress(percentage) {
    const progressContainer = document.getElementById('progress-container');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressContainer && percentage > 0) {
      progressContainer.style.display = 'block';
    }
    
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText) {
      progressText.textContent = `${percentage}%`;
    }
  }
  
  updateLoadingMessage(message) {
    // Fallback method for backward compatibility
    this.updateLoadingStage('Loading...', message);
  }
  
  hideLoading() {
    const loadingMsg = document.getElementById('loading-message');
    if (loadingMsg) {
      loadingMsg.style.display = 'none';
    }
  }
  
  enableInput() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    input.disabled = false;
    sendBtn.disabled = false;
    
    // Add event listeners
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !this.isProcessing) {
        this.sendMessage();
      }
    });
    
    sendBtn.addEventListener('click', () => {
      if (!this.isProcessing) {
        this.sendMessage();
      }
    });
  }
  
  showTyping() {
    const messagesContainer = document.getElementById('chat-messages');
    
    // Remove any existing typing indicators
    const existingTyping = document.querySelector('.typing-message');
    if (existingTyping) {
      existingTyping.remove();
    }
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant-message typing-message';
    typingDiv.id = 'current-typing-message';
    
    // Get random encouraging message
    const randomMessage = this.thinkingMessages[Math.floor(Math.random() * this.thinkingMessages.length)];
    
    typingDiv.innerHTML = `
      <div class="thinking-message">
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
        <div class="thinking-text">🤖 Naren is thinking...</div>
        <div class="browse-suggestion" id="browse-suggestion">${randomMessage}</div>
      </div>
    `;
    
    // Add with fade-in animation
    typingDiv.style.opacity = '0';
    typingDiv.style.transform = 'translateY(10px)';
    typingDiv.style.transition = 'all 0.3s ease';
    
    messagesContainer.appendChild(typingDiv);
    
    // Trigger animation
    setTimeout(() => {
      typingDiv.style.opacity = '1';
      typingDiv.style.transform = 'translateY(0)';
    }, 50);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Start rotating encouraging messages
    this.startThinkingMessageRotation();
    
    console.log('showTyping: Thinking indicator displayed');
  }
  
  hideTyping() {
    const typingMessage = document.querySelector('.typing-message');
    if (typingMessage) {
      typingMessage.remove();
    }
    
    // Stop rotating messages
    if (this.currentThinkingInterval) {
      clearInterval(this.currentThinkingInterval);
      this.currentThinkingInterval = null;
    }
    
    // Update global state
    if (window.chatState) {
      window.chatState.isProcessing = false;
      // Create a safe copy without circular references for localStorage
      const safeState = {
        initialized: window.chatState.initialized,
        isOpen: window.chatState.isOpen,
        isProcessing: window.chatState.isProcessing,
        lastResponse: window.chatState.lastResponse,
        miniMode: window.chatState.miniMode
        // Intentionally exclude 'manager' to avoid circular references
      };
      try {
        localStorage.setItem('chatState', JSON.stringify(safeState));
      } catch (error) {
        console.warn('Failed to save chat state to localStorage:', error);
      }
    }
    
    // Play notification sound when response is ready
    this.playNotificationSound();
  }
  
  cleanMessageContent(content) {
    if (typeof content !== 'string') {
      return String(content);
    }
    
    // Remove wrapping quotes if the entire content is wrapped in quotes
    if ((content.startsWith('"') && content.endsWith('"')) || 
        (content.startsWith("'") && content.endsWith("'"))) {
      content = content.slice(1, -1);
    }
    
    // Remove any JSON string escaping
    content = content.replace(/\\"/g, '"');
    content = content.replace(/\\'/g, "'");
    content = content.replace(/\\n/g, '\n');
    content = content.replace(/\\t/g, '\t');
    content = content.replace(/\\r/g, '\r');
    content = content.replace(/\\\\/g, '\\');
    
    return content.trim();
  }
  
  addMessage(message) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.role}-message`;
    
    // Clean the message content
    let content = this.cleanMessageContent(message.content);
    
    // Convert markdown-style links to HTML
    content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    messageDiv.innerHTML = `
      <div class="message-content">
        ${content.replace(/\n/g, '<br>')}
      </div>
    `;
    
    // Add fade-in animation for new messages
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    messageDiv.style.transition = 'all 0.3s ease';
    
    messagesContainer.appendChild(messageDiv);
    
    // Trigger animation
    setTimeout(() => {
      messageDiv.style.opacity = '1';
      messageDiv.style.transform = 'translateY(0)';
    }, 10);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // If this is an assistant message and chat is not open, show mini response
    if (message.role === 'assistant' && window.chatState) {
      window.chatState.lastResponse = message.content;
      
      if (!window.chatState.isOpen && typeof showMiniResponse === 'function') {
        showMiniResponse(message.content);
      } else if (!window.chatState.isOpen && typeof showResponseReadyNotification === 'function') {
        showResponseReadyNotification();
      }
    }
  }
  
  showError(errorMessage) {
    this.updateLoadingStage('Error', errorMessage);
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) {
      progressContainer.style.display = 'none';
    }
    
    // Change loading message color to red for errors
    const loadingStage = document.getElementById('loading-stage');
    const loadingDetails = document.getElementById('loading-details');
    if (loadingStage) {
      loadingStage.style.color = 'red';
    }
    if (loadingDetails) {
      loadingDetails.style.color = 'red';
    }
  }
  
  setupNotificationSound() {
    // Create notification sound using Web Audio API
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      this.notificationSound = () => {
        // Resume audio context if suspended (required by some browsers)
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume().then(() => {
            this.playSound();
          });
        } else {
          this.playSound();
        }
      };
    } catch (error) {
      console.log('Audio API not supported, notification sound disabled');
      this.notificationSound = null;
    }
  }
  
  playSound() {
    try {
      // Create a pleasant notification tone
      const oscillator1 = this.audioContext.createOscillator();
      const oscillator2 = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      // Set frequencies for a pleasant chord (C and E)
      oscillator1.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
      oscillator2.frequency.setValueAtTime(659.25, this.audioContext.currentTime); // E5
      
      // Set gain (volume) - slightly louder
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
      
      // Connect nodes
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Play the sound
      oscillator1.start(this.audioContext.currentTime);
      oscillator2.start(this.audioContext.currentTime);
      oscillator1.stop(this.audioContext.currentTime + 0.8);
      oscillator2.stop(this.audioContext.currentTime + 0.8);
    } catch (error) {
      console.log('Could not create sound:', error);
    }
  }
  
  playNotificationSound() {
    if (this.notificationSound) {
      try {
        this.notificationSound();
      } catch (error) {
        console.log('Could not play notification sound:', error);
      }
    }
  }
  
  updateThinkingMessage(newMessage) {
    const thinkingText = document.querySelector('.thinking-text');
    if (thinkingText) {
      thinkingText.textContent = newMessage;
      console.log('updateThinkingMessage: Updated to:', newMessage);
    }
  }
  
  startThinkingMessageRotation() {
    let messageIndex = 0;
    this.currentThinkingInterval = setInterval(() => {
      const browseSuggestion = document.getElementById('browse-suggestion');
      if (browseSuggestion) {
        messageIndex = (messageIndex + 1) % this.thinkingMessages.length;
        browseSuggestion.style.opacity = '0';
        setTimeout(() => {
          browseSuggestion.textContent = this.thinkingMessages[messageIndex];
          browseSuggestion.style.opacity = '1';
        }, 200);
      }
    }, 3000); // Change message every 3 seconds
  }
}

// Message styles
const messageStyles = `
<style>
.message {
  margin-bottom: 15px;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  margin-left: auto;
}

.user-message .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 18px 18px 4px 18px;
  font-size: 14px;
}

.assistant-message .message-content {
  background: #f8f9fa;
  color: #333;
  padding: 16px;
  border-radius: 18px 18px 18px 4px;
  font-size: 14px;
  line-height: 1.5;
  border-left: 4px solid #667eea;
}

.assistant-message .message-content a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.assistant-message .message-content a:hover {
  text-decoration: underline;
}

.typing-message {
  align-self: flex-start;
  max-width: 90%;
}

.typing-message .thinking-message {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  border-left: 4px solid #667eea;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.typing-message .typing-indicator {
  display: inline-block;
  margin-bottom: 10px;
}

.typing-message .typing-indicator span {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0 3px;
  animation: thinkingBounce 1.6s infinite ease-in-out;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.typing-message .typing-indicator span:nth-child(2) {
  animation-delay: 0.3s;
}

.typing-message .typing-indicator span:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes thinkingBounce {
  0%, 80%, 100% { 
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
  40% { 
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
}

.typing-message .thinking-text {
  color: #667eea;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 10px;
  animation: thinkingPulse 2s infinite;
}

.typing-message .browse-suggestion {
  color: #666;
  font-size: 14px;
  font-style: italic;
  margin-top: 8px;
  transition: opacity 0.3s ease;
}

@keyframes thinkingPulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
</style>
`;

// Inject message styles
document.head.insertAdjacentHTML('beforeend', messageStyles);

// Initialize chat when this script loads
window.startRecruiterChat = function() {
  console.log('startRecruiterChat: Function called, creating DynamicChatManager...');
  const chatManager = new DynamicChatManager();
  
  // Store reference in global state
  if (window.chatState) {
    window.chatState.manager = chatManager;
  }
  
  console.log('startRecruiterChat: DynamicChatManager created, calling initialize...');
  chatManager.initialize();
};

console.log('webllm-chat.js: Script loaded, startRecruiterChat function defined');