import React, { useEffect } from 'react';

const CounterSection = () => {
  useEffect(() => {
    const counters = document.querySelectorAll("[data-counter]");
    counters.forEach(counter => {
      const animateCounter = (start, end, duration, element, format) => {
        let startTime = null;
        const step = timestamp => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          element.innerHTML = Math.floor(progress * (end - start) + start) + format;
          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };
        requestAnimationFrame(step);
      };

      const start = parseInt(counter.dataset.start, 10);
      const end = parseInt(counter.dataset.end, 10);
      const duration = parseInt(counter.dataset.duration, 10);
      const format = counter.dataset.endFormat || "";
      animateCounter(start, end, duration, counter, format);
    });
  }, []);

  return (
    <section className="counter-section py-20"style={{ backgroundColor: '#000000' }}>
      <div className="container mx-auto flex justify-center space-x-10">
        {[
          { end: 50, label: "Customers", format: "+" },
          { end: 50000, label: "Searches Done", format: "K" },
          { end: 799, label: "Clients", format: "" },
          { end: 10000, label: "Projects Done", format: "K" }
        ].map((counter, idx) => (
          <div key={idx} className="text-center">
            <h2
              data-counter
              data-start="0"
              data-end={counter.end}
              data-duration="1500"
              data-end-format={counter.format}
              className="text-4xl font-bold text-orange-500"
            >
              {counter.end}{counter.format}
            </h2>
            <span className="text-white">{counter.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CounterSection;
