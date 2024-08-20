import { Icon } from "@iconify/react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { twJoin, twMerge } from "tailwind-merge";

const queryClient = new QueryClient();

function Item({ title, description, icon, success }: { title: string; description: string; icon: string; success: boolean }) {
    return (
        <m.div animate={{ y: 0 }} initial={{ y: 100 }} className="flex flex-col items-center">
            <Icon icon={icon} className={twMerge("h-16 w-16", success ? " text-green-500" : " text-red-500")} />
            <h1 className="text-3xl font-bold text-center">{title}</h1>
            <p className="text-muted-foreground text-center">{description}</p>
        </m.div>
    );
}

export function ValidateEmail() {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");

    const { isPending, isSuccess, isError } = useQuery(
        {
            queryKey: ["validate"],
            queryFn: async () => {
                const response = await fetch(`/api/waitlist/validate?token=${token}`);

                if (response.ok) {
                    return null;
                } else {
                    throw new Error(await response.text());
                }
            },
            enabled: true,
        },
        queryClient,
    );

    return (
        <>
            <LazyMotion features={domAnimation}>
                {isPending && (
                    <m.div animate={{ y: 0 }} initial={{ y: 100 }} className={twJoin("flex flex-col items-center gap-4")}>
                        <h1 className="text-3xl font-bold text-center">Join Waitlist</h1>
                        <p className="text-muted-foreground">Verifying email...</p>
                        <Icon icon="lucide:loader-2" className="h-16 w-16 animate-spin text-gray-400" />
                    </m.div>
                )}
                {!isPending && (
                    <>
                        {isSuccess && (
                            <Item
                                title="Email verified!"
                                description="Thank you for validating your email. You can now enjoy all the features of our platform."
                                icon="lucide:check-circle"
                                success
                            />
                        )}
                        {isError && (
                            <Item
                                title="Something went wrong!"
                                description="We couldn't validate your email. Please try again later."
                                icon="lucide:alert-octagon"
                                success={false}
                            />
                        )}
                        <a
                            className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                            href="/"
                        >
                            Return to Homepage
                        </a>
                    </>
                )}
            </LazyMotion>
        </>
    );
}
