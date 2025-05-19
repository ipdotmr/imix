import React, { useState } from 'react';
import { Button } from "../ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "../ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Plus, Edit, Trash2, MessageSquare } from 'lucide-react';

export interface QuickReply {
  id: string;
  title: string;
  message: string;
  category?: string;
}

interface QuickRepliesProps {
  onSelectReply: (message: string) => void;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ onSelectReply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([
    {
      id: '1',
      title: 'Greeting',
      message: 'Hello! Thank you for contacting us. How can I assist you today?',
      category: 'General'
    },
    {
      id: '2',
      title: 'Thank You',
      message: 'Thank you for your message. We appreciate your patience.',
      category: 'General'
    },
    {
      id: '3',
      title: 'Order Status',
      message: 'Your order is currently being processed. You will receive a confirmation once it has been shipped.',
      category: 'Orders'
    },
    {
      id: '4',
      title: 'Business Hours',
      message: 'Our business hours are Monday to Friday, 9:00 AM to 5:00 PM.',
      category: 'Information'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingReply, setEditingReply] = useState<QuickReply | null>(null);
  const [newReply, setNewReply] = useState<Omit<QuickReply, 'id'>>({
    title: '',
    message: '',
    category: 'General'
  });
  
  const filteredReplies = quickReplies.filter(reply => 
    reply.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reply.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reply.category && reply.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleSelectReply = (message: string) => {
    onSelectReply(message);
    setIsOpen(false);
  };
  
  const handleAddReply = () => {
    setEditingReply(null);
    setNewReply({
      title: '',
      message: '',
      category: 'General'
    });
    setIsEditDialogOpen(true);
  };
  
  const handleEditReply = (reply: QuickReply) => {
    setEditingReply(reply);
    setNewReply({
      title: reply.title,
      message: reply.message,
      category: reply.category || 'General'
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteReply = (id: string) => {
    setQuickReplies(quickReplies.filter(reply => reply.id !== id));
  };
  
  const handleSaveReply = () => {
    if (!newReply.title || !newReply.message) return;
    
    if (editingReply) {
      setQuickReplies(quickReplies.map(reply => 
        reply.id === editingReply.id 
          ? { ...reply, ...newReply }
          : reply
      ));
    } else {
      const newId = Date.now().toString();
      setQuickReplies([...quickReplies, { id: newId, ...newReply }]);
    }
    
    setIsEditDialogOpen(false);
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="flex items-center"
        title="Quick Replies"
      >
        <MessageSquare size={16} className="mr-2" />
        Quick Replies
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Quick Replies</DialogTitle>
            <DialogDescription>
              Select a pre-defined message to send quickly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-between mb-4">
            <Input
              placeholder="Search replies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={handleAddReply}>
              <Plus size={16} className="mr-2" />
              Add Reply
            </Button>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {filteredReplies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No quick replies found. Add one to get started.
              </div>
            ) : (
              filteredReplies.map(reply => (
                <Card key={reply.id} className="hover:bg-gray-50">
                  <CardHeader className="p-3 pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{reply.title}</CardTitle>
                        {reply.category && (
                          <CardDescription className="text-xs">{reply.category}</CardDescription>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditReply(reply)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteReply(reply.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-2">
                    <p className="text-sm">{reply.message}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 w-full justify-center"
                      onClick={() => handleSelectReply(reply.message)}
                    >
                      Use This Reply
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingReply ? 'Edit Quick Reply' : 'Add Quick Reply'}</DialogTitle>
            <DialogDescription>
              {editingReply 
                ? 'Update this quick reply message.' 
                : 'Create a new quick reply message for faster responses.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newReply.title}
                onChange={(e) => setNewReply({ ...newReply, title: e.target.value })}
                placeholder="Enter a descriptive title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category (optional)</Label>
              <Input
                id="category"
                value={newReply.category || ''}
                onChange={(e) => setNewReply({ ...newReply, category: e.target.value })}
                placeholder="E.g., Greetings, Support, Orders"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={newReply.message}
                onChange={(e) => setNewReply({ ...newReply, message: e.target.value })}
                placeholder="Enter the message content"
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveReply}>
              {editingReply ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickReplies;
