import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  FolderOpen,
  Eye,
  EyeOff,
  GripVertical
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  description: string;
  visible: boolean;
  itemCount: number;
  order: number;
}

export const Categories: React.FC = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Appetizers',
      description: 'Start your meal with our delicious appetizers',
      visible: true,
      itemCount: 8,
      order: 1
    },
    {
      id: '2',
      name: 'Main Courses',
      description: 'Our signature main dishes',
      visible: true,
      itemCount: 15,
      order: 2
    },
    {
      id: '3',
      name: 'Desserts',
      description: 'Sweet treats to end your meal',
      visible: true,
      itemCount: 6,
      order: 3
    },
    {
      id: '4',
      name: 'Beverages',
      description: 'Refreshing drinks and specialty cocktails',
      visible: false,
      itemCount: 12,
      order: 4
    }
  ]);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visible: true
  });

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', visible: true });
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      visible: category.visible
    });
    setIsDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    if (editingCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
      toast({
        title: "Category updated",
        description: `"${formData.name}" has been updated successfully.`,
      });
    } else {
      // Add new category
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        itemCount: 0,
        order: categories.length + 1
      };
      setCategories(prev => [...prev, newCategory]);
      toast({
        title: "Category added",
        description: `"${formData.name}" has been added successfully.`,
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    if (category && category.itemCount > 0) {
      toast({
        title: "Cannot delete category",
        description: "This category contains menu items. Please remove all items first.",
        variant: "destructive",
      });
      return;
    }

    setCategories(prev => prev.filter(cat => cat.id !== id));
    toast({
      title: "Category deleted",
      description: "The category has been deleted successfully.",
    });
  };

  const handleToggleVisibility = (id: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id 
        ? { ...cat, visible: !cat.visible }
        : cat
    ));
    
    const category = categories.find(cat => cat.id === id);
    toast({
      title: "Category updated",
      description: `"${category?.name}" is now ${category?.visible ? 'hidden' : 'visible'}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-2">
            Organize your menu items into categories
          </p>
        </div>
        <Button onClick={handleAddCategory} className="bg-gradient-primary shadow-elegant">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="admin-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{categories.length}</p>
                <p className="text-sm text-muted-foreground">Total Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="admin-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold">{categories.filter(cat => cat.visible).length}</p>
                <p className="text-sm text-muted-foreground">Visible</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="admin-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <EyeOff className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{categories.filter(cat => !cat.visible).length}</p>
                <p className="text-sm text-muted-foreground">Hidden</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories List */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            Manage your menu categories and their visibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium">{category.name}</h3>
                      <Badge variant={category.visible ? "default" : "secondary"}>
                        {category.visible ? "Visible" : "Hidden"}
                      </Badge>
                      <Badge variant="outline">
                        {category.itemCount} items
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`visible-${category.id}`} className="text-sm">
                      {category.visible ? "Visible" : "Hidden"}
                    </Label>
                    <Switch
                      id={`visible-${category.id}`}
                      checked={category.visible}
                      onCheckedChange={() => handleToggleVisibility(category.id)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={category.itemCount > 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No categories yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first category to organize your menu items
              </p>
              <Button onClick={handleAddCategory}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Category
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="admin-card">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? 'Update the category information below.'
                : 'Create a new category to organize your menu items.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="e.g., Appetizers, Main Courses, Desserts"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="admin-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of this category"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="admin-input"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                id="visible"
                checked={formData.visible}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, visible: checked }))}
              />
              <Label htmlFor="visible">Make this category visible to customers</Label>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveCategory}
                className="flex-1 bg-gradient-primary"
              >
                {editingCategory ? 'Update Category' : 'Add Category'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};