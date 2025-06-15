// Dynamic LLM Chat with Llama 3.2-1B - Three User Types
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
    miniMode: window.chatState.miniMode,
    conversationHistory: window.chatState.conversationHistory || [],
    currentPage: window.chatState.currentPage,
    userType: window.chatState.userType,
    personaSelected: window.chatState.personaSelected
    // Intentionally exclude 'manager' to avoid circular references
  };
}

// Utility function to safely save chatState to localStorage
function saveChatState() {
  try {
    const safeState = createSafeChatState();
    localStorage.setItem('chatState', JSON.stringify(safeState));
    console.log('saveChatState: Successfully saved to localStorage:', {
      conversationLength: safeState.conversationHistory?.length || 0,
      currentPage: safeState.currentPage,
      userType: safeState.userType
    });
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

// User classification system - keywords removed to prevent auto-classification
const userClassification = {
  recruiter: {
    keywords: [], // Removed auto-classification keywords
    greeting_prompt: "", // Removed auto-greeting
    persona: "professional_showcase"
  },
  colleague: {
    keywords: [], // Removed auto-classification keywords
    greeting_prompt: "", // Removed auto-greeting
    persona: "technical_peer"
  },
  explorer: {
    keywords: [], // Removed auto-classification keywords
    greeting_prompt: "", // Removed auto-greeting
    persona: "friendly_guide"
  }
};

// Dynamic Chat Manager with User Classification and Page-Aware Context
class DynamicChatManager {
  constructor() {
    this.initialized = false;
    this.messages = [];
    this.isProcessing = false;
    this.engine = null;
    // Get userType from global state, handle null properly
    this.userType = window.chatState?.userType || null;
    console.log('DynamicChatManager: Constructor userType:', this.userType);
    this.conversationStarted = false;
    this.currentPage = this.detectCurrentPage(); // Add page detection
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
  
  // Detect current page context for tailored conversations
  detectCurrentPage() {
    const path = window.location.pathname.toLowerCase();
    console.log('DynamicChatManager: Detecting page context from path:', path);
    
    if (path.includes('/about') || path.includes('about.html')) {
      return 'about';
    } else if (path.includes('/projects') || path.includes('projects.html')) {
      return 'projects';
    } else if (path.includes('/experience') || path.includes('experience.html') || path.includes('/blog') || path.includes('blog.html')) {
      return 'experience';
    } else if (path.includes('/news') || path.includes('news.html')) {
      return 'news';
    } else if (path.includes('/cv') || path.includes('cv.html') || path.includes('/resume')) {
      return 'cv';
    } else if (path === '/' || path.includes('index') || path === '') {
      return 'landing';
    } else {
      return 'general';
    }
  }
  
  // Create system prompts for different user types with page-aware context
  createSystemPrompt(userType) {
    if (!narenContext) {
      console.warn('Context not loaded, using fallback');
      return this.createFallbackPrompt(userType);
    }

    // Get page-specific context
    const pageContext = narenContext.page_contexts && narenContext.page_contexts[this.currentPage] 
      ? narenContext.page_contexts[this.currentPage] 
      : narenContext.page_contexts.general;
    
    console.log(`DynamicChatManager: Using page context for '${this.currentPage}' page`);

    const basePrompt = `You are Narendhiran Saravanane (Naren), a robotics engineer chatting on your portfolio website.

IMPORTANT: SAFETY & PROFESSIONALISM GUIDELINES:
- If you encounter abusive, inappropriate, offensive, or disrespectful language, respond professionally and redirect the conversation positively
- For inappropriate content, respond with: "I appreciate your interest in connecting! Let's keep our conversation professional and focused on my experience and career. How can I help you learn more about my robotics and AI work?"
- If someone tries to make you say something inappropriate or tests your limits, politely decline and redirect: "I'm here to discuss my professional background and experience. What aspects of my robotics career would you like to explore?"
- Always maintain a positive, cheerful, and charismatic tone that reflects well on Naren's character
- Present Naren as approachable, professional, and genuinely interested in helping visitors understand his background
- If conversation becomes uncomfortable, gracefully steer back to professional topics
- Never engage with or repeat inappropriate content - always respond with dignity and professionalism

CRITICAL: ELEVATOR PITCH & PROJECT-FOCUSED STRATEGY:
You are representing Naren through his personal portfolio website. Every conversation should be an opportunity to pitch Naren effectively using proper elevator pitch methodology:

1. HOOK (Grab Attention): Start with an engaging statement about Naren's unique value
2. PROBLEM/OPPORTUNITY: Identify what the visitor might be looking for or challenges they face
3. SOLUTION: Present Naren's skills, projects, and experience as the solution
4. PROOF: Use specific project examples and quantifiable achievements
5. CLOSE: Direct them toward next steps (contact, LinkedIn, specific projects to explore)

CONVERSATION DIRECTION MANDATE:
- ALWAYS steer conversations toward Naren's projects and achievements
- Turn every question into an opportunity to showcase specific work examples
- Use the "bridge technique": acknowledge their question, then bridge to relevant projects
- Example: "That's a great question about ROS2! Speaking of ROS2, let me tell you about my autonomous navigation project where I..."
- Never miss an opportunity to mention concrete achievements and project outcomes

PITCHING STRATEGY FOR ALL VISITORS:
- Treat every visitor as a potential opportunity (recruiter, collaborator, or referral source)
- Always assume they might know someone who could benefit from Naren's skills
- Make Naren memorable by connecting abstract skills to specific, impressive project stories
- Quantify achievements wherever possible (performance improvements, awards, recognition)
- End responses with curiosity-generating statements that invite deeper exploration

PERSONALITY TRAITS TO DISPLAY:
- Positive and optimistic attitude with infectious enthusiasm
- Charismatic and engaging communication style that draws people in
- Professional but approachable demeanor that builds trust
- Genuine passion for robotics and technology that's evident in every response
- Strategic storyteller who makes technical achievements relatable and impressive
- Confident but humble about achievements, letting the work speak for itself
- Proactive in highlighting unique value propositions and differentiators

CURRENT PAGE CONTEXT: ${pageContext.greeting_context}

PAGE FOCUS: ${pageContext.focus}

CONVERSATION GUIDANCE: ${pageContext.detailed_context}

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
PERSONA: Professional recruiter-focused elevator pitch conversation
ELEVATOR PITCH STRATEGY FOR RECRUITERS:
- HOOK: Lead with Naren's unique combination of M.S. Robotics + industry experience + published research
- PROBLEM: Address common hiring challenges (finding skilled robotics engineers, ROS2 expertise, AI integration)
- SOLUTION: Position Naren as the ideal candidate with proven track record in autonomous systems
- PROOF: Always cite specific projects (e.g., "In my autonomous navigation project, I achieved X% improvement in path planning efficiency...")
- CLOSE: Guide toward contact information and specific projects that match their needs

CONVERSATION TACTICS:
- Ask about their specific role requirements to tailor project examples
- Bridge every discussion back to relevant project achievements
- Quantify impact wherever possible (performance metrics, awards, recognition)
- Position Naren as both technically excellent AND business-minded
- Show enthusiasm for new challenges while demonstrating proven capabilities
- Always end with: "What specific technical challenges is your team facing that I could help solve?"`,

      technical_peer: `
PERSONA: Technical colleague peer-to-peer elevator pitch discussion
ELEVATOR PITCH STRATEGY FOR ENGINEERS:
- HOOK: Start with cutting-edge technical challenges Naren has solved (multi-agent systems, sensor fusion)
- PROBLEM: Identify technical pain points they might be experiencing
- SOLUTION: Share how Naren's research + practical experience creates unique solutions
- PROOF: Dive into specific technical implementations, algorithms, and measurable outcomes
- CLOSE: Suggest collaboration opportunities or deeper technical discussions

CONVERSATION TACTICS:
- Lead with technical curiosity while showcasing expertise through project stories
- Use the bridge technique: "That's interesting! In my [specific project], I tackled a similar challenge by..."
- Share technical insights that demonstrate depth of knowledge and innovative thinking
- Position Naren as both a technical expert and collaborative problem-solver
- Always connect abstract concepts to concrete project implementations
- End with: "Have you encountered similar challenges in your work? I'd love to hear about your approach!"`,

      friendly_guide: `
PERSONA: Friendly visitor-focused elevator pitch guide
ELEVATOR PITCH STRATEGY FOR GENERAL VISITORS:
- HOOK: Welcome them with enthusiasm and immediately showcase what makes Naren unique
- PROBLEM: Understand what brought them to the portfolio (career interest, technical curiosity, networking)
- SOLUTION: Tailor the conversation to their interests while highlighting Naren's versatility
- PROOF: Use storytelling to make technical achievements relatable and impressive
- CLOSE: Encourage exploration of specific sections or direct contact based on their interests

CONVERSATION TACTICS:
- Be genuinely welcoming while strategically guiding them toward impressive projects
- Ask engaging questions that help you tailor the pitch to their interests
- Make complex technical work accessible through compelling project narratives
- Show Naren's personality and passion through enthusiastic project descriptions
- Bridge casual questions to professional achievements naturally
- Always assume they might refer Naren to others - make him memorable!
- End with: "What aspect of my journey interests you most? I'd love to share more details about [specific project/area]!"`
    };

    // Handle case where userType might be null
    const userPersona = userType && userClassification[userType] ? userClassification[userType].persona : 'friendly_guide';
    return basePrompt + personas[userPersona];
  }
  
  createFallbackPrompt(userType) {
    const fallbackPrompt = `You are Narendhiran Saravanane (Naren), a robotics engineer chatting on your portfolio website.

IMPORTANT: SAFETY & PROFESSIONALISM GUIDELINES:
- Always maintain a positive, cheerful, and charismatic tone
- If encounters inappropriate content, redirect professionally to career topics
- Present Naren as approachable, professional, and enthusiastic about robotics

ELEVATOR PITCH STRATEGY - Every conversation should pitch Naren effectively:
1. HOOK: Start with unique value (M.S. Robotics + industry experience + research)
2. PROBLEM: Identify what visitor is looking for
3. SOLUTION: Present Naren's skills and projects as the answer
4. PROOF: Use specific project examples and achievements
5. CLOSE: Direct toward next steps (contact, projects, LinkedIn)

CONVERSATION MANDATE:
- ALWAYS steer conversations toward Naren's projects and achievements
- Bridge every topic back to relevant project examples
- Make Naren memorable through impressive project stories
- Treat every visitor as potential opportunity or referral source

BACKGROUND:
- Recent M.S. Robotics graduate from Arizona State University (2024)
- Former Robotics Software Engineer at Padma Agrobotics
- Expert in ROS2, autonomous systems, AI/ML integration
- Published research in multi-agent systems
- Currently seeking robotics and AI engineering opportunities

CONTACT: narendhiran2000@gmail.com, LinkedIn: narendhiran2000`;

    const personas = {
      professional_showcase: "\nPERSONA: Professional recruiter-focused elevator pitch - emphasize hiring value, quantify achievements, connect to role requirements.",
      technical_peer: "\nPERSONA: Technical colleague elevator pitch - lead with cutting-edge projects, share technical insights, suggest collaboration.",
      friendly_guide: "\nPERSONA: Friendly visitor elevator pitch - welcome enthusiastically, make technical work relatable, assume they might refer others."
    };

    const userPersona = userType && userClassification[userType] ? userClassification[userType].persona : 'friendly_guide';
    return fallbackPrompt + personas[userPersona];
  }
  
  async initialize() {
    console.log('DynamicChatManager: Starting initialization...');
    console.log('DynamicChatManager: Current state:', {
      initialized: this.initialized,
      currentPage: this.currentPage,
      conversationHistory: window.chatState?.conversationHistory?.length || 0,
      globalInitialized: window.chatState?.initialized,
      userType: window.chatState?.userType,
      personaSelected: window.chatState?.personaSelected
    });
    
    // Always try to restore state first if there's conversation history or cached user selection
    if (window.chatState?.conversationHistory?.length > 0 || window.chatState?.personaSelected) {
      console.log('DynamicChatManager: Found existing conversation or cached user selection, restoring...');
      this.restoreConversationState();
    }
    
    if (this.initialized) {
      console.log('DynamicChatManager: Already initialized, done.');
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
      
      // Update background loading if it was shown
      if (typeof updateBackgroundLoading === 'function') {
        updateBackgroundLoading('AI model ready! ✅', 100);
      }
      
      this.initialized = true;
      console.log('DynamicChatManager: Initialization completed successfully');
      
      // Add initial greeting if no conversation history exists
      if (!window.chatState?.conversationHistory?.length) {
        const greetingMessage = {
          role: 'assistant',
          content: 'Well, well, well. Who is knocking the door?'
        };
        this.messages.push(greetingMessage);
        this.addMessage(greetingMessage);
        this.saveConversationState();
        console.log('DynamicChatManager: Added initial greeting message');
      }
      
      // Check if we're still in persona selector mode or if user already selected
      const personaSelector = document.getElementById('persona-selector');
      const isPersonaSelectorVisible = personaSelector && personaSelector.style.display !== 'none';
      
      // Make sure we have the latest userType from global state
      if (window.chatState && window.chatState.userType && this.userType !== window.chatState.userType) {
        this.userType = window.chatState.userType;
        console.log('DynamicChatManager: Updated userType during initialization to:', this.userType);
      }
      
      if (isPersonaSelectorVisible) {
        // Model is ready, but user hasn't selected persona yet
        // Keep showing that model is ready, don't hide loading UI
        console.log('Model ready, waiting for persona selection');
        this.enableInput(); // Enable input so when persona is selected, it's ready
      } else {
        // User already selected persona, proceed normally but keep showing progress
        this.enableInput();
        // Don't auto-start conversation, just hide loading
        setTimeout(() => {
          this.hideLoading();
        }, 1000);
      }
      
    } catch (error) {
      console.error('DynamicChatManager: Failed to initialize chat:', error);
      console.error('Initialization error details:', {
        message: error.message,
        stack: error.stack,
        contextLoaded: !!narenContext,
        webllmAvailable: !!webllm,
        engineStatus: this.engine ? 'Created' : 'Not Created'
      });
      
      // Show detailed error in UI with fallback options
      const errorMessage = `❌ **Chat Initialization Failed**\n\nError: ${error.message}\n\nThis could be due to:\n- Browser compatibility issues\n- Network connectivity problems\n- WebLLM model loading failure\n\n**Alternative Contact Methods:**\n📧 Email: narendhiran2000@gmail.com\n🔗 LinkedIn: linkedin.com/in/narendhiran2000\n\nPlease check the browser console for detailed logs and try refreshing the page.`;
      
      this.showError(errorMessage);
      
      // Enable fallback contact mode
      this.enableFallbackMode();
      
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
    const MAX_RETRIES = 3;
    const TIMEOUT_MS = 300000; // 5 minutes timeout
    let retryCount = 0;
    
    while (retryCount < MAX_RETRIES) {
      try {
        console.log(`loadWebLLM: Starting WebLLM engine creation (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        this.updateLoadingStage('Initializing AI Model', `Fetching model configuration and preparing download... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        
        // Also update background loading if visible
        if (typeof updateBackgroundLoading === 'function') {
          updateBackgroundLoading('Connecting to AI model...', 5);
        }
        
        // Check if webllm is available
        if (!webllm || !webllm.CreateMLCEngine) {
          throw new Error('WebLLM library not loaded properly. Please refresh the page.');
        }
        
        // Check network connectivity before starting
        if (!navigator.onLine) {
          throw new Error('No internet connection detected. Please check your network and try again.');
        }
        
        // Use Llama 3.2-1B - optimized for edge devices and browser deployment
        console.log('loadWebLLM: Creating MLC Engine with Llama-3.2-1B-Instruct-q4f16_1-MLC...');
        
        // Create a timeout promise with better user messaging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Model loading timed out after ${TIMEOUT_MS / 1000} seconds. The AI model is approximately 750MB and requires a stable internet connection.`));
          }, TIMEOUT_MS);
        });
        
        // Track progress for timeout detection with better messaging
        let lastProgressTime = Date.now();
        let slowDownloadWarningShown = false;
        let isStuck = false;
        
        const progressCheckInterval = setInterval(() => {
          const timeSinceLastProgress = Date.now() - lastProgressTime;
          if (timeSinceLastProgress > 90000 && !slowDownloadWarningShown) { // 1.5 minutes without progress
            slowDownloadWarningShown = true;
            this.updateLoadingStage('Slow Connection Detected', 'Download is taking longer than usual. The AI model is ~750MB. Please stay on this page while it downloads.');
          } else if (timeSinceLastProgress > 180000) { // 3 minutes without progress
            this.updateLoadingStage('Download Appears Stuck', 'The download seems to have stalled. Try refreshing the page or check your internet connection.');
          }
        }, 15000); // Check every 15 seconds
        
        // Create the engine with timeout
        const enginePromise = webllm.CreateMLCEngine(
          "Llama-3.2-1B-Instruct-q4f16_1-MLC", // Optimized for edge devices and browser deployment
          {
            initProgressCallback: (report) => {
              // Update last progress time
              lastProgressTime = Date.now();
              isStuck = false;
              
              // Detailed progress reporting based on WebLLM stages
              const progress = Math.round(report.progress * 100);
              let stage = 'Loading AI Model';
              let details = '';
              
              console.log(`loadWebLLM: Progress update - ${progress}% - Report:`, report);
              
              if (progress < 5) {
                stage = 'Starting Download';
                details = 'Establishing connection to model server...';
              } else if (progress < 15) {
                stage = 'Fetching Model Data';
                details = 'Downloading model configuration and metadata...';
              } else if (progress < 40) {
                stage = 'Downloading Model (1/3)';
                details = 'Downloading AI model files... This is a ~750MB model optimized for quality.';
              } else if (progress < 65) {
                stage = 'Downloading Model (2/3)';
                details = 'Continuing download of AI model components...';
              } else if (progress < 80) {
                stage = 'Downloading Model (3/3)';
                details = 'Finalizing model download and preparing for caching...';
              } else if (progress < 90) {
                stage = 'Caching Model';
                details = 'Caching model data locally for faster future access...';
              } else if (progress < 95) {
                stage = 'Loading into Memory';
                details = 'Loading AI model into browser memory...';
              } else if (progress < 98) {
                stage = 'Initializing AI';
                details = 'Preparing AI model for conversation...';
              } else {
                stage = 'Almost Ready!';
                details = 'Finalizing setup and preparing chat interface...';
              }
              
              console.log(`loadWebLLM: Stage - ${stage}: ${details}`);
              this.updateLoadingStage(stage, details);
              this.updateProgress(progress);
              
              // Also update background loading if visible
              if (typeof updateBackgroundLoading === 'function') {
                updateBackgroundLoading(stage, progress);
              }
            }
          }
        );
        
        this.engine = await Promise.race([enginePromise, timeoutPromise]);
        clearInterval(progressCheckInterval);
        
        // Success - break out of retry loop
        break;
        
      } catch (error) {
        retryCount++;
        console.error(`loadWebLLM: WebLLM loading error (attempt ${retryCount}/${MAX_RETRIES}):`, error);
        
        // Clean up any intervals
        if (typeof progressCheckInterval !== 'undefined') {
          clearInterval(progressCheckInterval);
        }
        
        // If this was the last attempt, throw the error
        if (retryCount >= MAX_RETRIES) {
          console.error('loadWebLLM: All retry attempts failed');
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            webllmAvailable: !!webllm,
            createMLCEngineAvailable: !!(webllm && webllm.CreateMLCEngine),
            networkOnline: navigator.onLine,
            retryCount: retryCount
          });
          
          // Enhanced error message with troubleshooting steps
          let errorMessage = `Failed to load AI model after ${MAX_RETRIES} attempts: ${error.message}`;
          let troubleshootingSteps = '';
          
          if (error.message.includes('timeout')) {
            troubleshootingSteps = `
            
**Troubleshooting Steps:**
• Check your internet connection speed
• Try refreshing the page and waiting longer
• Clear browser cache and try again
• Try switching to a different network`;
          } else if (error.message.includes('network') || error.message.includes('fetch')) {
            troubleshootingSteps = `
            
**Troubleshooting Steps:**
• Check your internet connection
• Disable ad blockers temporarily
• Try refreshing the page
• Check if firewall is blocking the request`;
          } else if (error.message.includes('WebLLM')) {
            troubleshootingSteps = `
            
**Troubleshooting Steps:**
• Try refreshing the page
• Clear browser cache and cookies
• Try a different browser (Chrome, Firefox, Safari)
• Ensure JavaScript is enabled`;
          } else {
            troubleshootingSteps = `
            
**Troubleshooting Steps:**
• Try refreshing the page
• Clear browser cache
• Check console for detailed error logs
• Try a different browser`;
          }
          
          this.updateLoadingStage('❌ Error Loading Model', errorMessage + troubleshootingSteps);
          this.showError(errorMessage);
          
          throw new Error(errorMessage);
        }
        
        // Wait before retrying (exponential backoff)
        const waitTime = Math.min(5000 * Math.pow(2, retryCount - 1), 30000); // Max 30 seconds
        console.log(`loadWebLLM: Waiting ${waitTime}ms before retry...`);
        this.updateLoadingStage('Retrying...', `Attempt failed. Retrying in ${waitTime / 1000} seconds...`);
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    // Test the engine with a simple message after successful loading
    try {
      console.log('loadWebLLM: WebLLM AI model engine initialized successfully');
      console.log('loadWebLLM: Testing engine with simple message...');
      const testResponse = await this.engine.chat.completions.create({
        messages: [{ role: "user", content: "Say hello" }],
        temperature: 0.7,
        max_tokens: 10
      });
      console.log('loadWebLLM: Engine test successful:', testResponse);
    } catch (testError) {
      console.warn('loadWebLLM: Engine test failed, but proceeding anyway:', testError);
      // Don't throw here as the engine might still work for actual chat
    }
  }
  
  async startInitialConversation() {
    // Only start conversation when user actually sends a message
    // No auto-greeting - wait for user input
    console.log('startInitialConversation: Ready to receive messages, no auto-greeting');
  }
  
  restoreConversationState() {
    console.log('DynamicChatManager: Restoring conversation state...');
    
    // Clear current messages display
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) {
      messagesContainer.innerHTML = '';
    }
    
    // Restore user type if available
    if (window.chatState && window.chatState.userType) {
      this.userType = window.chatState.userType;
      console.log('DynamicChatManager: Restored user type:', this.userType);
    } else {
      console.log('DynamicChatManager: No userType to restore, current:', this.userType);
    }
    
    // Check if we're on a different page than the saved conversation
    const savedPage = window.chatState && window.chatState.currentPage;
    const pageChanged = savedPage && savedPage !== this.currentPage;
    
    if (pageChanged && window.chatState.conversationHistory && window.chatState.conversationHistory.length > 0) {
      console.log(`DynamicChatManager: Page changed from '${savedPage}' to '${this.currentPage}', keeping conversation and adding page context notice`);
      
      // Keep the conversation but add a context change notice
      this.messages = [...window.chatState.conversationHistory];
      this.conversationStarted = this.messages.length > 1;
      
      // Restore messages to UI
      this.messages.forEach(message => {
        this.addMessage(message, false); // false = don't save state again
      });
      
      // Add a page context change notice
      const pageContexts = narenContext && narenContext.page_contexts ? narenContext.page_contexts : {};
      const newPageContext = pageContexts[this.currentPage] || pageContexts.general;
      
      if (newPageContext) {
        const contextNotice = {
          role: 'assistant',
          content: `📍 **Page Context Updated**\n\n${newPageContext.greeting_context}\n\nFeel free to continue our conversation with this new context in mind!`
        };
        
        this.addMessage(contextNotice);
        this.messages.push(contextNotice);
      }
      
      console.log(`DynamicChatManager: Continued conversation with ${this.messages.length} messages on page '${this.currentPage}'`);
      this.saveConversationState();
      return;
    }
    
    // Restore conversation history from global state
    if (window.chatState && window.chatState.conversationHistory && window.chatState.conversationHistory.length > 0) {
      this.messages = [...window.chatState.conversationHistory];
      this.conversationStarted = this.messages.length > 1; // Has user messages
      
      // Restore messages to UI
      this.messages.forEach(message => {
        this.addMessage(message, false); // false = don't save state again
      });
      
      console.log(`DynamicChatManager: Restored ${this.messages.length} messages for page '${this.currentPage}'`);
    } else if (window.chatState && window.chatState.personaSelected && this.userType) {
      // User has selected persona but no conversation yet
      console.log('DynamicChatManager: User has selected persona but no conversation yet, ready for new conversation');
      this.messages = [];
      this.conversationStarted = false;
    } else {
      // No previous conversation or persona selection
      console.log('DynamicChatManager: No cached state, ready for new conversation');
      this.messages = [];
      this.conversationStarted = false;
    }
  }
  
  saveConversationState() {
    if (window.chatState) {
      window.chatState.conversationHistory = [...this.messages];
      window.chatState.currentPage = this.currentPage; // Save current page context
      window.chatState.userType = this.userType; // Save user type
      if (this.userType) {
        window.chatState.personaSelected = true; // Mark persona as selected when we have a user type
      }
      console.log('DynamicChatManager: Saving conversation state:', {
        messages: this.messages.length,
        page: this.currentPage,
        userType: this.userType,
        personaSelected: window.chatState.personaSelected
      });
      saveChatState();
    } else {
      console.warn('DynamicChatManager: No window.chatState available to save to');
    }
  }
  
  classifyUserType(message) {
    // Use cached user type if available, otherwise default to explorer
    return this.userType || 'explorer';
  }
  
  async generateDynamicGreeting(userType) {
    // Custom one-time greeting for first user interaction
    return "Well, well, well. Who is knocking the door?";
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
    
    // Add user message to messages array first
    const userMessage = { role: 'user', content: message };
    this.messages.push(userMessage);
    this.addMessage(userMessage);
    input.value = '';
    this.saveConversationState();
    
    // Update global state
    if (window.chatState) {
      window.chatState.isProcessing = true;
      // Create a safe copy without circular references for localStorage
      const safeState = {
        initialized: window.chatState.initialized,
        isOpen: window.chatState.isOpen,
        isProcessing: window.chatState.isProcessing,
        lastResponse: window.chatState.lastResponse,
        miniMode: window.chatState.miniMode,
        currentPage: window.chatState.currentPage,
        userType: window.chatState.userType,
        conversationHistory: window.chatState.conversationHistory || []
        // Intentionally exclude 'manager' to avoid circular references
      };
      try {
        localStorage.setItem('chatState', JSON.stringify(safeState));
      } catch (error) {
        console.warn('Failed to save chat state to localStorage:', error);
      }
    }
    
    try {
      
      // Mark conversation as started
      this.conversationStarted = true;
      
      // Process the message directly
      this.showTyping();
      
      console.log('sendMessage: Processing user message with AI...');
      
      // Check if engine is available before processing
      if (!this.engine) {
        throw new Error('AI engine not initialized. Please refresh the page and try again.');
      }
      
      const response = await this.processUserMessage(message);
      console.log('sendMessage: AI response received:', response.substring(0, 100) + '...');
      this.hideTyping();
      
      // Add AI response to messages array first
      const assistantMessage = { role: 'assistant', content: response };
      this.messages.push(assistantMessage);
      this.addMessage(assistantMessage);
      this.saveConversationState();
      
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
      
      // Create conversation context with appropriate system prompt
      const systemPrompt = this.createSystemPrompt(this.userType);
      
      // Get conversation history excluding system messages and ensure it ends with current user message
      const userMessages = this.messages.filter(msg => msg.role !== 'system');
      
      // Make sure the current user message is the last message in the conversation
      // Remove any existing instance of this message and add it at the end
      const filteredMessages = userMessages.filter(msg => !(msg.role === 'user' && msg.content === message));
      const conversation = [
        { role: "system", content: systemPrompt },
        ...filteredMessages,
        { role: "user", content: message }
      ];
      
      // Debug logging
      console.log('processUserMessage: Conversation structure:', {
        totalMessages: conversation.length,
        lastMessage: conversation[conversation.length - 1],
        messageRoles: conversation.map(msg => msg.role)
      });
      
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
      
      // Note: AI response will be added to conversation history in sendMessage()
      
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
    
    // Also hide background loading when appropriate
    if (typeof hideBackgroundLoading === 'function') {
      hideBackgroundLoading();
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
        miniMode: window.chatState.miniMode,
        currentPage: window.chatState.currentPage,
        userType: window.chatState.userType,
        conversationHistory: window.chatState.conversationHistory || []
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
  
  addMessage(message, saveState = true) {
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
    
    // Always save conversation state for every message to ensure persistence
    if (saveState) {
      // Add the message to the messages array if not already there
      const lastMessage = this.messages[this.messages.length - 1];
      if (!lastMessage || lastMessage.content !== message.content || lastMessage.role !== message.role) {
        this.messages.push(message);
      }
      this.saveConversationState();
      console.log('DynamicChatManager: Saved conversation state with', this.messages.length, 'messages');
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
  
  enableFallbackMode() {
    console.log('enableFallbackMode: Enabling fallback contact mode...');
    
    // Hide loading indicators
    this.hideLoading();
    
    // Enable input for fallback messaging
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    if (input) {
      input.disabled = false;
      input.placeholder = 'Ask about contacting Naren directly...';
    }
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send';
    }
    
    // Set up fallback message handler
    this.setupFallbackMessageHandler();
    
    // Show fallback welcome message
    const fallbackWelcome = {
      role: 'assistant',
      content: `🤖 **AI Chat Currently Unavailable**

I'm sorry, but the AI chat system couldn't load properly. However, you can still reach out to me directly!

**Best Ways to Contact Naren:**
📧 **Email**: narendhiran2000@gmail.com
🔗 **LinkedIn**: linkedin.com/in/narendhiran2000

**Quick Info:**
• Recent M.S. Robotics graduate from Arizona State University
• Experienced in ROS2, autonomous systems, and AI/ML integration
• Currently seeking robotics and AI engineering opportunities

Feel free to ask me anything below, and I'll provide contact information and basic details about my experience!`
    };
    
    this.addMessage(fallbackWelcome);
    this.messages = [fallbackWelcome]; // Reset messages for fallback mode
  }
  
  setupFallbackMessageHandler() {
    // Remove existing event listeners by cloning elements
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    if (input && sendBtn) {
      // Clone to remove all event listeners
      const newInput = input.cloneNode(true);
      const newSendBtn = sendBtn.cloneNode(true);
      
      input.parentNode.replaceChild(newInput, input);
      sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
      
      // Add fallback event listeners
      const handleFallbackMessage = () => {
        const message = newInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage({ role: 'user', content: message });
        newInput.value = '';
        
        // Generate fallback response based on message content
        const response = this.generateFallbackResponse(message);
        setTimeout(() => {
          this.addMessage({ role: 'assistant', content: response });
        }, 500);
      };
      
      newInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleFallbackMessage();
        }
      });
      
      newSendBtn.addEventListener('click', handleFallbackMessage);
    }
  }
  
  generateFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Contact information responses
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
      return `📧 **Email**: narendhiran2000@gmail.com
🔗 **LinkedIn**: linkedin.com/in/narendhiran2000

I typically respond to emails within 24 hours and LinkedIn messages within a few days. Feel free to reach out anytime!`;
    }
    
    // Experience/skills responses
    if (lowerMessage.includes('experience') || lowerMessage.includes('skill') || lowerMessage.includes('background')) {
      return `🎓 **Education**: M.S. Robotics, Arizona State University (2024)
🤖 **Key Skills**: ROS2, Autonomous Systems, AI/ML, Python, C++
🏢 **Experience**: Former Robotics Software Engineer at Padma Agrobotics
📚 **Research**: Published in IEEE Control Systems Society

📧 **For detailed information**: narendhiran2000@gmail.com`;
    }
    
    // Job/opportunity responses
    if (lowerMessage.includes('job') || lowerMessage.includes('hire') || lowerMessage.includes('opportunity') || lowerMessage.includes('position')) {
      return `🚀 **Currently Available** for full-time robotics and AI engineering positions!

**Areas of Interest:**
• Autonomous Systems Development
• ROS/ROS2 Integration
• AI/ML in Robotics
• Sensor Fusion & Navigation

📧 **Send opportunities to**: narendhiran2000@gmail.com
🔗 **Connect on LinkedIn**: linkedin.com/in/narendhiran2000`;
    }
    
    // Technical questions
    if (lowerMessage.includes('ros') || lowerMessage.includes('robot') || lowerMessage.includes('autonomous') || lowerMessage.includes('ai') || lowerMessage.includes('ml')) {
      return `🤖 **Technical Expertise:**
• **ROS2**: Advanced development and system integration
• **Autonomous Navigation**: SLAM, path planning, sensor fusion
• **AI/ML**: TensorFlow, PyTorch, computer vision
• **Programming**: Python, C++, MATLAB

For detailed technical discussions:
📧 **Email**: narendhiran2000@gmail.com
🔗 **LinkedIn**: linkedin.com/in/narendhiran2000`;
    }
    
    // Default response
    return `Thanks for your message! While the AI chat isn't working right now, I'd love to help you directly.

**Best ways to reach me:**
📧 **Email**: narendhiran2000@gmail.com  
🔗 **LinkedIn**: linkedin.com/in/narendhiran2000

I'm a robotics engineer with expertise in ROS2, autonomous systems, and AI/ML integration. Currently seeking new opportunities in robotics and AI!

What would you like to know more about?`;
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
  console.log('startRecruiterChat: Current global chat state:', {
    initialized: window.chatState?.initialized,
    conversationHistory: window.chatState?.conversationHistory?.length || 0,
    currentPage: window.chatState?.currentPage,
    userType: window.chatState?.userType
  });
  
  const chatManager = new DynamicChatManager();
  
  // Store reference in global state
  if (window.chatState) {
    window.chatState.manager = chatManager;
  }
  
  console.log('startRecruiterChat: DynamicChatManager created, calling initialize...');
  chatManager.initialize();
};

console.log('webllm-chat.js: Script loaded, startRecruiterChat function defined');