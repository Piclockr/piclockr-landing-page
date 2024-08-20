import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useRef } from "react";

export function PricingCalculator() {
    const min = 0;
    const max = 1000;
    const slider = useRef();

    const [value, setValue] = useState<number | string>("0 GB");
    const [price, setPrice] = useState<number | string>("EUR 0.99");
    const [sliderValue, setSliderValue] = useState([0]);

    const formatGb = (gb: number | bigint) => {
        return new Intl.NumberFormat("en-US", {
            style: "unit",
            unit: "gigabyte",
        }).format(gb);
    };

    const calculatePrice = (gb: number) => {
        const price = (Math.max(15, gb) - 15) * 0.04 + 0.99;
        const formattedPrice = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "EUR",
            currencyDisplay: "code",
        }).format(price);

        setPrice(formattedPrice);
    };

    const onSliderValueChanged = (value: number[]) => {
        setSliderValue(value);
        const gb = Math.ceil(max * (value[0] / 100));
        setValue(formatGb(gb));
        calculatePrice(gb);
    };

    const onInputValueChanged = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const gb = evt.target.value;

        if (!isNaN(parseFloat(gb))) {
            const gbFloat = parseFloat(gb);
            const gbInt = parseInt(gb);
            setValue(formatGb(gbFloat));
            calculatePrice(gbInt);
            setSliderValue([gbFloat / 10]);
        } else {
            setValue("");
        }
    };

    return (
        <>
            <div className="pt-4 flex flex-col">
                <div className="flex justify-between w-full items-center pb-4 gap-4">
                    <Label htmlFor="storage-amount">Storage</Label>
                    <Input id="storage-amount" value={value} onChange={onInputValueChanged} min={min} max={max} className="w-20 text-right" />
                </div>

                <Slider id="slider" ref={slider} onValueChange={onSliderValueChanged} value={sliderValue} defaultValue={[min]} max={100} step={0.1} />
                <div className="flex justify-end w-full items-center pt-4">
                    <p className="font-semibold">Total: {price}</p>
                </div>
            </div>
        </>
    );
}
