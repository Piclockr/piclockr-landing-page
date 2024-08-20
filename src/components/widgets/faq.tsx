import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
    {
        question: "Who is Piclockr for?",
        answer: "Piclockr is dedicated to securely archiving photos in the cloud. If you seek a secure cloud storage solution for your images without the need for extra features, you've come to the right place.",
    },
    {
        question: "Does Piclockr offer a free trial?",
        answer: "Yes, we will provide a free trial period so you can explore Piclockr's features before making a commitment.",
    },
    {
        question: "How long will the free trial period be?",
        answer: "The trial period will last for 30 days, giving you enough time to experience Piclockr.",
    },
    {
        question: "Do I need to provide credit card information to access the free trial?",
        answer: "No, we won't ask for credit card details during the trial. It's completely risk-free.",
    },
    {
        question: "Are there any limitations during the free trial?",
        answer: "During the free trial, you'll have full access to Piclockr's features; however, please note that storage capacity will be limited to a total of 5 GB. This ensures a fair trial experience for all users.",
    },
    {
        question: "What happens after the free trial ends?",
        answer: "If you choose not to subscribe to the paid plan after the free trial, please note that all of your data will be deleted from our servers.",
    },
    // {
    //     question: "How can I download the entire archive?",
    //     answer: "We will provide a download tool that allows you to download your entire archive as a ZIP file.",
    // },
];

export function FAQ() {
    return (
        <>
            <Accordion type="single" collapsible className="w-full text-left">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </>
    );
}
