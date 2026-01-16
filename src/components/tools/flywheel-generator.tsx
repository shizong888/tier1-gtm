'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Download, GripVertical, Upload } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FlywheelCard {
  id: string;
  text: string;
}

interface SortableCardProps {
  card: FlywheelCard;
  index: number;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

function SortableCard({ card, index, onEdit, onDelete }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 group">
      <button
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4 text-neutral-500" />
      </button>
      <div className="flex-1 flex items-center gap-2">
        <span className="text-sm font-bold text-neutral-500 dark:text-neutral-500 w-6">{index + 1}.</span>
        <input
          type="text"
          value={card.text}
          onChange={(e) => onEdit(card.id, e.target.value)}
          className="flex-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 rounded-lg p-3 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9ff00] focus:border-transparent"
          placeholder="Enter card text..."
        />
      </div>
      <button
        onClick={() => onDelete(card.id)}
        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>
    </div>
  );
}

export function FlywheelGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cards, setCards] = useState<FlywheelCard[]>([
    { id: '1', text: 'Liquidity Providers Establish Deep, Stable Markets' },
    { id: '2', text: 'Active Traders And Retail Benefit From Tighter Spreads And Predictable Execution' },
    { id: '3', text: 'Increased Volume Improves Liquidity Depth And Execution Quality' },
    { id: '4', text: 'Points And Incentives Reward Productive Participation' },
    { id: '5', text: 'Ecosystem Partners Integrate To Capture Growing Flow' },
  ]);
  const [cardsPerRow, setCardsPerRow] = useState<number>(5);
  const [horizontalGapSize, setHorizontalGapSize] = useState<40 | 60 | 80>(60);
  const [verticalGapSize, setVerticalGapSize] = useState<40 | 60 | 80>(60);
  const [showReturnArrow, setShowReturnArrow] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const saveMedia = useMutation(api.media.saveMedia);

  const horizontalGap = horizontalGapSize;
  const verticalGap = verticalGapSize;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addCard = () => {
    const newCard: FlywheelCard = {
      id: Date.now().toString(),
      text: '',
    };
    setCards([...cards, newCard]);
  };

  const editCard = (id: string, text: string) => {
    setCards(cards.map((card) => (card.id === id ? { ...card, text } : card)));
  };

  const deleteCard = (id: string) => {
    if (cards.length > 1) {
      setCards(cards.filter((card) => card.id !== id));
    }
  };

  const drawFlywheel = () => {
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
      const words = card.text.split(' ');
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
  };

  useEffect(() => {
    drawFlywheel();
  }, [cards, cardsPerRow, horizontalGapSize, verticalGapSize, showReturnArrow]);

  const exportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'flywheel.png';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };

  const uploadToConvex = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsUploading(true);
    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
        }, 'image/png');
      });

      // Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload the file
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'image/png' },
        body: blob,
      });

      const { storageId } = await result.json();

      // Save metadata
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `flywheel-${timestamp}.png`;

      await saveMedia({
        filename,
        storageId,
        contentType: 'image/png',
        size: blob.size,
      });

      alert('Flywheel diagram uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload:', error);
      alert('Failed to upload diagram');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 bg-white dark:bg-[#0a0a0a] text-black dark:text-white">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-900 bg-white/50 dark:bg-black/50 backdrop-blur sticky top-14 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Flywheel Generator</h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Create branded flywheel diagrams with custom cards
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={uploadToConvex}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white font-semibold rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Upload to Library'}
              </button>
              <button
                onClick={exportPNG}
                className="flex items-center gap-2 px-4 py-2 bg-[#d9ff00] text-black font-semibold rounded-lg hover:bg-[#c5e600] transition-colors"
              >
                <Download className="w-4 h-4" />
                Export PNG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Cards</h2>
              <button
                onClick={addCard}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Card
              </button>
            </div>

            {/* Cards per row control */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-2">
                Cards per row
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={cardsPerRow}
                onChange={(e) => setCardsPerRow(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 rounded-lg p-3 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9ff00] focus:border-transparent"
              />
            </div>

            {/* Horizontal gap control */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-2">
                Horizontal gap
              </label>
              <select
                value={horizontalGapSize}
                onChange={(e) => setHorizontalGapSize(parseInt(e.target.value) as 40 | 60 | 80)}
                className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 rounded-lg p-3 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9ff00] focus:border-transparent"
              >
                <option value="40">40px</option>
                <option value="60">60px</option>
                <option value="80">80px</option>
              </select>
            </div>

            {/* Vertical gap control */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-2">
                Vertical gap
              </label>
              <select
                value={verticalGapSize}
                onChange={(e) => setVerticalGapSize(parseInt(e.target.value) as 40 | 60 | 80)}
                className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 rounded-lg p-3 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d9ff00] focus:border-transparent"
              >
                <option value="40">40px</option>
                <option value="60">60px</option>
                <option value="80">80px</option>
              </select>
            </div>

            {/* Return arrow toggle */}
            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showReturnArrow}
                  onChange={(e) => setShowReturnArrow(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-[#d9ff00] focus:ring-2 focus:ring-[#d9ff00] focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
                  Show return arrow
                </span>
              </label>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={cards.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {cards.map((card, index) => (
                    <SortableCard
                      key={card.id}
                      card={card}
                      index={index}
                      onEdit={editCard}
                      onDelete={deleteCard}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-4">
              Drag cards to reorder • Click trash to delete • Export creates PNG with transparent background
            </p>
          </div>

          {/* Preview */}
          <div>
            <h2 className="text-lg font-bold mb-4">Preview</h2>
            <div className="border border-neutral-200 dark:border-neutral-900 rounded-lg p-8 bg-neutral-50 dark:bg-neutral-950 overflow-auto">
              <canvas
                ref={canvasRef}
                className="mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
