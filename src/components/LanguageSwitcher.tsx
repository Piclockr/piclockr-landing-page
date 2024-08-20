import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations, type Lang, useTranslatedPath } from "@/i18n/utils";
import { Icon } from "@iconify/react";

export function LanguageSwitcher(params: { lang: Lang | string; page: string }) {
    const t = useTranslations(params.lang as Lang);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Icon icon="lucide:globe" className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>{t("lang.switch")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <a href={useTranslatedPath("de")(params.page)}>{t("lang.de")}</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <a href={useTranslatedPath("en")(params.page)}>{t("lang.en")}</a>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>{t("lang.en")}</DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
