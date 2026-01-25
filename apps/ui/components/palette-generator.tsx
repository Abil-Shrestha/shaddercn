"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultConfig,
  defaultTokens,
  generatePalette,
  type PaletteConfig,
  type ShaddercnTokens,
} from "@/lib/color-generator";
import { Button } from "@/registry/default/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card";
import { Label } from "@/registry/default/ui/label";

type TokenKey = keyof ShaddercnTokens;

const formatRange = (range: [number, number], suffix = "") =>
  `${Math.round(range[0])}–${Math.round(range[1])}${suffix}`;

const toCssVariable = (token: string) =>
  `--${token.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`;

type SliderValue = number | [number, number];

type PaletteSliderProps = {
  value: SliderValue;
  min: number;
  max: number;
  step?: number;
  onChange: (value: SliderValue) => void;
  onCommit: (value: SliderValue) => void;
};

function PaletteSlider({
  value,
  min,
  max,
  step = 1,
  onChange,
  onCommit,
}: PaletteSliderProps) {
  const values = Array.isArray(value) ? value : [value];

  const handleChange = useCallback(
    (nextValue: number | number[]) => {
      const normalized = Array.isArray(nextValue) ? nextValue : [nextValue];
      if (Array.isArray(value)) {
        const [start, end] = normalized as number[];
        if (start === undefined || end === undefined) {
          return;
        }
        onChange([start, end]);
        return;
      }
      const next = normalized[0];
      if (next === undefined) {
        return;
      }
      onChange(next);
    },
    [onChange, value],
  );

  const handleCommit = useCallback(
    (nextValue: number | number[]) => {
      const normalized = Array.isArray(nextValue) ? nextValue : [nextValue];
      if (Array.isArray(value)) {
        const [start, end] = normalized as number[];
        if (start === undefined || end === undefined) {
          return;
        }
        onCommit([start, end]);
        return;
      }
      const next = normalized[0];
      if (next === undefined) {
        return;
      }
      onCommit(next);
    },
    [onCommit, value],
  );

  return (
    <div className="group w-full touch-none select-none transition-[margin] hover:cursor-grab active:cursor-grabbing">
      <SliderPrimitive.Root
        className="relative flex h-2 w-full items-center transition-[height] duration-300"
        max={max}
        min={min}
        onValueChange={handleChange}
        onValueCommitted={handleCommit}
        step={step}
        thumbAlignment="edge"
        value={value}
      >
        <SliderPrimitive.Control className="w-full">
          <SliderPrimitive.Track className="h-7 w-full grow overflow-hidden rounded-md bg-foreground/5 group-has-[:focus-visible]:outline group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-[#FDFF79] group-has-[:focus-visible]:outline-offset-2 dark:bg-white/5">
            <SliderPrimitive.Indicator className="absolute h-7 rounded-md rounded-tr-none rounded-br-none bg-foreground/10 transition-colors duration-200 ease-out group-hover:bg-foreground/15 dark:bg-white/10" />
            {values.map((_, index) => (
              <SliderPrimitive.Thumb
                className="block h-7 w-3 rounded-[3px] bg-[#c8c8c8] outline-none transition-[height] group-hover:bg-[#b6b6b6] dark:bg-[#dcdcdc] dark:group-hover:bg-[#ededed]"
                key={String(index)}
              />
            ))}
          </SliderPrimitive.Track>
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
    </div>
  );
}

type PaletteControlsProps = {
  config: PaletteConfig;
  onCommit: (next: PaletteConfig) => void;
  onReset: () => void;
};

function PaletteControls({ config, onCommit, onReset }: PaletteControlsProps) {
  const [draftConfig, setDraftConfig] = useState<PaletteConfig>(config);

  useEffect(() => {
    setDraftConfig(config);
  }, [config]);

  const commitConfig = useCallback(
    (updater: (prev: PaletteConfig) => PaletteConfig) => {
      setDraftConfig((prev) => {
        const next = updater(prev);
        onCommit(next);
        return next;
      });
    },
    [onCommit],
  );

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-base">Palette Controls</CardTitle>
        <CardDescription>
          Shape the grid before assigning colors to tokens.
        </CardDescription>
        <CardAction>
          <Button
            onClick={() => {
              setDraftConfig(defaultConfig);
              onReset();
            }}
            size="sm"
            variant="outline"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-4 pt-0 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-muted/30 p-3 shadow-xs/5">
          <div className="flex items-center justify-between">
            <Label className="font-medium text-xs">Saturation</Label>
            <span className="text-[10px] text-muted-foreground">0–100</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex h-7 w-12 items-center justify-center rounded-md border border-border/40 bg-foreground/5 text-[13px] text-muted-foreground dark:bg-white/5">
              {Math.round(draftConfig.saturation)}
            </div>
            <PaletteSlider
              max={100}
              min={0}
              onChange={(value) =>
                setDraftConfig((prev) => ({
                  ...prev,
                  saturation: value as number,
                }))
              }
              onCommit={(value) =>
                commitConfig((prev) => ({
                  ...prev,
                  saturation: value as number,
                }))
              }
              value={draftConfig.saturation}
            />
          </div>
        </div>

        <div className="rounded-xl border bg-muted/30 p-3 shadow-xs/5">
          <div className="flex items-center justify-between">
            <Label className="font-medium text-xs">Hue Range</Label>
            <span className="text-[10px] text-muted-foreground">0°–360°</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex h-7 min-w-[96px] shrink-0 items-center justify-center rounded-md border border-border/40 bg-foreground/5 px-2 text-[13px] text-muted-foreground dark:bg-white/5">
              {formatRange(draftConfig.hueRange, "°")}
            </div>
            <PaletteSlider
              max={360}
              min={0}
              onChange={(value) =>
                setDraftConfig((prev) => ({
                  ...prev,
                  hueRange: value as [number, number],
                }))
              }
              onCommit={(value) =>
                commitConfig((prev) => ({
                  ...prev,
                  hueRange: value as [number, number],
                }))
              }
              value={draftConfig.hueRange}
            />
          </div>
        </div>

        <div className="rounded-xl border bg-muted/30 p-3 shadow-xs/5">
          <div className="flex items-center justify-between">
            <Label className="font-medium text-xs">Luminance</Label>
            <span className="text-[10px] text-muted-foreground">0–100%</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex h-7 min-w-[96px] shrink-0 items-center justify-center rounded-md border border-border/40 bg-foreground/5 px-2 text-[13px] text-muted-foreground dark:bg-white/5">
              {formatRange(draftConfig.luminanceRange, "%")}
            </div>
            <PaletteSlider
              max={100}
              min={0}
              onChange={(value) =>
                setDraftConfig((prev) => ({
                  ...prev,
                  luminanceRange: value as [number, number],
                }))
              }
              onCommit={(value) =>
                commitConfig((prev) => ({
                  ...prev,
                  luminanceRange: value as [number, number],
                }))
              }
              value={draftConfig.luminanceRange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PaletteGenerator() {
  const [config, setConfig] = useState<PaletteConfig>(defaultConfig);
  const [tokens, setTokens] = useState<ShaddercnTokens>(defaultTokens);
  const [selectedToken, setSelectedToken] = useState<TokenKey | null>(
    "primary",
  );
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const palette = useMemo(() => generatePalette(config), [config]);

  const handleColorClick = useCallback(
    (hex: string) => {
      if (selectedToken) {
        setTokens((prev) => ({ ...prev, [selectedToken]: hex }));
      }
      navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1000);
    },
    [selectedToken],
  );

  const handleReset = useCallback(() => {
    setConfig(defaultConfig);
    setTokens(defaultTokens);
    setSelectedToken("primary");
    setCopiedHex(null);
  }, []);

  const activeTokenKey = selectedToken ?? "primary";

  const swatchGrid = useMemo(
    () => (
      <div className="rounded-xl border bg-muted/30 p-2">
        <div className="flex gap-1">
          {palette.map((column) => (
            <div
              className="flex flex-1 flex-col gap-1"
              key={column[0]?.columnId}
            >
              {column.map((cell) => (
                <button
                  aria-label={`Assign ${cell.hex} to ${toCssVariable(
                    activeTokenKey,
                  )}`}
                  className="group relative h-9 w-full rounded-md shadow-inner transition-transform hover:z-10 hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring"
                  key={cell.cellId}
                  onClick={() => handleColorClick(cell.hex)}
                  style={{ backgroundColor: cell.hex }}
                  title={`${cell.hex}\nH: ${cell.hue.toFixed(0)}° S: ${cell.saturation.toFixed(0)}% L: ${cell.luminance.toFixed(0)}%`}
                  type="button"
                >
                  {copiedHex === cell.hex && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-md bg-black/60 font-medium text-white text-xs backdrop-blur-sm">
                      Copied!
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    [activeTokenKey, copiedHex, handleColorClick, palette],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <PaletteControls
        config={config}
        onCommit={setConfig}
        onReset={handleReset}
      />

      {/* Color Grid */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">Palette Grid</CardTitle>
          <CardDescription>Click a swatch to copy its hex.</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2 rounded-full border bg-background px-2.5 py-1 text-[11px]">
              <span
                className="h-3 w-3 rounded-full border"
                style={{ backgroundColor: tokens[activeTokenKey] }}
              />
              <span className="font-mono text-[10px] text-muted-foreground">
                {toCssVariable(activeTokenKey)}
              </span>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="pt-0">
          {swatchGrid}
          <p className="mt-3 text-muted-foreground text-xs">
            Tip: click any swatch to copy its hex value.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
