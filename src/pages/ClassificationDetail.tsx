
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";
import Header from "@/components/Header";
import ItemCard from "@/components/ItemCard";
import ItemForm from "@/components/ItemForm";
import NoData from "@/components/NoData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ClassificationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClassification, getItemsByClassification, addItem } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  if (!id) {
    navigate("/");
    return null;
  }

  const classification = getClassification(id);
  if (!classification) {
    navigate("/");
    return null;
  }

  const items = getItemsByClassification(id);

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddItem = (itemData: {
    name: string;
    photoUrl?: string;
    purchaseDate: Date;
    price: number;
    memo: string;
  }) => {
    addItem({
      ...itemData,
      classificationId: id,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        title={classification.name} 
        showBackButton
        rightContent={
          <Button onClick={handleAddClick} size="sm">
            <Plus size={16} className="mr-1" />
            Add Item
          </Button>
        } 
      />

      <main className="flex-1 p-4">
        {items.length === 0 ? (
          <NoData 
            message={`No items in ${classification.name}`} 
            buttonText="Add Item"
            onButtonClick={handleAddClick}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      {/* Add Item Dialog */}
      <ItemForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddItem}
        title={`Add Item to ${classification.name}`}
      />
    </div>
  );
};

export default ClassificationDetail;
