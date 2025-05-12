
import { useState } from "react";
import { useData } from "@/context/DataContext";
import Header from "@/components/Header";
import ClassificationCard from "@/components/ClassificationCard";
import ClassificationForm from "@/components/ClassificationForm";
import NoData from "@/components/NoData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

const Index = () => {
  const { classifications, addClassification, updateClassification, deleteClassification } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentClassification, setCurrentClassification] = useState<{ id: string; name: string } | null>(null);

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleAdd = (name: string) => {
    addClassification(name);
  };

  const handleEditClick = (id: string, name: string) => {
    setCurrentClassification({ id, name });
    setIsEditDialogOpen(true);
  };

  const handleEdit = (name: string) => {
    if (currentClassification) {
      updateClassification(currentClassification.id, name);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setCurrentClassification({ id, name });
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (currentClassification) {
      deleteClassification(currentClassification.id);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title="My Inventory" 
        rightContent={
          <Button onClick={handleAddClick} size="sm">
            <Plus size={16} className="mr-1" />
            Add Classification
          </Button>
        } 
      />

      <main className="flex-1 p-4">
        {classifications.length === 0 ? (
          <NoData 
            message="You don't have any classifications yet" 
            buttonText="Add Classification"
            onButtonClick={handleAddClick}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {classifications.map((classification) => (
              <ClassificationCard
                key={classification.id}
                classification={classification}
                onEdit={() => handleEditClick(classification.id, classification.name)}
                onDelete={() => handleDeleteClick(classification.id, classification.name)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Classification Dialog */}
      <ClassificationForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAdd}
        title="Add New Classification"
      />

      {/* Edit Classification Dialog */}
      <ClassificationForm
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEdit}
        title="Edit Classification"
        initialValue={currentClassification?.name || ""}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete "{currentClassification?.name}" and all items in this classification.
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

export default Index;
