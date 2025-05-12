
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBackButton = false,
  rightContent
}) => {
  const navigate = useNavigate();
  
  const goBack = () => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-border py-4 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={goBack} className="mr-2">
              <ArrowLeft size={20} />
            </Button>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        {rightContent}
      </div>
    </header>
  );
};

export default Header;
