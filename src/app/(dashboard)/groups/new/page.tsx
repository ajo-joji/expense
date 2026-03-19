"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "@/services/groups";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const groupSchema = z.object({
    name: z.string().min(2, { message: "Group name must be at least 2 characters" }),
    description: z.string().optional(),
    group_type: z.string().optional(),
});

export default function NewGroupPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof groupSchema>>({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: "",
            description: "",
            group_type: "trip",
        },
    });

    const createMutation = useMutation({
        mutationFn: createGroup,
        onSuccess: (newGroup) => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
            router.push(`/groups/${newGroup.id}`);
        },
        onError: (error) => alert("Failed to create group: " + error.message)
    });

    const onSubmit = (values: z.infer<typeof groupSchema>) => {
        createMutation.mutate(values);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-xl mx-auto mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Create a New Group</CardTitle>
                    <CardDescription>Setup a group to start sharing expenses.</CardDescription>
                </CardHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Group Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Summer Vacation, Roommates"
                                {...form.register("name")}
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="group_type">Group Type</Label>
                            <select
                                id="group_type"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                {...form.register("group_type")}
                            >
                                <option value="trip">Trip</option>
                                <option value="home">Home / Roommates</option>
                                <option value="couple">Couple</option>
                                <option value="project">Project</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input
                                id="description"
                                placeholder="What is this group for?"
                                {...form.register("description")}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending ? "Creating..." : "Create Group"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
