import React, { useState, useEffect, useRef } from 'react';
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Card, CardContent } from "../../components/ui/card";
import { 
  MessageSquare, 
  Paperclip, 
  Send, 
  Image, 
  Smile, 
  Phone, 
  Mic, 
  MicOff,
  AlertCircle,
  FileText
} from "lucide-react";
import { Message, Contact, Form } from '../../types';
import QuickReplies from '../../components/agent/QuickReplies';
import { notifyNewMessage, playNotificationSound, NotificationSoundType } from '../../services/notification';

const AgentWorkspace: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const MAX_RECORDING_TIME = 180; // 3 minutes in seconds
  const [forms, setForms] = useState<Form[]>([]);
  const [showFormSelector, setShowFormSelector] = useState(false);
  
  useEffect(() => {
    const mockContacts = [
      { 
        id: '1', 
        tenantId: 'tenant1',
        whatsappAccountId: 'account1',
        phoneNumber: '+1234567890', 
        name: 'John Doe', 
        profileName: 'John', 
        labels: [{ name: 'Customer', color: '#4CAF50' }],
        customFields: {}
      },
      { 
        id: '2', 
        tenantId: 'tenant1',
        whatsappAccountId: 'account1',
        phoneNumber: '+0987654321', 
        name: 'Jane Smith', 
        profileName: 'Jane', 
        labels: [{ name: 'Lead', color: '#2196F3' }],
        customFields: {}
      },
    ];
    
    setContacts(mockContacts);
    
  }, []);
  
  useEffect(() => {
    if (selectedContact) {
      const mockMessages: Message[] = [
        { 
          id: '1', 
          tenantId: 'tenant1',
          whatsappAccountId: 'account1',
          fromNumber: selectedContact.phoneNumber, 
          toNumber: '+1111111111', 
          messageType: 'text', 
          content: { text: 'Hello, I need help with my order' }, 
          status: 'delivered',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString()
        },
        { 
          id: '2', 
          tenantId: 'tenant1',
          whatsappAccountId: 'account1',
          fromNumber: '+1111111111', 
          toNumber: selectedContact.phoneNumber, 
          messageType: 'text', 
          content: { text: 'Hi there! I\'d be happy to help. Could you please provide your order number?' }, 
          status: 'delivered',
          createdAt: new Date(Date.now() - 3500000).toISOString(),
          updatedAt: new Date(Date.now() - 3500000).toISOString()
        },
      ];
      
      setMessages(mockMessages);
      
      setTimeout(() => {
        const newIncomingMessage = {
          id: '3',
          tenantId: 'tenant1',
          whatsappAccountId: 'account1',
          fromNumber: selectedContact.phoneNumber,
          toNumber: '+1111111111',
          messageType: 'text' as const,
          content: { text: 'My order number is #12345. I haven\'t received it yet.' },
          status: 'delivered' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, newIncomingMessage]);
        
        playNotificationSound(NotificationSoundType.NEW_MESSAGE);
        notifyNewMessage(
          selectedContact.name || selectedContact.phoneNumber, 
          newIncomingMessage.content.text
        );
      }, 10000);
    }
  }, [selectedContact]);
  
  useEffect(() => {
    const mockForms: Form[] = [
      {
        id: '1',
        tenantId: 'tenant1',
        name: 'Customer Information',
        description: 'Collect basic customer information',
        fields: [
          { id: 'name', label: 'Full Name', type: 'text', required: true },
          { id: 'email', label: 'Email Address', type: 'email', required: true },
          { id: 'phone', label: 'Phone Number', type: 'phone', required: false }
        ],
        submissions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        tenantId: 'tenant1',
        name: 'Order Details',
        description: 'Collect order information',
        fields: [
          { id: 'product', label: 'Product', type: 'select', required: true, options: ['Product A', 'Product B', 'Product C'] },
          { id: 'quantity', label: 'Quantity', type: 'number', required: true },
          { id: 'shipping', label: 'Shipping Address', type: 'text', required: true }
        ],
        submissions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    setForms(mockForms);
  }, []);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setAudioBlob(audioBlob);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      let seconds = 0;
      recordingTimerRef.current = window.setInterval(() => {
        seconds += 1;
        setRecordingTime(seconds);
        
        if (seconds >= MAX_RECORDING_TIME) {
          stopRecording();
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please check your browser permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };
  
  const sendVoiceNote = async () => {
    if (!audioBlob || !selectedContact) return;
    
    const retentionDays = 30; // This would come from tenant.cost_settings.voice_note_retention_days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + retentionDays);
    
    const newMessage = {
      id: Date.now().toString(),
      tenantId: 'tenant1',
      whatsappAccountId: 'account1',
      fromNumber: '+1111111111',
      toNumber: selectedContact.phoneNumber,
      messageType: 'audio' as const,
      content: { 
        audio: URL.createObjectURL(audioBlob)
      },
      status: 'sent' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isBusinessInitiated: true,
      voiceNoteDuration: recordingTime,
      voice_note_expiry: expiryDate.toISOString(), // Auto-delete after retention period
      respondedByAgentId: '3', // Current agent ID
      responseTime: 45 // Mock response time in seconds
    };
    
    setMessages([...messages, newMessage]);
    setAudioBlob(null);
    setRecordingTime(0);
  };
  
  const sendForm = (form: Form) => {
    if (!selectedContact) return;
    
    const newMessage = {
      id: Date.now().toString(),
      tenantId: 'tenant1',
      whatsappAccountId: 'account1',
      fromNumber: '+1111111111',
      toNumber: selectedContact.phoneNumber,
      messageType: 'form' as const,
      content: { form: form },
      status: 'sent' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isBusinessInitiated: true,
      respondedByAgentId: '3', // Current agent ID
      responseTime: 60 // Mock response time in seconds
    };
    
    setMessages([...messages, newMessage]);
    setShowFormSelector(false);
  };
  
  const sendMessage = async () => {
    if (!messageText.trim() || !selectedContact) return;
    
    const newMessage = {
      id: Date.now().toString(),
      tenantId: 'tenant1',
      whatsappAccountId: 'account1',
      fromNumber: '+1111111111',
      toNumber: selectedContact.phoneNumber,
      messageType: 'text' as const,
      content: { text: messageText },
      status: 'sent' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isBusinessInitiated: true,
      respondedByAgentId: '3', // Current agent ID
      responseTime: 30 // Mock response time in seconds
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
    
  };
  
  const handleSelectQuickReply = (message: string) => {
    setMessageText(message);
  };
  
  return (
    <div className="flex h-full">
      {/* Contacts sidebar */}
      <div className="w-1/4 border-r overflow-y-auto">
        <div className="p-4">
          <Input placeholder="Search contacts..." className="mb-4" />
          
          <Tabs defaultValue="all">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="assigned" className="flex-1">Assigned</TabsTrigger>
              <TabsTrigger value="unassigned" className="flex-1">Unassigned</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4 space-y-2">
              {contacts.map(contact => (
                <Card 
                  key={contact.id}
                  className={`cursor-pointer ${selectedContact?.id === contact.id ? 'bg-gray-100' : ''}`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <CardContent className="p-4">
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-gray-500">{contact.phoneNumber}</div>
                    <div className="flex mt-1 gap-1">
                      {contact.labels.map(label => (
                        <span 
                          key={label.name}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ backgroundColor: `${label.color}20`, color: label.color }}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            {/* Other tabs content */}
            <TabsContent value="assigned" className="mt-4">
              <div className="text-center text-gray-500 py-4">No assigned contacts</div>
            </TabsContent>
            
            <TabsContent value="unassigned" className="mt-4">
              <div className="text-center text-gray-500 py-4">No unassigned contacts</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <div className="font-medium">{selectedContact.name}</div>
                <div className="text-sm text-gray-500">{selectedContact.phoneNumber}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Phone size={20} />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map(message => {
                const isIncoming = message.fromNumber === selectedContact.phoneNumber;
                
                return (
                  <div 
                    key={message.id}
                    className={`flex ${isIncoming ? 'justify-start' : 'justify-end'}`}
                  >
                    <div 
                      className={`max-w-[70%] p-3 rounded-lg ${
                        isIncoming ? 'bg-gray-100' : 'bg-blue-500 text-white'
                      }`}
                    >
                      {message.messageType === 'text' && (
                        <div>{message.content.text}</div>
                      )}
                      
                      {message.messageType === 'audio' && (
                        <div className="flex flex-col">
                          <audio src={message.content.audio} controls className="max-w-full" />
                          <div className="text-xs mt-1">
                            {message.voiceNoteDuration && `${Math.floor(message.voiceNoteDuration / 60)}:${(message.voiceNoteDuration % 60).toString().padStart(2, '0')}`}
                          </div>
                        </div>
                      )}
                      
                      {message.messageType === 'form' && (
                        <div className="flex flex-col">
                          <div className="font-medium mb-1">
                            {message.content.form.name}
                          </div>
                          <div className="text-sm mb-2">
                            {message.content.form.description}
                          </div>
                          <Button 
                            size="sm" 
                            variant={isIncoming ? "default" : "outline"}
                            className={isIncoming ? "bg-white text-blue-500 hover:bg-gray-50" : ""}
                          >
                            Fill out form
                          </Button>
                        </div>
                      )}
                      
                      <div className={`text-xs mt-1 ${isIncoming ? 'text-gray-500' : 'text-blue-100'}`}>
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Image size={20} />
                </Button>
                
                {!isRecording && !audioBlob && (
                  <Input 
                    placeholder="Type a message..." 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                )}
                
                {isRecording && (
                  <div className="flex-1 flex items-center justify-between px-3 h-9 border border-red-500 rounded-md bg-red-50">
                    <div className="flex items-center">
                      <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-red-500"></span>
                      <span>Recording... {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span>
                      {recordingTime >= 170 && (
                        <span className="ml-2 text-red-500 text-xs flex items-center">
                          <AlertCircle size={12} className="mr-1" />
                          Recording limit approaching!
                        </span>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={stopRecording}>
                      <MicOff size={16} className="text-red-500" />
                    </Button>
                  </div>
                )}
                
                {audioBlob && !isRecording && (
                  <div className="flex-1 flex items-center justify-between px-3 h-9 border rounded-md bg-blue-50">
                    <div className="flex items-center">
                      <span className="mr-2">Voice message ready ({Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')})</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setAudioBlob(null)}>
                        Cancel
                      </Button>
                      <Button variant="ghost" size="sm" onClick={sendVoiceNote}>
                        Send
                      </Button>
                    </div>
                  </div>
                )}
                
                {!isRecording && !audioBlob && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowFormSelector(!showFormSelector)}
                      className="text-gray-500 hover:text-blue-500"
                      title="Send a form"
                    >
                      <FileText size={20} />
                    </Button>
                    
                    {showFormSelector && (
                      <div className="absolute bottom-16 right-24 w-64 bg-white border rounded-md shadow-lg z-10">
                        <div className="p-2 border-b font-medium">Select a form</div>
                        <div className="max-h-48 overflow-y-auto">
                          {forms.map(form => (
                            <button
                              key={form.id}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100"
                              onClick={() => sendForm(form)}
                            >
                              {form.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                {!isRecording && !audioBlob && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={startRecording}
                    className="text-gray-500 hover:text-red-500"
                    title="Record voice note (max 3 minutes)"
                  >
                    <Mic size={20} />
                  </Button>
                )}
                
                <Button variant="ghost" size="icon">
                  <Smile size={20} />
                </Button>
                
                {!isRecording && !audioBlob && (
                  <>
                    <QuickReplies onSelectReply={handleSelectQuickReply} />
                    
                    <Button onClick={sendMessage} disabled={!messageText.trim()}>
                      <Send size={20} className="mr-2" />
                      Send
                    </Button>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Select a contact to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentWorkspace;
