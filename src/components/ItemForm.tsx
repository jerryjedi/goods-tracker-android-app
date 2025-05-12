
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Item } from "@/types";

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (itemData: {
    name: string;
    photoUrl?: string;
    purchaseDate: Date;
    price: number;
    memo: string;
  }) => void;
  title: string;
  initialValues?: Partial<Item>;
}

const ItemForm: React.FC<ItemFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialValues,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    photoUrl: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    price: "",
    memo: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || "",
        photoUrl: initialValues.photoUrl || "",
        purchaseDate: initialValues.purchaseDate 
          ? new Date(initialValues.purchaseDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        price: initialValues.price?.toString() || "",
        memo: initialValues.memo || "",
      });
    } else {
      setFormData({
        name: "",
        photoUrl: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        price: "",
        memo: "",
      });
    }
    setErrors({});
  }, [initialValues, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = "Purchase date is required";
    }
    
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = "Price must be a valid number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit({
      name: formData.name.trim(),
      photoUrl: formData.photoUrl.trim() || undefined,
      purchaseDate: new Date(formData.purchaseDate),
      price: parseFloat(formData.price),
      memo: formData.memo.trim(),
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <Label htmlFor="photoUrl">Photo URL</Label>
              <Input
                id="photoUrl"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="purchaseDate">Purchase Date *</Label>
              <Input
                id="purchaseDate"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleChange}
                className={errors.purchaseDate ? "border-destructive" : ""}
              />
              {errors.purchaseDate && <p className="text-destructive text-sm mt-1">{errors.purchaseDate}</p>}
            </div>
            
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && <p className="text-destructive text-sm mt-1">{errors.price}</p>}
            </div>
            
            <div>
              <Label htmlFor="memo">Memo</Label>
              <Textarea
                id="memo"
                name="memo"
                value={formData.memo}
                onChange={handleChange}
                rows={3}
                placeholder="Add notes about this item..."
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemForm;
