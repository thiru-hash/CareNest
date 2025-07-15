
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type ComboboxOption = {
    value: string
    label: React.ReactNode
}

interface ComboboxProps {
    options: ComboboxOption[]
    value?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    searchPlaceholder?: string
    noResultsMessage?: string
    className?: string;
}

const ComboboxContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
}>({
    open: false,
    setOpen: () => {}
})

export function Combobox({ 
    options, 
    value, 
    onValueChange, 
    placeholder = "Select option...", 
    searchPlaceholder = "Search...", 
    noResultsMessage = "No option found.", 
    className 
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const selectedOption = options.find((option) => option.value === value)

    return (
        <ComboboxContext.Provider value={{ value, onValueChange, open, setOpen }}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("w-full justify-between", className)}
                    >
                        <div className="truncate">
                            {selectedOption ? selectedOption.label : placeholder}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList className="max-h-72">
                            <CommandEmpty>{noResultsMessage}</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={(currentValue) => {
                                            onValueChange?.(currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === option.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </ComboboxContext.Provider>
    )
}

export function ComboboxTrigger({ children, ...props }: React.ComponentProps<typeof PopoverTrigger>) {
    return <PopoverTrigger {...props}>{children}</PopoverTrigger>
}

export function ComboboxContent({ children, ...props }: React.ComponentProps<typeof PopoverContent>) {
    return <PopoverContent {...props}>{children}</PopoverContent>
}

export function ComboboxItem({ children, value, ...props }: React.ComponentProps<typeof CommandItem> & { value: string }) {
    return <CommandItem value={value} {...props}>{children}</CommandItem>
}

export function ComboboxValue({ placeholder }: { placeholder?: string }) {
    const context = React.useContext(ComboboxContext)
    const selectedOption = React.useMemo(() => {
        // This would need to be passed down from parent, but for now we'll use placeholder
        return null
    }, [context.value])
    
    return <span>{selectedOption ? selectedOption.label : placeholder}</span>
}
