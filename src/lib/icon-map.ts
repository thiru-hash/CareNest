
import * as icons from "lucide-react";

export const iconMap = icons as {
    [key: string]: React.ForwardRefExoticComponent<any>;
};

export type LucideIconName = keyof typeof iconMap;
