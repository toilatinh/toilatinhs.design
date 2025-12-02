// ElevenLabs Agent Configuration
const ELEVENLABS_API_KEY = 'sk_e4aefb8ff03ca15833064e433a329f8bbd26aea8a17167de';
const AGENT_ID = 'agent_2601kb4swbxefkrs5px70k48m7w0';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export class ElevenLabsService {
    private ws: WebSocket | null = null;
    private isConnected = false;
    private messageQueue: string[] = [];

    private onMessageCallback: ((message: Message) => void) | null = null;
    private onStatusCallback: ((status: 'connecting' | 'connected' | 'disconnected' | 'error') => void) | null = null;
    private onPartialMessageCallback: ((content: string) => void) | null = null;

    constructor() {
        this.connect();
    }

    // Update ws.onmessage to handle partial responses
    // duplicate connect implementation removed


    // duplicate constructor removed

    private async getSignedUrl(): Promise<string> {
        try {
            const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${AGENT_ID}`, {
                method: 'GET',
                headers: {
                    'xi-api-key': ELEVENLABS_API_KEY,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to get signed URL: ${response.statusText}`);
            }

            const data = await response.json();
            return data.signed_url;
        } catch (error) {
            console.error('Error getting signed URL:', error);
            throw error;
        }
    }

    async connect() {
        if (this.isConnected || this.ws?.readyState === WebSocket.CONNECTING) {
            return;
        }

        try {
            this.onStatusCallback?.('connecting');
            const signedUrl = await this.getSignedUrl();

            this.ws = new WebSocket(signedUrl);

            this.ws.onopen = () => {
                console.log('✅ Connected to ElevenLabs Agent');
                this.isConnected = true;
                this.onStatusCallback?.('connected');

                // Send any queued messages
                while (this.messageQueue.length > 0) {
                    const message = this.messageQueue.shift();
                    if (message) {
                        this.sendMessage(message);
                    }
                }
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📨 Received from ElevenLabs:', data);

                    // Handle different message types
                    if (data.type === 'conversation_initiation_metadata') {
                        console.log('🎤 Conversation initiated');

                    } else if (data.type === 'agent_response') {
                        const event = data.agent_response_event;
                        if (event) {
                            const content = event.agent_response || '';
                            if (content) {
                                // Accumulate content
                                this.currentResponse += content;

                                // Send partial update with full accumulated text
                                this.onPartialMessageCallback?.(this.currentResponse);

                                // Debounce final message
                                if (this.responseTimeout) {
                                    clearTimeout(this.responseTimeout);
                                }

                                this.responseTimeout = setTimeout(() => {
                                    if (this.currentResponse) {
                                        this.onMessageCallback?.({
                                            role: 'assistant',
                                            content: this.currentResponse,
                                            timestamp: new Date(),
                                        });
                                        this.currentResponse = "";
                                        this.responseTimeout = null;
                                    }
                                }, 1000); // 1 second silence implies end of turn
                            }
                        }
                    } else if (data.type === 'user_transcript') {
                        // User's transcribed speech (if using voice)
                        console.log('🎤 User transcript:', data.user_transcription_event?.user_transcript);
                    } else if (data.type === 'audio') {
                        // Handle audio if needed (for voice responses)
                        console.log('🔊 Audio response received');
                    }
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };

            this.ws.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                this.onStatusCallback?.('error');
            };

            this.ws.onclose = () => {
                console.log('🔌 Disconnected from ElevenLabs Agent');
                this.isConnected = false;
                this.onStatusCallback?.('disconnected');

                // Attempt to reconnect after 3 seconds
                setTimeout(() => {
                    if (!this.isConnected) {
                        console.log('🔄 Attempting to reconnect...');
                        this.connect();
                    }
                }, 3000);
            };
        } catch (error) {
            console.error('Failed to connect:', error);
            this.onStatusCallback?.('error');
        }
    }

    private currentResponse: string = "";
    private responseTimeout: ReturnType<typeof setTimeout> | null = null;

    sendMessage(text: string) {
        if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.log('⏳ Queueing message (not connected yet)');
            this.messageQueue.push(text);
            return;
        }

        // Clear any pending response state when user sends a new message
        this.currentResponse = "";
        if (this.responseTimeout) {
            clearTimeout(this.responseTimeout);
            this.responseTimeout = null;
        }

        try {
            // Send user message to ElevenLabs
            const message = {
                type: 'user_message',
                text: text,
            };

            this.ws.send(JSON.stringify(message));
            console.log('📤 Sent to ElevenLabs:', text);

            // Add user message to chat
            this.onMessageCallback?.({
                role: 'user',
                content: text,
                timestamp: new Date(),
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    onMessage(callback: (message: Message) => void) {
        this.onMessageCallback = callback;
    }

    // Register callback for partial streaming messages
    onPartialMessage(callback: (content: string) => void) {
        this.onPartialMessageCallback = callback;
    }

    onStatus(callback: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void) {
        this.onStatusCallback = callback;
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            this.isConnected = false;
        }
    }

    getConnectionStatus(): boolean {
        return this.isConnected;
    }
}

// Singleton instance
let elevenLabsService: ElevenLabsService | null = null;

export function getElevenLabsService(): ElevenLabsService {
    if (!elevenLabsService) {
        elevenLabsService = new ElevenLabsService();
    }
    return elevenLabsService;
}
