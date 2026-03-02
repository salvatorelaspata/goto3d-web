import { Accordion } from "@/components/Accordion";

export default async function FAQ() {
  return (
    <section className="w-full py-12">
      <div className="container px-4 md:px-6 max-w-3xl mx-auto space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-palette1">
            Frequently Asked Questions
          </h1>
          <p className="text-palette2  md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Get answers to the most common questions about our product.
          </p>
        </div>
        <div className="space-y-4" data-orientation="vertical">
          <Accordion
            title="What is the refund policy?"
            content="We offer a 30-day money-back guarantee if you are not satisfied with our product."
          />
        </div>
      </div>
    </section>
  );
}
