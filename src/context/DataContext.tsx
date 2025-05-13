
import React, { createContext, useContext, useState, useEffect } from "react";
import { Classification, Item, ExportOptions } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

interface DataContextType {
  classifications: Classification[];
  items: Item[];
  addClassification: (name: string) => void;
  updateClassification: (id: string, name: string) => void;
  deleteClassification: (id: string) => void;
  addItem: (item: Omit<Item, "id" | "createdAt">) => void;
  updateItem: (id: string, item: Partial<Omit<Item, "id" | "createdAt" | "classificationId">>) => void;
  deleteItem: (id: string) => void;
  getItemsByClassification: (classificationId: string) => Item[];
  getClassification: (id: string) => Classification | undefined;
  getItem: (id: string) => Item | undefined;
  exportData: (options: ExportOptions) => string;
  downloadExport: (options: ExportOptions) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LOCAL_STORAGE_CLASSIFICATIONS_KEY = 'inventory_classifications';
const LOCAL_STORAGE_ITEMS_KEY = 'inventory_items';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedClassifications = localStorage.getItem(LOCAL_STORAGE_CLASSIFICATIONS_KEY);
      const storedItems = localStorage.getItem(LOCAL_STORAGE_ITEMS_KEY);
      
      if (storedClassifications) {
        const parsedClassifications = JSON.parse(storedClassifications);
        // Convert date strings back to Date objects
        setClassifications(parsedClassifications.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt)
        })));
      }
      
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        // Convert date strings back to Date objects
        setItems(parsedItems.map((i: any) => ({
          ...i,
          purchaseDate: i.purchaseDate ? new Date(i.purchaseDate) : null,
          createdAt: new Date(i.createdAt)
        })));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      toast.error("Failed to load saved data");
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CLASSIFICATIONS_KEY, JSON.stringify(classifications));
    } catch (error) {
      console.error("Error saving classifications to localStorage:", error);
      toast.error("Failed to save classifications");
    }
  }, [classifications]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving items to localStorage:", error);
      toast.error("Failed to save items");
    }
  }, [items]);

  const addClassification = (name: string) => {
    const newClassification: Classification = {
      id: uuidv4(),
      name,
      createdAt: new Date()
    };
    setClassifications([...classifications, newClassification]);
    toast.success(`Classification "${name}" added`);
  };

  const updateClassification = (id: string, name: string) => {
    setClassifications(classifications.map(c => 
      c.id === id ? { ...c, name } : c
    ));
    toast.success("Classification updated");
  };

  const deleteClassification = (id: string) => {
    // Check if there are items in this classification
    const hasItems = items.some(item => item.classificationId === id);
    
    if (hasItems) {
      // Delete all items in this classification
      setItems(items.filter(item => item.classificationId !== id));
    }
    
    // Delete the classification
    setClassifications(classifications.filter(c => c.id !== id));
    toast.success("Classification deleted");
  };

  const addItem = (itemData: Omit<Item, "id" | "createdAt">) => {
    try {
      const newItem: Item = {
        ...itemData,
        id: uuidv4(),
        createdAt: new Date()
      };
      setItems([...items, newItem]);
      toast.success(`Item "${itemData.name}" added`);
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item");
    }
  };

  const updateItem = (id: string, itemData: Partial<Omit<Item, "id" | "createdAt" | "classificationId">>) => {
    try {
      setItems(items.map(item => 
        item.id === id ? { ...item, ...itemData } : item
      ));
      toast.success("Item updated");
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item");
    }
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.success("Item deleted");
  };

  const getItemsByClassification = (classificationId: string) => {
    return items.filter(item => item.classificationId === classificationId);
  };

  const getClassification = (id: string) => {
    return classifications.find(c => c.id === id);
  };

  const getItem = (id: string) => {
    return items.find(item => item.id === id);
  };

  // Export data to Markdown format
  const exportData = (options: ExportOptions): string => {
    try {
      let markdown = "# My Inventory\n\n";
      
      classifications.forEach((classification) => {
        markdown += `## ${classification.name}\n\n`;
        
        const classificationItems = items.filter(
          (item) => item.classificationId === classification.id
        );
        
        if (classificationItems.length === 0) {
          markdown += "No items in this classification.\n\n";
          return;
        }
        
        classificationItems.forEach((item) => {
          markdown += `### ${item.name}\n\n`;
          
          if (item.purchaseDate) {
            markdown += `**Purchase Date:** ${new Date(item.purchaseDate).toLocaleDateString()}\n\n`;
          }
          
          if (item.price) {
            markdown += `**Price:** ${new Intl.NumberFormat('en-US', { 
              style: 'currency', 
              currency: 'USD' 
            }).format(item.price)}\n\n`;
          }
          
          if (item.memo) {
            markdown += `**Memo:**\n\n${item.memo}\n\n`;
          }
          
          if (options.includePhotos && (item.photoUrl || item.photoData)) {
            const photoData = item.photoData || item.photoUrl;
            if (photoData) {
              markdown += `**Photo:**\n\n![${item.name}](${photoData})\n\n`;
            }
          }
          
          markdown += "---\n\n";
        });
      });
      
      return markdown;
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
      return "# Export Error\n\nAn error occurred while exporting the data.";
    }
  };

  // Download exported data as a file
  const downloadExport = (options: ExportOptions) => {
    try {
      const markdown = exportData(options);
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.download = `my-inventory-${new Date().toISOString().slice(0, 10)}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Export completed successfully");
    } catch (error) {
      console.error("Error downloading export:", error);
      toast.error("Failed to download export");
    }
  };

  return (
    <DataContext.Provider value={{ 
      classifications, 
      items, 
      addClassification,
      updateClassification,
      deleteClassification,
      addItem,
      updateItem,
      deleteItem,
      getItemsByClassification,
      getClassification,
      getItem,
      exportData,
      downloadExport
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
