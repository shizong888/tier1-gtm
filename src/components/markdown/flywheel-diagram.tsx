'use client';

import { useEffect, useRef } from 'react';

interface FlywheelDiagramProps {
  cards: string[];
  cardsPerRow?: number;
  horizontalGap?: 40 | 60 | 80;
  verticalGap?: 40 | 60 | 80;
  showReturnArrow?: boolean;
}

export function FlywheelDiagram({
  cards,
  cardsPerRow = 5,
  horizontalGap = 60,
  verticalGap = 60,
  showReturnArrow = true,
}: FlywheelDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Card dimensions
    const cardWidth = 240;
    const cardHeight = 80;
    const arrowWidth = horizontalGap;
    const spacing = 20;
    const rowSpacing = verticalGap;

    // Calculate grid layout
    const rows = Math.ceil(cards.length / cardsPerRow);
    const maxCardsInRow = Math.min(cardsPerRow, cards.length);

    // Calculate the width needed for the widest row (including arrows between cards)
    const maxRowWidth = maxCardsInRow * cardWidth + (maxCardsInRow - 1) * (arrowWidth + spacing);

    // Add space for side arrows (60px on each side)
    const sideArrowMargin = 60;
    const horizontalPadding = 120; // Extra padding for aesthetics
    const width = maxRowWidth + (2 * sideArrowMargin) + horizontalPadding;

    // Calculate height with space for top, bottom, and return arrow
    const topPadding = 60;
    // Adjust bottom padding based on whether return arrow is shown
    let bottomPadding = 60; // Default padding when no return arrow
    if (showReturnArrow) {
      bottomPadding = rows === 1 ? 140 : 80; // More space for single-row return arrow
    }
    const height = topPadding + (rows * cardHeight) + ((rows - 1) * rowSpacing) + bottomPadding;

    // Set canvas size for high DPI
    const scale = 2;
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(scale, scale);

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, width, height);

    // Calculate card positions - center the entire grid both horizontally and vertically
    const cardPositions: { x: number; y: number }[] = [];

    // Calculate total height of the card grid
    const gridHeight = (rows * cardHeight) + ((rows - 1) * rowSpacing);

    // Center vertically - calculate starting Y position
    const startY = (height - gridHeight) / 2;

    cards.forEach((card, index) => {
      const row = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;
      const cardsInThisRow = Math.min(cardsPerRow, cards.length - row * cardsPerRow);

      // Calculate width of this specific row
      const thisRowWidth = cardsInThisRow * cardWidth + (cardsInThisRow - 1) * (arrowWidth + spacing);

      // Center this row horizontally within the canvas
      const startX = (width - thisRowWidth) / 2 + cardWidth / 2;

      const x = startX + col * (cardWidth + arrowWidth + spacing);
      const y = startY + row * (cardHeight + rowSpacing);

      cardPositions.push({ x, y });
    });

    // Draw cards and arrows
    cards.forEach((card, index) => {
      const { x, y } = cardPositions[index];

      // Draw card (black box with white border and brand color text)
      ctx.fillStyle = '#000000';
      ctx.fillRect(x - cardWidth / 2, y - cardHeight / 2, cardWidth, cardHeight);

      // Draw white border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - cardWidth / 2, y - cardHeight / 2, cardWidth, cardHeight);

      // Draw card text
      ctx.fillStyle = '#d9ff00';
      ctx.font = '700 11px Meltmino, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Word wrap
      const words = card.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      const maxWidth = cardWidth - 20;

      words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine);

      const lineHeight = 14;
      const textStartY = y - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, lineIndex) => {
        ctx.fillText(line, x, textStartY + lineIndex * lineHeight);
      });

      // Draw arrows
      const currentRow = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;
      const isEvenRow = currentRow % 2 === 0;

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;

      // Draw horizontal arrows within the same row
      if (isEvenRow) {
        // Even rows: left to right
        // Draw arrow to the right if not last card in row
        const isLastInRow = (index + 1) % cardsPerRow === 0 || index === cards.length - 1;
        if (!isLastInRow) {
          const arrowX = x + cardWidth / 2 + spacing / 2;
          const arrowY = y;

          ctx.beginPath();
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(arrowX + arrowWidth, arrowY);
          ctx.stroke();

          // Arrow head pointing right
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(arrowX + arrowWidth, arrowY);
          ctx.lineTo(arrowX + arrowWidth - 8, arrowY - 4);
          ctx.lineTo(arrowX + arrowWidth - 8, arrowY + 4);
          ctx.closePath();
          ctx.fill();
        }
      } else {
        // Odd rows: right to left
        // Draw arrow to the left if not first card in row
        if (col > 0) {
          const arrowX = x - cardWidth / 2 - spacing / 2;
          const arrowY = y;

          ctx.beginPath();
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(arrowX - arrowWidth, arrowY);
          ctx.stroke();

          // Arrow head pointing left
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(arrowX - arrowWidth, arrowY);
          ctx.lineTo(arrowX - arrowWidth + 8, arrowY - 4);
          ctx.lineTo(arrowX - arrowWidth + 8, arrowY + 4);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Draw row transition arrows
      if (index < cards.length - 1) {
        const nextRow = Math.floor((index + 1) / cardsPerRow);
        if (currentRow !== nextRow) {
          // Row transition arrow
          const isEvenRow = currentRow % 2 === 0;
          const nextRowStart = (currentRow + 1) * cardsPerRow;

          if (isEvenRow) {
            // Even row -> Odd row: Go from last card in even row to last card in odd row (right side)
            const nextRowEnd = Math.min(nextRowStart + cardsPerRow - 1, cards.length - 1);
            const lastCardInNextRow = cardPositions[nextRowEnd];

            // Calculate right margin (mirror of left margin logic)
            const rightMargin = Math.max(x + cardWidth / 2, lastCardInNextRow.x + cardWidth / 2) + 60;

            ctx.beginPath();
            // Line straight right from last card in current row
            ctx.moveTo(x + cardWidth / 2, y);
            ctx.lineTo(rightMargin, y);

            // Line down to next row's Y position
            ctx.lineTo(rightMargin, lastCardInNextRow.y);

            // Line left to center of right side of last card in next row
            ctx.lineTo(lastCardInNextRow.x + cardWidth / 2, lastCardInNextRow.y);
            ctx.stroke();

            // Arrow head pointing left into card
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(lastCardInNextRow.x + cardWidth / 2, lastCardInNextRow.y);
            ctx.lineTo(lastCardInNextRow.x + cardWidth / 2 + 8, lastCardInNextRow.y - 4);
            ctx.lineTo(lastCardInNextRow.x + cardWidth / 2 + 8, lastCardInNextRow.y + 4);
            ctx.closePath();
            ctx.fill();
          } else {
            // Odd row -> Even row: Go from first card in odd row to first card in even row (left side)
            const firstCardInNextRow = cardPositions[nextRowStart];

            // Calculate left margin
            const leftMargin = Math.min(x - cardWidth / 2, firstCardInNextRow.x - cardWidth / 2) - 60;

            ctx.beginPath();
            // Line straight left from first card in current row
            ctx.moveTo(x - cardWidth / 2, y);
            ctx.lineTo(leftMargin, y);

            // Line down to next row's Y position
            ctx.lineTo(leftMargin, firstCardInNextRow.y);

            // Line right to center of left side of first card in next row
            ctx.lineTo(firstCardInNextRow.x - cardWidth / 2, firstCardInNextRow.y);
            ctx.stroke();

            // Arrow head pointing right into card
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(firstCardInNextRow.x - cardWidth / 2, firstCardInNextRow.y);
            ctx.lineTo(firstCardInNextRow.x - cardWidth / 2 - 8, firstCardInNextRow.y - 4);
            ctx.lineTo(firstCardInNextRow.x - cardWidth / 2 - 8, firstCardInNextRow.y + 4);
            ctx.closePath();
            ctx.fill();
          }
        }
      }
    });

    // Draw return arrow from last row to first card
    if (cards.length > 1 && showReturnArrow) {
      const firstPos = cardPositions[0];
      const lastRow = Math.floor((cards.length - 1) / cardsPerRow);
      const isLastRowOdd = lastRow % 2 === 1;

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;

      if (isLastRowOdd) {
        // Last row is odd (going right to left), so return arrow starts from first card of last row
        const firstCardInLastRow = lastRow * cardsPerRow;
        const lastRowFirstPos = cardPositions[firstCardInLastRow];

        // Calculate the leftmost point to avoid overlap
        const leftMargin = Math.min(firstPos.x - cardWidth / 2, lastRowFirstPos.x - cardWidth / 2) - 60;

        ctx.beginPath();

        // Start from center of left side of first card in last row
        ctx.moveTo(lastRowFirstPos.x - cardWidth / 2, lastRowFirstPos.y);
        ctx.lineTo(leftMargin, lastRowFirstPos.y);

        // Line up to first card's Y position
        ctx.lineTo(leftMargin, firstPos.y);

        // Line right to center of left side of first card
        ctx.lineTo(firstPos.x - cardWidth / 2, firstPos.y);
        ctx.stroke();

        // Arrow head pointing right into first card (at vertical center)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(firstPos.x - cardWidth / 2, firstPos.y);
        ctx.lineTo(firstPos.x - cardWidth / 2 - 8, firstPos.y - 4);
        ctx.lineTo(firstPos.x - cardWidth / 2 - 8, firstPos.y + 4);
        ctx.closePath();
        ctx.fill();
      } else {
        // Last row is even (going left to right), so return arrow starts from last card of last row
        const lastCardPos = cardPositions[cards.length - 1];

        // Calculate the rightmost point (mirror of left margin)
        const rightMargin = Math.max(firstPos.x + cardWidth / 2, lastCardPos.x + cardWidth / 2) + 60;

        // Calculate bottom position (below the cards)
        const bottomMargin = lastCardPos.y + cardHeight / 2 + 60;

        ctx.beginPath();

        // Start from center of right side of last card
        ctx.moveTo(lastCardPos.x + cardWidth / 2, lastCardPos.y);
        // Line straight right
        ctx.lineTo(rightMargin, lastCardPos.y);

        // Line down
        ctx.lineTo(rightMargin, bottomMargin);

        // Line left to align with left side of first card
        const leftMargin = firstPos.x - cardWidth / 2 - 60;
        ctx.lineTo(leftMargin, bottomMargin);

        // Line up to first card's Y position
        ctx.lineTo(leftMargin, firstPos.y);

        // Line right to center of left side of first card
        ctx.lineTo(firstPos.x - cardWidth / 2, firstPos.y);
        ctx.stroke();

        // Arrow head pointing right into first card
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(firstPos.x - cardWidth / 2, firstPos.y);
        ctx.lineTo(firstPos.x - cardWidth / 2 - 8, firstPos.y - 4);
        ctx.lineTo(firstPos.x - cardWidth / 2 - 8, firstPos.y + 4);
        ctx.closePath();
        ctx.fill();
      }
    }
  }, [cards, cardsPerRow, horizontalGap, verticalGap, showReturnArrow]);

  return (
    <div className="my-8 flex justify-center">
      <canvas ref={canvasRef} className="max-w-full h-auto" />
    </div>
  );
}
