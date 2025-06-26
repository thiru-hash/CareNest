
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DualListItem {
  id: string;
  name: string;
  details?: string;
}

interface DualListBoxProps {
  available: DualListItem[];
  selected: DualListItem[];
  onSelectionChange: (newSelection: DualListItem[]) => void;
  availableHeader?: string;
  selectedHeader?: string;
}

export function DualListBox({
  available,
  selected,
  onSelectionChange,
  availableHeader = "Available",
  selectedHeader = "Selected",
}: DualListBoxProps) {

  const [availableFilter, setAvailableFilter] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  const [toggledAvailable, setToggledAvailable] = useState<Set<string>>(new Set());
  const [toggledSelected, setToggledSelected] = useState<Set<string>>(new Set());

  const availableItems = useMemo(() => {
    const selectedIds = new Set(selected.map(item => item.id));
    return available
      .filter(item => !selectedIds.has(item.id))
      .filter(item => item.name.toLowerCase().includes(availableFilter.toLowerCase()))
      .sort((a,b) => a.name.localeCompare(b.name));
  }, [available, selected, availableFilter]);

  const selectedItems = useMemo(() => {
    return [...selected]
      .filter(item => item.name.toLowerCase().includes(selectedFilter.toLowerCase()))
      .sort((a,b) => a.name.localeCompare(b.name));
  }, [selected, selectedFilter]);

  const handleToggle = (id: string, list: "available" | "selected") => {
    const [toggled, setToggled] = list === 'available' ? [toggledAvailable, setToggledAvailable] : [toggledSelected, setToggledSelected];
    const newToggled = new Set(toggled);
    if (newToggled.has(id)) {
      newToggled.delete(id);
    } else {
      newToggled.add(id);
    }
    setToggled(newToggled);
  };
  
  const moveSelected = () => {
    const itemsToMove = availableItems.filter(item => toggledAvailable.has(item.id));
    onSelectionChange([...selected, ...itemsToMove]);
    setToggledAvailable(new Set());
  };

  const moveAll = () => {
    onSelectionChange([...selected, ...availableItems]);
  };
  
  const removeSelected = () => {
    const newSelected = selected.filter(item => !toggledSelected.has(item.id));
    onSelectionChange(newSelected);
    setToggledSelected(new Set());
  };
  
  const removeAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 h-full py-4">
      {/* Available List */}
      <div className="border rounded-lg flex flex-col h-full">
        <div className="p-2 border-b">
          <h3 className="font-semibold text-sm mb-2">{availableHeader} ({availableItems.length})</h3>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter..."
              value={availableFilter}
              onChange={(e) => setAvailableFilter(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>
        <ScrollArea className="flex-grow">
          <div className="p-1">
            {availableItems.map(item => (
              <div
                key={item.id}
                onClick={() => handleToggle(item.id, 'available')}
                className={cn("p-2 rounded-md cursor-pointer hover:bg-muted text-sm", toggledAvailable.has(item.id) && "bg-primary/20 hover:bg-primary/30")}
              >
                <p className="font-medium truncate">{item.name}</p>
                {item.details && <p className="text-xs text-muted-foreground truncate">{item.details}</p>}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col justify-center items-center gap-2">
        <Button variant="outline" size="icon" onClick={moveAll} aria-label="Move all to selected">
          <ChevronsRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={moveSelected} aria-label="Move selected to selected">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={removeSelected} aria-label="Move selected to available">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={removeAll} aria-label="Move all to available">
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Selected List */}
       <div className="border rounded-lg flex flex-col h-full">
        <div className="p-2 border-b">
          <h3 className="font-semibold text-sm mb-2">{selectedHeader} ({selectedItems.length})</h3>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter..."
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>
        <ScrollArea className="flex-grow">
          <div className="p-1">
            {selectedItems.map(item => (
              <div
                key={item.id}
                onClick={() => handleToggle(item.id, 'selected')}
                className={cn("p-2 rounded-md cursor-pointer hover:bg-muted text-sm", toggledSelected.has(item.id) && "bg-primary/20 hover:bg-primary/30")}
              >
                 <p className="font-medium truncate">{item.name}</p>
                {item.details && <p className="text-xs text-muted-foreground truncate">{item.details}</p>}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

    </div>
  );
}
