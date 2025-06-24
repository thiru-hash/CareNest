import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockGroups, mockSections } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export function RightsManagement() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Rights Management</CardTitle>
                <CardDescription>Define what user groups can see and do within each section of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="max-w-xs">
                    <Label>Select a group to manage their rights</Label>
                    <Select defaultValue={mockGroups[0].id}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                        <SelectContent>
                            {mockGroups.map((group) => (
                                <SelectItem key={group.id} value={group.id}>
                                    {group.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Section</TableHead>
                                <TableHead className="text-center">View</TableHead>
                                <TableHead className="text-center">Create</TableHead>
                                <TableHead className="text-center">Edit</TableHead>
                                <TableHead className="text-center">Delete</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockSections.map((section, index) => (
                                <TableRow key={section.id}>
                                    <TableCell className="font-medium">{section.name}</TableCell>
                                    <TableCell className="text-center"><Checkbox defaultChecked={index < 3} /></TableCell>
                                    <TableCell className="text-center"><Checkbox defaultChecked={index < 2} /></TableCell>
                                    <TableCell className="text-center"><Checkbox defaultChecked={index < 2} /></TableCell>
                                    <TableCell className="text-center"><Checkbox defaultChecked={index === 0} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
