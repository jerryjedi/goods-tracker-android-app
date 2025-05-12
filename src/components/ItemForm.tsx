
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ImageUp } from "lucide-react";
import { Item } from "@/types";

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (itemData: {
    name: string;
    photoUrl?: string;
    purchaseDate?: Date;
    price?: number;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      
      // Set image preview if photoUrl exists
      if (initialValues.photoUrl) {
        setImagePreview(initialValues.photoUrl);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({
        name: "",
        photoUrl: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        price: "",
        memo: "",
      });
      setImagePreview(null);
    }
    setSelectedFile(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear the photoUrl as we'll use the file instead
      setFormData({ ...formData, photoUrl: "" });
    }
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (formData.price && (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0)) {
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
      photoUrl: selectedFile ? imagePreview || undefined : formData.photoUrl.trim() || undefined,
      purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
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
              <Label htmlFor="photo">Photo</Label>
              <div className="mt-1 flex flex-col items-center">
                {imagePreview && (
                  <div className="relative w-full h-40 mb-3">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleSelectFile}
                  className="w-full flex items-center justify-center"
                >
                  <ImageUp className="mr-2 h-4 w-4" />
                  {selectedFile ? "Change Image" : "Upload Image"}
                </Button>
                
                {!selectedFile && (
                  <div className="mt-2 w-full">
                    <Label htmlFor="photoUrl">Or enter image URL</Label>
                    <Input
                      id="photoUrl"
                      name="photoUrl"
                      value={formData.photoUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="purchaseDate">Purchase Date (Optional)</Label>
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
              <Label htmlFor="price">Price (Optional)</Label>
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
