
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

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "";
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  // Use photoData if available, otherwise fall back to photoUrl
  const imageSource = item.photoData || item.photoUrl;

  return (
    <Card 
      className="cursor-pointer transition-transform hover:scale-105"
      onClick={viewItem}
    >
      <div className="h-32 bg-accent flex items-center justify-center">
        {imageSource ? (
          <img 
            src={imageSource} 
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
          {item.price !== undefined && item.price !== null ? (
            <p className="text-sm text-muted-foreground truncate">
              {formatCurrency(item.price)}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground truncate">No price</p>
          )}
          {item.purchaseDate ? (
            <p className="text-sm text-muted-foreground truncate">
              {new Date(item.purchaseDate).toLocaleDateString()}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground truncate">No date</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
