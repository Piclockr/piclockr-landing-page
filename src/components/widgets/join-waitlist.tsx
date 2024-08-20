import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { DialogClose } from "@radix-ui/react-dialog";
import * as z from "zod";

export function JoinWaitlist() {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const { toast } = useToast();

    const formSchema = z.object({
        email: z.string().email(),
        acceptPrivacyPolicy: z.boolean().refine((value) => value === true, {
            message: "You must accept the privacy policy to join the waitlist.",
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            acceptPrivacyPolicy: false,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (isSuccess) return;

        setIsPending(true);
        setIsSuccess(false);
        setIsError(false);

        const response = await fetch("/api/waitlist", {
            method: "POST",
            body: JSON.stringify(values),
        });

        setIsPending(false);

        if (response.ok) {
            setIsError(false);
            setIsSuccess(true);
            toast({
                title: "Join Waitlist",
                description: "Please check your email account to confirm your email.",
            });
        } else {
            setIsSuccess(false);
            setIsError(true);

            toast({
                variant: "destructive",
                title: "Join Waitlist",
                description: "Something went wrong. Please try again.",
            });
        }
    };

    const onOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setIsPending(false);
            setIsSuccess(false);
            setIsError(false);
            form.reset();
        }
    };

    return (
        <>
            <Form {...form}>
                <Dialog onOpenChange={onOpenChange}>
                    <DialogTrigger asChild>
                        <Button variant="default" className="px-8 py-6" disabled>
                            Coming soon...
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                            <DialogHeader>
                                <DialogTitle>Join Waitlist</DialogTitle>
                                <DialogDescription>Enter your email to join our waitlist. We'll notify you when we launch.</DialogDescription>
                                <div className="grid gap-4 py-4 items-baseline">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormControl>
                                                    <Input placeholder="Enter Email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="acceptPrivacyPolicy"
                                        render={({ field }) => (
                                            <FormItem id="formItem" className="w-full">
                                                <FormControl>
                                                    <div className="flex flex-row space-x-2 items-center text-left">
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />

                                                        <div className="grid gap-1.5 leading-none">
                                                            <p className="text-sm text-muted-foreground">
                                                                I have read and accepted the{" "}
                                                                <a href="/legal/privacypolicy" target="_blank" className="underline">
                                                                    Privacy Policy
                                                                </a>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </DialogHeader>
                            <DialogFooter className="flex flex-row gap-2 justify-end w-full">
                                <Button type="submit" size="lg" className="px-3 w-20 h-[40px]" disabled={isPending}>
                                    {isPending && <Icon icon="lucide:loader-2" className="mr-2 h-4 w-4 animate-spin" />}
                                    {isSuccess && <Icon icon="lucide:check-circle" className={"mr-2 h-4 w-4 text-green-500"} />}
                                    Send
                                </Button>
                                <div>
                                    <DialogClose asChild>
                                        <Button variant="outline">Close</Button>
                                    </DialogClose>
                                </div>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </Form>
        </>
    );
}
