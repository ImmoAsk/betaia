import React, { useRef } from "react";
import { Button } from "react-bootstrap";

const HorizontalScroll = ({
  items,
  renderItem,
  onItemSelect,
  selectedItemId,
  itemType,
}) => {
  const scrollRef = useRef();

  const scrollItems = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 150, behavior: "smooth" });
    }
  };

  const handleKeyScroll = (e) => {
    if (e.key === "ArrowRight") scrollItems(1);
    if (e.key === "ArrowLeft") scrollItems(-1);
  };

  return (
    <div className="horizontal-scroll-wrapper d-flex align-items-center position-relative">
      <Button
        variant="light"
        className="scroll-btn left"
        onClick={() => scrollItems(-1)}
      >
        ‹
      </Button>

      <div
        className="horizontal-scroll-container d-flex flex-nowrap"
        ref={scrollRef}
        tabIndex={0}
        onKeyDown={handleKeyScroll}
      >
        {items.map((item) => (
          <div
            key={item[itemType + "_id"]}
            className={`scroll-item ${
              selectedItemId === item[itemType + "_id"]
                ? "border border-primary"
                : ""
            }`}
            onClick={() => onItemSelect(item)}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>

      <Button
        variant="light"
        className="scroll-btn right"
        onClick={() => scrollItems(1)}
      >
        ›
      </Button>
    </div>
  );
};

export default HorizontalScroll;
