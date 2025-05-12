
import { Item } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const navigate = useNavigate();
  
  const viewItem = () => {
    navigate(`/item/${item.id}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  return (
    <Card 
      className="cursor-pointer transition-transform hover:scale-105"
      onClick={viewItem}
    >
      <div className="h-32 bg-accent flex items-center justify-center">
        {item.photoUrl ? (
          <img 
            src={item.photoUrl} 
            alt={item.name} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-4xl text-accent-foreground opacity-30">📷</div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{item.name}</h3>
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground truncate">
            {formatCurrency(item.price)}
          </p>
          <p className="text-sm text-muted-foreground truncate">
            {item.purchaseDate.toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
