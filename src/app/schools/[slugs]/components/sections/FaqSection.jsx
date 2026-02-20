import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function FaqSection({ faqs }) {
    const [openIndex, setOpenIndex] = useState(null)

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    if (!faqs || faqs.length === 0) {
        return null
    }

    return (
        <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">FAQs</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`border rounded-lg p-4 transition-all duration-200 ${openIndex === index ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        <button
                            onClick={() => toggleFaq(index)}
                            className="w-full text-left font-medium text-gray-900 flex justify-between items-center gap-4"
                        >
                            <span className="text-sm md:text-base">{faq.question}</span>
                            {openIndex === index ? (
                                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            )}
                        </button>

                        {openIndex === index && (
                            <div className="mt-3 pt-3 border-t border-gray-200/50">
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
