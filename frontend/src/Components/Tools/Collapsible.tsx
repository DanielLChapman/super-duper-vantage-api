import React, { useState } from "react";

export interface FaqItem {
    title: string;
    description: string;
}

interface CollapsibleProps {
    item: FaqItem;
}

const Collapsible: React.FC<CollapsibleProps> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className="border-b border-gray-300">
            <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={toggle}
            >
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <span
                    className={`transform transition-transform duration-300 ${
                        isOpen ? "-rotate-180" : "rotate-0"
                    }`}
                >
                    &#x25B2;
                </span>
            </div>
            {isOpen && <div className="p-4">{item.description}</div>}
        </div>
    );
};

export default Collapsible;
