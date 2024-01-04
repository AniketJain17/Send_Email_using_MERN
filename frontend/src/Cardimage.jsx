import React from "react";
import { useEffect, useState } from "react";
import "./assets/css/style.css";

const Cardimage = () => {

  const openNewPage = (url) => {
    window.open(url, "_blank");
  };

  const [cards, setCards] = useState([]);

  const angle = 20;

  const lerp = (start, end, amount) => {
    return (1 - amount) * start + amount * end;
  };

  const remap = (value, oldMax, newMax) => {
    const newValue = ((value + oldMax) * (newMax * 2)) / (oldMax * 2) - newMax;
    return Math.min(Math.max(newValue, -newMax), newMax);
  };

  useEffect(() => {
    const handleMouseMove = (event, card) => {
      const rect = card.getBoundingClientRect();
      const centerX = (rect.left + rect.right) / 2;
      const centerY = (rect.top + rect.bottom) / 2;
      const posX = event.pageX - centerX;
      const posY = event.pageY - centerY;
      const x = remap(posX, rect.width / 2, angle);
      const y = remap(posY, rect.height / 2, angle);
      card.style.setProperty("--rotateX", `${-y}deg`);
      card.style.setProperty("--rotateY", `${x}deg`);
    };

    const handleMouseOut = (card) => {
      card.style.setProperty("--rotateX", "0deg");
      card.style.setProperty("--rotateY", "0deg");
    };

    const cardElements = document.querySelectorAll(".card");
    setCards(cardElements);

    cardElements.forEach((card) => {
      card.addEventListener("mousemove", (event) =>
        handleMouseMove(event, card)
      );
      card.addEventListener("mouseout", () => handleMouseOut(card));
    });

    return () => {
      cardElements.forEach((card) => {
        card.removeEventListener("mousemove", (event) =>
          handleMouseMove(event, card)
        );
        card.removeEventListener("mouseout", () => handleMouseOut(card));
      });
    };
  }, []);

  useEffect(() => {
    const update = () => {
      cards.forEach((card) => {
        let currentX = parseFloat(
          getComputedStyle(card).getPropertyValue("--rotateX").slice(0, -3)
        );
        let currentY = parseFloat(
          getComputedStyle(card).getPropertyValue("--rotateY").slice(0, -3)
        );
        if (isNaN(currentX)) currentX = 0;
        if (isNaN(currentY)) currentY = 0;
        const x = lerp(currentX, parseFloat(card.dataset.rotateX), 0.05);
        const y = lerp(currentY, parseFloat(card.dataset.rotateY), 0.05);
        card.style.setProperty("--rotateX", `${x}deg`);
        card.style.setProperty("--rotateY", `${y}deg`);
      });
    };

    const intervalId = setInterval(update, 1000 / 60);

    return () => {
      clearInterval(intervalId);
    };
  }, [cards]);

  return (
    <div>
      <h1>ONLINE IMAGE SCRAMBLER</h1>
      <div className="centered">
        {/* Card 1 */}
        <div className="card border" onClick={() => openNewPage("MyForm.jsx ")}>
          <div
            className="shadow"
            style={{ "--url": `url('https://i.ibb.co/PM4ghD4/full.png')` }}
          ></div>
          <div
            className="image background"
            style={{
              "--url": `url('https://i.ibb.co/JpJVJxq/Background.png')`,
            }}
          ></div>
          <div
            className="image cutout"
            style={{ backgroundImage: `url(assets/images/image1.jpg)` }}
          ></div>
        </div>
        {/* Card 2 */}
        <div className="card" onClick={() => openNewPage("page2.html")}>
          <div
            className="shadow"
            style={{ "--url": `url('https://i.ibb.co/DC0MbxS/m-full.png')` }}
          ></div>
          <div
            className="image background"
            style={{
              "--url": `url('https://i.ibb.co/ZdGBm4K/m-background.png')`,
            }}
          ></div>
          <div
            className="image cutout"
            style={{ backgroundImage: `url(assets/images/image2.jpg)` }}
          ></div>
        </div>
        {/* Card 3 */}
        <div className="card" onClick={() => openNewPage("page3.html")}>
          <div
            className="shadow"
            style={{ "--url": `url('https://i.ibb.co/gSBp82C/b-full.png')` }}
          ></div>
          <div
            className="image background"
            style={{
              "--url": `url('https://i.ibb.co/MDBcyMW/b-background.png')`,
            }}
          ></div>
          <div
            className="image cutout"
            style={{ "--url": `url('https://i.ibb.co/bQNgD6y/b-cutout.png')` }}
          ></div>
          <div className="content">
            <h2>Hover me!</h2>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cardimage;
