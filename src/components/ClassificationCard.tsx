
import { Classification } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";

interface ClassificationCardProps {
  classification: Classification;
  onEdit: () => void;
  onDelete: () => void;
}

const ClassificationCard: React.FC<ClassificationCardProps> = ({ 
  classification, 
  onEdit, 
  onDelete 
}) => {
  const navigate = useNavigate();
  
  const viewClassification = () => {
    navigate(`/classification/${classification.id}`);
  };

  return (
    <Card className="overflow-hidden">
      <div 
        className="h-24 bg-primary flex items-center justify-center text-primary-foreground cursor-pointer"
        onClick={viewClassification}
      >
        <h3 className="text-2xl font-bold">{classification.name}</h3>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">
          Created: {classification.createdAt.toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit size={16} className="mr-1" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 size={16} className="mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClassificationCard;
