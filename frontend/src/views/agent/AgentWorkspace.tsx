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
  FileText,
  Tag,
  Plus
} from "lucide-react";
import { Message, Contact, Form, Label, LabelColor } from '../../types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
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
  const [labels, setLabels] = useState<Label[]>([]);
  const [conversationLabels, setConversationLabels] = useState<{[key: string]: Label[]}>({});
  
  useEffect(() => {
    const mockLabels: Label[] = [
      {
        id: '1',
        tenantId: 'tenant1',
        name: 'Urgent',
        color: LabelColor.RED,
        description: 'Needs immediate attention',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        tenantId: 'tenant1',
        name: 'Support',
        color: LabelColor.BLUE,
        description: 'Support related queries',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        tenantId: 'tenant1',
        name: 'Sales',
        color: LabelColor.GREEN,
        description: 'Sales related queries',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        tenantId: 'tenant1',
        name: 'Feedback',
        color: LabelColor.PURPLE,
        description: 'Customer feedback',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    setLabels(mockLabels);
    
    const mockContacts: Contact[] = [
      { 
        id: '1', 
        tenantId: 'tenant1',
        whatsappAccountId: 'account1',
        phoneNumber: '+1234567890', 
        name: 'John Doe', 
        profileName: 'John', 
        labels: [mockLabels[2]], // Sales label
        customFields: {},
        variantFieldValues: {
          'customerType': 'VIP',
          'accountManager': 'Sarah Johnson',
          'lastPurchase': '2023-05-15'
        },
        groupIds: ['1'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '2', 
        tenantId: 'tenant1',
        whatsappAccountId: 'account1',
        phoneNumber: '+0987654321', 
        name: 'Jane Smith', 
        profileName: 'Jane', 
        labels: [mockLabels[1]], // Support label
        customFields: {},
        variantFieldValues: {
          'leadSource': 'Website',
          'leadScore': '8',
          'interestedIn': 'Premium Plan'
        },
        groupIds: ['2'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
    ];
    
    setContacts(mockContacts);
    
    setConversationLabels({
      '1': [mockLabels[2]], // Sales label for John Doe
      '2': [mockLabels[1]]  // Support label for Jane Smith
    });
    
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
          labels: [],
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
          labels: [],
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
          labels: [],
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
      labels: [],
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
      labels: [],
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
      labels: [],
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
  
  const getConversationLabels = (contactId: string) => {
    return conversationLabels[contactId] || [];
  };

  const addLabelToConversation = async (contactId: string, labelId: string) => {
    try {
      const label = labels.find(l => l.id === labelId);
      if (!label) return;
      
      setConversationLabels(prev => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), label]
      }));
    } catch (error) {
      console.error('Error adding label to conversation:', error);
    }
  };

  const removeLabelFromConversation = async (contactId: string, labelId: string) => {
    try {
      setConversationLabels(prev => ({
        ...prev,
        [contactId]: (prev[contactId] || []).filter(l => l.id !== labelId)
      }));
    } catch (error) {
      console.error('Error removing label from conversation:', error);
    }
  };

  const getLabelColorClass = (color: LabelColor) => {
    switch (color) {
      case LabelColor.RED:
        return 'bg-red-100 text-red-800';
      case LabelColor.ORANGE:
        return 'bg-orange-100 text-orange-800';
      case LabelColor.YELLOW:
        return 'bg-yellow-100 text-yellow-800';
      case LabelColor.GREEN:
        return 'bg-green-100 text-green-800';
      case LabelColor.BLUE:
        return 'bg-blue-100 text-blue-800';
      case LabelColor.PURPLE:
        return 'bg-purple-100 text-purple-800';
      case LabelColor.PINK:
        return 'bg-pink-100 text-pink-800';
      case LabelColor.GRAY:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            <div className="p-4 border-b flex flex-col">
              <div className="flex items-center justify-between">
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
              
              {/* Labels */}
              <div className="flex items-center space-x-2 mt-2">
                {getConversationLabels(selectedContact.id).map(label => (
                  <div 
                    key={label.id} 
                    className={`px-2 py-1 rounded-full text-xs flex items-center ${getLabelColorClass(label.color)}`}
                  >
                    <Tag size={12} className="mr-1" />
                    {label.name}
                    <button 
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      onClick={() => removeLabelFromConversation(selectedContact.id, label.id)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-6 px-2">
                      <Plus size={12} className="mr-1" />
                      Add Label
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2">
                    <div className="space-y-1">
                      {labels.map(label => (
                        <button
                          key={label.id}
                          className={`w-full text-left px-2 py-1 rounded text-sm flex items-center ${getLabelColorClass(label.color)}`}
                          onClick={() => {
                            addLabelToConversation(selectedContact.id, label.id);
                            document.body.click(); // Close popover
                          }}
                        >
                          <Tag size={12} className="mr-2" />
                          {label.name}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Display variant fields */}
              {selectedContact.variantFieldValues && Object.keys(selectedContact.variantFieldValues).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(selectedContact.variantFieldValues).map(([key, value]) => (
                    <span 
                      key={key}
                      className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800"
                    >
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value}
                    </span>
                  ))}
                </div>
              )}
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
