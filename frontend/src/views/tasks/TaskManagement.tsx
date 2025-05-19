import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "../../components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Filter 
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus, User } from '../../types';
import api from '../../services/api';
import { notifyTaskAssigned } from '../../services/notification';

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    dueDate: '',
    assignedTo: [] as string[]
  });
  
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: '1',
        tenantId: 'tenant1',
        title: 'Follow up with customer about order',
        description: 'Customer requested information about their recent order #12345',
        priority: 'high',
        status: 'open',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: [
          {
            agentId: '3',
            assignedAt: new Date().toISOString(),
            assignedBy: '1'
          }
        ],
        createdBy: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        relatedContactId: '1'
      },
      {
        id: '2',
        tenantId: 'tenant1',
        title: 'Prepare quotation for new client',
        description: 'New client requested pricing for our premium package',
        priority: 'medium',
        status: 'in_progress',
        assignedTo: [
          {
            agentId: '2',
            assignedAt: new Date().toISOString(),
            assignedBy: '1'
          }
        ],
        createdBy: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        tenantId: 'tenant1',
        title: 'Update client contact information',
        description: 'Client has moved to a new address and changed phone number',
        priority: 'low',
        status: 'completed',
        assignedTo: [
          {
            agentId: '3',
            assignedAt: new Date().toISOString(),
            assignedBy: '1'
          }
        ],
        createdBy: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        completedBy: '3',
        relatedContactId: '2'
      }
    ];
    
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        tenantId: 'tenant1',
        role: 'admin',
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        email: 'manager@example.com',
        firstName: 'Manager',
        lastName: 'User',
        tenantId: 'tenant1',
        role: 'manager',
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        email: 'agent@example.com',
        firstName: 'Agent',
        lastName: 'User',
        tenantId: 'tenant1',
        role: 'agent',
        active: true,
        createdAt: new Date().toISOString()
      }
    ];
    
    setTasks(mockTasks);
    setUsers(mockUsers);
    setLoading(false);
    
    // 
    // 
  }, []);
  
  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);
  
  const handleAddTask = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignedTo: []
    });
    setDialogOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate || '',
      assignedTo: task.assignedTo.map(assignment => assignment.agentId)
    });
    setDialogOpen(true);
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTask) {
      const updatedTask = {
        ...editingTask,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
        assignedTo: formData.assignedTo.map(agentId => ({
          agentId,
          assignedAt: new Date().toISOString(),
          assignedBy: '1' // Current user ID
        })),
        updatedAt: new Date().toISOString()
      };
      
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? updatedTask : task
      ));
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        tenantId: 'tenant1',
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: 'open',
        dueDate: formData.dueDate || undefined,
        assignedTo: formData.assignedTo.map(agentId => ({
          agentId,
          assignedAt: new Date().toISOString(),
          assignedBy: '1' // Current user ID
        })),
        createdBy: '1', // Current user ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTasks([...tasks, newTask]);
      
      if (formData.assignedTo.length > 0) {
        notifyTaskAssigned(formData.title);
      }
    }
    
    setDialogOpen(false);
    
  };
  
  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status };
        
        if (status === 'completed') {
          updatedTask.completedAt = new Date().toISOString();
          updatedTask.completedBy = '1'; // Current user ID
        } else {
          delete updatedTask.completedAt;
          delete updatedTask.completedBy;
        }
        
        return updatedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
    
  };
  
  const getUserName = (userId: string) => {
    const user = users.find(user => user.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };
  
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-green-100 text-green-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Task Management</h1>
        <Button onClick={handleAddTask}>
          <Plus size={16} className="mr-2" />
          Add Task
        </Button>
      </div>
      
      <div className="flex items-center space-x-4">
        <Label htmlFor="filter" className="flex items-center">
          <Filter size={16} className="mr-2" />
          Filter by Status:
        </Label>
        <Select value={filter} onValueChange={(value) => setFilter(value as TaskStatus | 'all')}>
          <SelectTrigger id="filter" className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Manage and track tasks assigned to your team</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tasks found. Create a new task to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map(task => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ').split(' ').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      {task.assignedTo.length > 0 ? (
                        <div className="flex flex-col space-y-1">
                          {task.assignedTo.map(assignment => (
                            <div key={assignment.agentId} className="text-sm">
                              {getUserName(assignment.agentId)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {task.dueDate ? (
                        <div className="flex items-center text-sm">
                          <Calendar size={14} className="mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-500">No due date</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditTask(task)}>
                          <Edit size={14} />
                        </Button>
                        
                        {task.status !== 'completed' ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600"
                            onClick={() => handleStatusChange(task.id, 'completed')}
                          >
                            <CheckCircle size={14} />
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-blue-600"
                            onClick={() => handleStatusChange(task.id, 'open')}
                          >
                            <AlertCircle size={14} />
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
            <DialogDescription>
              {editingTask 
                ? 'Update the task details below.' 
                : 'Fill in the details to create a new task.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => setFormData({ ...formData, priority: value as TaskPriority })}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date (Optional)</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select 
                  value={formData.assignedTo[0] || ''} 
                  onValueChange={(value) => setFormData({ ...formData, assignedTo: [value] })}
                >
                  <SelectTrigger id="assignedTo">
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter(user => user.role === 'agent' || user.role === 'manager')
                      .map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskManagement;
