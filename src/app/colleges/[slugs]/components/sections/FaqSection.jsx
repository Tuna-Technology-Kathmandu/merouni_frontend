import { useState } from "react"

export default function FaqSection({ faqs }) {
    const [openIndex, setOpenIndex] = useState(null)

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className="py-16">
            <h2 className="text-2xl font-bold mb-6">FAQs</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                        <button
                            onClick={() => toggleFaq(index)}
                            className="w-full text-left font-semibold mb-2 flex justify-between items-center"
                        >
                            {faq.question}
                            <span className="ml-2">
                                {openIndex === index ? "−" : "+"}
                            </span>
                        </button>

                        {openIndex === index && (
                            <p className="text-gray-600 transition-all duration-300">
                                {faq.answer}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}
