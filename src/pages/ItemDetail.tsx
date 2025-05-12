
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import Header from "@/components/Header";
import ItemForm from "@/components/ItemForm";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItem, updateItem, deleteItem, getClassification } = useData();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  if (!id) {
    navigate("/");
    return null;
  }

  const item = getItem(id);
  if (!item) {
    navigate("/");
    return null;
  }

  const classification = getClassification(item.classificationId);

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "Not specified";
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = (itemData: {
    name: string;
    photoUrl?: string;
    purchaseDate?: Date;
    price?: number;
    memo: string;
  }) => {
    updateItem(id, itemData);
  };

  const handleDelete = () => {
    deleteItem(id);
    navigate(`/classification/${item.classificationId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title={item.name} 
        showBackButton
      />

      <main className="flex-1 p-4">
        <Card>
          {item.photoUrl && (
            <div className="h-64 w-full overflow-hidden">
              <img 
                src={item.photoUrl} 
                alt={item.name} 
                className="h-full w-full object-cover"
              />
            </div>
          )}
          
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{item.name}</h2>
              <div className="text-xl font-medium text-primary">
                {formatCurrency(item.price)}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Classification</h3>
                <p>{classification?.name || "Unknown"}</p>
              </div>
              
              {item.purchaseDate && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">Purchase Date</h3>
                  <p>{item.purchaseDate.toLocaleDateString()}</p>
                </div>
              )}
              
              {item.memo && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">Memo</h3>
                  <p className="whitespace-pre-line">{item.memo}</p>
                </div>
              )}
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1" onClick={handleEditClick}>
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleDeleteClick}>
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Edit Item Dialog */}
      <ItemForm
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEdit}
        title="Edit Item"
        initialValues={item}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete "{item.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ItemDetail;
