
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NoDataProps {
  message: string;
  buttonText: string;
  onButtonClick: () => void;
}

const NoData: React.FC<NoDataProps> = ({ message, buttonText, onButtonClick }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted rounded-lg my-4">
      <p className="text-lg mb-4 text-muted-foreground">{message}</p>
      <Button onClick={onButtonClick} className="flex items-center gap-2">
        <Plus size={18} />
        {buttonText}
      </Button>
    </div>
  );
};

export default NoData;
