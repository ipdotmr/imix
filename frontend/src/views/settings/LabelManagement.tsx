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
import { Label as UILabel } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Edit, Trash2, Plus, Tag } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageProvider';
import { Label, LabelColor } from '../../types';
import api from '../../services/api';
import { useToast } from "../../components/ui/use-toast";

const LabelManagement: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: LabelColor.BLUE,
    description: ''
  });

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await api.get('/api/labels');
        setLabels(response.data);
      } catch (error) {
        console.error('Error fetching labels:', error);
        toast({
          title: t('common.error'),
          description: t('labels.fetchError'),
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLabels();
  }, [t, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddLabel = () => {
    setEditingLabel(null);
    setFormData({
      name: '',
      color: LabelColor.BLUE,
      description: ''
    });
    setDialogOpen(true);
  };

  const handleEditLabel = (label: Label) => {
    setEditingLabel(label);
    setFormData({
      name: label.name,
      color: label.color,
      description: label.description || ''
    });
    setDialogOpen(true);
  };

  const handleDeleteLabel = async (id: string) => {
    if (!confirm(t('labels.confirmDelete'))) {
      return;
    }
    
    try {
      await api.delete(`/api/labels/${id}`);
      setLabels(labels.filter(label => label.id !== id));
      toast({
        title: t('common.success'),
        description: t('labels.deleteSuccess'),
        variant: 'success'
      });
    } catch (error) {
      console.error('Error deleting label:', error);
      toast({
        title: t('common.error'),
        description: t('labels.deleteError'),
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLabel) {
        const response = await api.put(`/api/labels/${editingLabel.id}`, formData);
        setLabels(labels.map(label => 
          label.id === editingLabel.id ? response.data : label
        ));
        toast({
          title: t('common.success'),
          description: t('labels.updateSuccess'),
          variant: 'success'
        });
      } else {
        const response = await api.post('/api/labels', formData);
        setLabels([...labels, response.data]);
        toast({
          title: t('common.success'),
          description: t('labels.createSuccess'),
          variant: 'success'
        });
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving label:', error);
      toast({
        title: t('common.error'),
        description: t('labels.saveError'),
        variant: 'destructive'
      });
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

  if (loading) {
    return <div className="flex items-center justify-center h-64">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('labels.title')}</h1>
        <Button onClick={handleAddLabel}>
          <Plus size={16} className="mr-2" />
          {t('labels.addLabel')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('labels.title')}</CardTitle>
          <CardDescription>{t('labels.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {labels.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t('labels.noLabels')}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('labels.name')}</TableHead>
                  <TableHead>{t('labels.color')}</TableHead>
                  <TableHead>{t('labels.description')}</TableHead>
                  <TableHead>{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labels.map(label => (
                  <TableRow key={label.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${getLabelColorClass(label.color)}`}></span>
                        {label.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getLabelColorClass(label.color)}`}>
                        {label.color}
                      </span>
                    </TableCell>
                    <TableCell>{label.description || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditLabel(label)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteLabel(label.id)}>
                          <Trash2 size={16} />
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingLabel ? t('labels.editLabel') : t('labels.addLabel')}</DialogTitle>
            <DialogDescription>
              {editingLabel
                ? t('labels.editLabelDescription')
                : t('labels.addLabelDescription')}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <UILabel htmlFor="name">{t('labels.name')}</UILabel>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <UILabel htmlFor="color">{t('labels.color')}</UILabel>
                <Select
                  value={formData.color}
                  onValueChange={(value) => setFormData({ ...formData, color: value as LabelColor })}
                >
                  <SelectTrigger id="color">
                    <SelectValue placeholder={t('labels.selectColor')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={LabelColor.RED}>
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                        {t('colors.red')}
                      </div>
                    </SelectItem>
                    <SelectItem value={LabelColor.ORANGE}>
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                        {t('colors.orange')}
                      </div>
                    </SelectItem>
                    <SelectItem value={LabelColor.YELLOW}>
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                        {t('colors.yellow')}
                      </div>
                    </SelectItem>
                    <SelectItem value={LabelColor.GREEN}>
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                        {t('colors.green')}
                      </div>
                    </SelectItem>
                    <SelectItem value={LabelColor.BLUE}>
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                        {t('colors.blue')}
                      </div>
                    </SelectItem>
                    <SelectItem value={LabelColor.PURPLE}>
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                        {t('colors.purple')}
                      </div>
                    </SelectItem>
                    <SelectItem value={LabelColor.PINK}>
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-pink-500 mr-2"></span>
                        {t('colors.pink')}
                      </div>
                    </SelectItem>
                    <SelectItem value={LabelColor.GRAY}>
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
                        {t('colors.gray')}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <UILabel htmlFor="description">{t('labels.description')}</UILabel>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {editingLabel ? t('common.update') : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabelManagement;
