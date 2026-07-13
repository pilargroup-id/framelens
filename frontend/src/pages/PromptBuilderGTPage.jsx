import { useState, useEffect, useMemo } from "react"
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
  Tooltip,
  Collapse,
} from "@mui/material"
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import CheckRoundedIcon from "@mui/icons-material/CheckRounded"
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded"
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded"
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded"
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded"
import WallpaperRoundedIcon from "@mui/icons-material/WallpaperRounded"
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded"
import BlockRoundedIcon from "@mui/icons-material/BlockRounded"
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded"
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded"
import EditRoundedIcon from "@mui/icons-material/EditRounded"

/* ─── Fonts & Animations ─── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
    @keyframes orbDrift0 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(22px,-18px) scale(1.04)} }
    @keyframes orbDrift1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,22px) scale(1.03)} }
    @keyframes orbDrift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(16px,18px) scale(1.05)} }
    @keyframes gridPulse { 0%,100%{opacity:0.45} 50%{opacity:0.7} }
  `}</style>
)

function CardBg({ variant = "left" }) {
  const isLeft = variant === "left"
  return (
    <Box aria-hidden sx={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", borderRadius: "inherit" }}>
      <Box sx={{
        position: "absolute", inset: 0,
        background: isLeft
          ? "linear-gradient(145deg, #e8edf8 0%, #f0f4fb 30%, #e6edf9 60%, #eaf0fb 100%)"
          : "linear-gradient(145deg, #eaf0fb 0%, #e6edf9 30%, #f0f4fb 60%, #e8edf8 100%)",
      }} />
      <Box sx={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(35,57,113,0.18) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        animation: "gridPulse 6s ease-in-out infinite",
      }} />
      <Box sx={{ position: "absolute", top: isLeft ? "-20%" : "60%", left: isLeft ? "-10%" : "55%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(35,57,113,0.13) 0%, transparent 70%)", animation: "orbDrift0 14s ease-in-out infinite" }} />
      <Box sx={{ position: "absolute", top: isLeft ? "50%" : "-15%", right: isLeft ? "-8%" : "-10%", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(55,80,145,0.10) 0%, transparent 70%)", animation: "orbDrift1 18s ease-in-out infinite 2s" }} />
      <Box sx={{ position: "absolute", bottom: isLeft ? "-10%" : "10%", left: isLeft ? "40%" : "10%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(35,57,113,0.09) 0%, transparent 70%)", animation: "orbDrift2 22s ease-in-out infinite 4s" }} />
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(35,57,113,0.35), transparent)" }} />
      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(35,57,113,0.22), transparent)" }} />
    </Box>
  )
}

const F = { fontFamily: "'Sora',sans-serif" }
const NEUTRAL_ACCENT = "#fff"
const NEUTRAL_SOFT = "linear-gradient(135deg,#525252,#3f3f46)"
const NEUTRAL_BORDER = "rgba(63,63,70,0.34)"

const cardShell = {
  borderRadius: "32px",
  border: "1px solid rgba(148,163,184,0.25)",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05), 0 16px 40px -8px rgba(35,57,113,0.13)",
  overflow: "hidden",
  position: "relative",
  transition: "box-shadow 0.3s ease, border-color 0.3s ease",
  "&:hover": {
    boxShadow: "0 2px 8px rgba(0,0,0,0.07), 0 24px 52px -8px rgba(35,57,113,0.18)",
    borderColor: "rgba(148,163,184,0.4)",
  },
}

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    background: "rgba(226,232,240,0.65)",
    backdropFilter: "blur(8px)",
    ...F,
    fontSize: "0.78rem",
    "& fieldset": { borderColor: "rgba(100,116,139,0.45)", top: 0 },
    "& legend": { height: 0, fontSize: "0.62rem" },
    "&:hover fieldset": { borderColor: "rgba(100,116,139,0.7)" },
    "&.Mui-focused fieldset": { borderColor: "#233971", borderWidth: "1.5px" },
  },
  "& .MuiSelect-icon": { color: "#94a3b8" },
  "& .MuiOutlinedInput-root:hover .MuiSelect-icon": { color: "#64748b" },
  "& .MuiOutlinedInput-root.Mui-focused .MuiSelect-icon": { color: "#233971" },
  "& .MuiInputBase-input": { py: "8px", fontSize: "0.78rem" },
  "& textarea.MuiInputBase-input": { fontSize: "0.78rem", lineHeight: 1.45 },
  "& .MuiInputLabel-root": {
    ...F,
    fontSize: "0.76rem",
    lineHeight: 1.15,
    px: 0.45,
    borderRadius: "6px",
    background: "rgba(248,250,252,0.96)",
    transform: "translate(12px, 8px) scale(1)",
    "&.MuiInputLabel-shrink": {
      transform: "translate(10px, -8px) scale(0.82)",
    },
    "&.Mui-focused": { color: "#233971" },
  },
  "& .MuiFormHelperText-root": { ...F, mx: 0.5, mt: 0.45, fontSize: "0.68rem", lineHeight: 1.35 },
}

const sectionLabel = { ...F, fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "#0f172a" }
const sectionSub   = { ...F, fontSize: "0.78rem", color: "#64748b" }

// bounded, visibly-boxed scroll area for growable lists (target market, USP, negative prompt) —
// only this inner box scrolls, like a table body, instead of the whole section pushing content down
const listBoxSx = {
  maxHeight: 168,
  overflowY: "auto",
  border: "1px solid rgba(35,57,113,0.14)",
  borderRadius: "12px",
  background: "rgba(241,245,249,0.6)",
  p: 1,
}

const neutralChipSx = {
  borderRadius: "999px",
  ...F,
  fontWeight: 600,
  background: "rgba(148,163,184,0.12)",
  color: "#64748b",
  border: "1px solid rgba(148,163,184,0.24)",
  "& .MuiChip-deleteIcon": {
    color: "rgba(100,116,139,0.48)",
    "&:hover": { color: "#475569" },
  },
}

const sectionCardSx = {
  borderRadius: "14px",
  border: `1px solid ${NEUTRAL_BORDER}`,
  background: "rgba(248,250,252,0.78)",
  boxShadow: "0 1px 4px rgba(15,23,42,0.04), 0 8px 20px -10px rgba(35,57,113,0.14)",
  p: 1,
  transition: "box-shadow 0.25s ease, border-color 0.25s ease",
  "&:hover": {
    borderColor: "rgba(100,116,139,0.36)",
    boxShadow: "0 2px 8px rgba(15,23,42,0.06), 0 12px 26px -10px rgba(35,57,113,0.2)",
  },
}

const modernSwitchSx = {
  width: 40, height: 24, padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: "3px",
    transitionDuration: "220ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        background: "linear-gradient(135deg,#2a9d8f,#23857a)",
        opacity: 1,
        border: "none",
      },
      "& .MuiSwitch-thumb": { boxShadow: "0 2px 6px rgba(42,157,143,0.5)" },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 18, height: 18,
    boxShadow: "0 1px 3px rgba(15,23,42,0.3)",
    transition: "box-shadow 0.2s ease",
  },
  "& .MuiSwitch-track": {
    borderRadius: 999,
    background: "rgba(148,163,184,0.55)",
    opacity: 1,
    transition: "background 0.25s ease",
  },
}

const compactSwitchSx = {
  ...modernSwitchSx,
  width: 32, height: 19, padding: 0,
  "& .MuiSwitch-switchBase": {
    ...modernSwitchSx["& .MuiSwitch-switchBase"],
    padding: "2.5px",
    "&.Mui-checked": {
      ...modernSwitchSx["& .MuiSwitch-switchBase"]["&.Mui-checked"],
      transform: "translateX(13px)",
    },
  },
  "& .MuiSwitch-thumb": {
    ...modernSwitchSx["& .MuiSwitch-thumb"],
    width: 14, height: 14,
  },
}

function ExpandToggle({ expanded, onClick }) {
  return (
    <IconButton
      size="small"
      onClick={(e) => { e.stopPropagation(); onClick() }}
      sx={{
        width: 24, height: 24,
        borderRadius: "8px",
        border: "1.5px solid rgba(16,29,64,0.7)",
        color: "#101d40",
        background: "rgba(16,29,64,0.18)",
        "&:hover": { background: "rgba(16,29,64,0.28)", borderColor: "#101d40" },
        "& svg": { fontSize: "16px !important" },
      }}
    >
      {expanded ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
    </IconButton>
  )
}

function SectionIcon({ icon: Icon }) {
  return (
    <Box sx={{
      width: 26, height: 26, borderRadius: "9px", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: NEUTRAL_SOFT,
      border: `1px solid ${NEUTRAL_BORDER}`,
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16), 0 6px 14px rgba(63,63,70,0.24)",
      color: NEUTRAL_ACCENT,
      "& svg": { fontSize: "16px" },
    }}>
      <Icon />
    </Box>
  )
}

const SMOOTH_EASING = { enter: "cubic-bezier(0.4,0,0.2,1)", exit: "cubic-bezier(0.4,0,0.2,1)" }

function SmoothCollapse({ children, ...props }) {
  return <Collapse timeout={260} easing={SMOOTH_EASING} {...props}>{children}</Collapse>
}

function SectionHeader({ label, icon, iconGradient, iconShadow, chip, sectionKey, isHidden, onToggle, expanded, onToggleExpand, children }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={isHidden || !expanded ? 0 : 1.5}
      onClick={onToggleExpand} sx={{ cursor: "pointer", transition: "margin-bottom 260ms cubic-bezier(0.4,0,0.2,1)" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        {icon && <SectionIcon icon={icon} />}
        <Typography sx={sectionLabel}>{label}</Typography>
        {chip && !isHidden && expanded && chip}
      </Stack>
      <Stack direction="row" spacing={0.8} alignItems="center">
        {children}
        <ExpandToggle expanded={expanded} onClick={onToggleExpand} />
        <Tooltip title={isHidden ? `Add back ${label}` : `Remove ${label} from prompt`}>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onToggle(sectionKey) }}
            sx={{
              width: 24, height: 24,
              borderRadius: "8px",
              border: isHidden ? "1.5px solid rgba(16,29,64,0.7)" : "1.5px solid rgba(127,29,29,0.7)",
              color: isHidden ? "#101d40" : "#7f1d1d",
              background: isHidden ? "rgba(16,29,64,0.18)" : "rgba(127,29,29,0.16)",
              "&:hover": {
                background: isHidden ? "rgba(16,29,64,0.28)" : "rgba(127,29,29,0.26)",
                borderColor: isHidden ? "#101d40" : "#7f1d1d",
              },
              "& svg": { fontSize: "14px !important" },
            }}
          >
            {isHidden ? <AddRoundedIcon /> : <CloseRoundedIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  )
}

const VIEW_ANGLES    = ["Front View", "Side View", "Back View", "Three Quarter Front View", "3/4 View", "Top View", "Isometric"]
const ASPECT_RATIOS  = ["1:1", "4:3", "16:9", "9:16", "3:4", "2:3"]
const LIGHTING_TYPES = ["Soft Natural Daylight", "Premium Dramatic Lighting", "Soft Natural Lighting", "Studio Lighting", "Golden Hour", "High-Key Lighting", "Low-Key Lighting"]
const DESIGN_TYPES   = ["Marketplace Main Image", "Marketplace Lifestyle Image", "Product Detail Shot", "Infographic Banner", "Social Media Post"]

const DEFAULT_DATA = {
  design_analysis: {
    design_type: "Marketplace Main Image",
    aspect_ratio: "1:1",
    visual_style: "Clean Home Product Advertising",
    objective: [
      "Stop scrolling within 1-3 seconds",
      "Instantly highlight effortless cleaning benefit",
      "Showcase mop bucket and spin mop clearly",
      "Communicate practical household cleaning features",
      "Drive clicks and marketplace conversions",
    ],
  },
  product: {
    name: "Spin Mop Ultra 2 in 1",
    category: "Spin Mop Set",
    view_angle: "Three Quarter Front View",
    main_color: "Purple and White",
    preservation: {
      shape: "Preserve Exact", proportion: "Preserve Exact", material: "Preserve Exact",
      texture: "Preserve Exact", logo: "Preserve Exact", color: "Preserve Exact", details: "Preserve Exact",
    },
  },
  target_market: ["Homeowners", "Housewives", "Apartment Residents", "Cleaning Enthusiasts", "Marketplace Shoppers"],
  layout: {
    structure: "Right Heavy Marketplace Layout",
    canvas: { ratio: "1:1", safe_margin: "5%", composition: "Product on left, text and features on right" },
    sections: {
      top_right:    { content: "Feature Icons",                       width: "35%",    alignment: "Horizontal Row" },
      center_left:  { content: "Hero Product",                        width: "55-60%", position: "Lower Left" },
      center_right: { content: "Main Headline and Product Subtitle",  width: "45%",    position: "Upper Right" },
      right_side:   { content: "USP Feature Pills",                   width: "38-42%", position: "Middle Right" },
    },
  },
  background: {
    style: "Modern Bright Kitchen Interior",
    theme: "Clean Home Cleaning Product",
    lighting: "Soft Natural Daylight",
    tone: "Bright, Clean, Minimal, Premium",
    blur_level: "Strong Depth of Field",
    elements: ["Modern Kitchen Counter", "Wooden Cabinet", "White Floor Tiles", "Soft Window Light", "Minimal Home Interior"],
    purpose: "Show product usage in a clean household environment without distracting from the product",
  },
  product_display: {
    position: "Lower Left to Center",
    size: "55-65% of canvas",
    angle: "Three Quarter Front View",
    floating_effect: false,
    shadow: { type: "Soft Realistic Ground Shadow", opacity: "25-35%" },
    lighting: { type: "Commercial Product Photography", reflection: "Soft Controlled Highlights" },
    details: {
      bucket: "White rectangular bucket with purple rim and handle",
      basket: "Visible stainless steel spin basket",
      mop_handle: "Diagonal stainless steel handle with purple grip",
      mop_head: "White microfiber mop head on floor",
      floor_effect: "Small water droplets near mop for cleaning effect",
    },
  },
  top_icon_section: {
    position: "Top Right",
    layout: "Horizontal Icon Row",
    icon_count: 4,
    icon_style: {
      shape: "Circle", outline: "#000000", background: "#F4F4F4",
      icon_color: "#000000", uniform_size: true, style: "Simple Black Line Icon",
    },
    items: [
      { icon: "360 Spin",       title: "360°"       },
      { icon: "Microfiber Cloth", title: "Microfiber" },
      { icon: "Easy Cleaning",  title: "Easy Clean" },
      { icon: "Quality Shield", title: "Quality"    },
    ],
  },
  headline_section: {
    position: "Upper Right",
    alignment: "Right",
    hierarchy: {
      main_headline: {
        text: "BERSIH TANPA EFFORT",
        font_style: "Bold Sans Serif", font_weight: "Extra Bold", case: "Uppercase",
        color: "#000000",
        stroke: { enabled: true, color: "#FFFFFF", width: "3-5px" },
        shadow: { enabled: true, type: "Soft Drop Shadow", opacity: "25%" },
        size: "Very Large", line_height: "Tight",
      },
      subtitle: {
        text: "Spin Mop Ultra 2 in 1",
        font_style: "Italic Modern Sans Serif", font_weight: "Regular",
        color: "#111111", size: "Medium", placement: "Below Main Headline",
      },
    },
  },
  usp_section: {
    position: "Right Side",
    layout: "Vertical Rounded Pill List",
    spacing: "Consistent",
    pill_style: {
      shape: "Rounded Rectangle", background: "#000000", text_color: "#FFFFFF",
      corner_radius: "Large", padding: "Medium",
      shadow: { enabled: true, opacity: "15%" },
    },
    thumbnail_style: {
      shape: "Circle", background: "#FFFFFF", border: "#000000",
      placement: "Left side overlapping each pill", image_style: "Small product feature photo",
    },
    items: [
      { thumbnail: "Spin mop washing and drying inside bucket", title: "Membersihkan\nMengeringkan" },
      { thumbnail: "Close up stainless steel basket",           title: "Stainless\nSteel"          },
      { thumbnail: "Close up white microfiber mop head",        title: "Kain\nMicrofiber"          },
    ],
  },
  color_palette: {
    primary:         "#B66AD8",
    secondary:       "#FFFFFF",
    accent:          "#000000",
    background_soft: "#F4F1EC",
    text_dark:       "#000000",
    text_light:      "#FFFFFF",
  },
  typography: {
    font_family: "Modern Sans-Serif (e.g. Poppins, Nunito, or similar)",
    headline: { style: "Extra Bold Sans Serif", weight: "900", letter_spacing: "Tight", case: "Uppercase" },
    subtitle:  { style: "Italic Sans Serif",     weight: "400" },
    usp:       { style: "Bold Rounded Sans Serif", weight: "800" },
  },
  visual_effects: {
    depth: true, layering: true, realistic_shadow: true, realistic_lighting: true,
    high_detail: true, premium_finish: true, background_blur: true,
    white_text_stroke: true, rounded_black_feature_pills: true,
  },
  visual_priority: [
    "Spin Mop Product", "BERSIH TANPA EFFORT Headline", "Feature Pills",
    "Product Subtitle", "Top Icons", "Kitchen Background",
  ],
  design_formula: {
    product_focus: "55%", headline: "20%", usp: "15%",
    icons: "5%", background_support: "2%",
  },
  rendering_style: {
    quality: "Highest Possible", photorealistic: true, commercial_grade: true,
    mobile_friendly: true, realistic_lighting: true, realistic_shadows: true,
    high_detail: true, scroll_stopping: true, marketplace_ready: true,
  },
  output_spec: {
    aspect_ratio: "1:1", max_longest_side: "1920px",
    preserve_original_image_proportions: true,
    do_not_change_aspect_ratio: true, recommended_resolution: "1920x1920",
  },
  negative_prompt: [
    "Do not create industrial safety background",
    "Do not use construction site",
    "Do not use scaffolding",
    "Do not use safety vest",
    "Do not change the product shape",
    "Do not remove the mop bucket",
    "Do not crop the main product",
    "Do not make the text small",
    "Do not use cluttered background",
    "Do not use dark kitchen background",
    "Do not distort logo",
    "Do not add extra products",
  ],
}

const DEFAULT_INSTRUCTIONS =
  "Use aspect ratio 1:1. Output at the highest quality possible, with the longest side at most 1920px. Do NOT change the aspect ratio — keep the original image proportions exactly."

export default function PromptBuilderGTPage() {
  const [data, setData]           = useState(DEFAULT_DATA)
  const [instructions, setInst]   = useState(DEFAULT_INSTRUCTIONS)
  const [copied, setCopied]       = useState(false)
  const [newTarget, setNewTarget] = useState("")
  const [newElement, setNewEl]    = useState("")
  const [newUsp, setNewUsp]       = useState("")
  const [newNeg, setNewNeg]       = useState("")
  const [hidden, setHidden]       = useState(new Set())
  const [expandedSections, setExpandedSections] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [matchIndex, setMatchIndex]   = useState(0)
  const [manualPromptMode, setManualPromptMode] = useState(false)
  const [manualPromptText, setManualPromptText] = useState("")

  const toggleHide = (key) => setHidden(prev => {
    const next = new Set(prev)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })
  const isHidden = (key) => hidden.has(key)

  const isExpanded = (key) => expandedSections.has(key)
  const toggleExpanded = (key) => setExpandedSections(prev => (prev.has(key) ? new Set() : new Set([key])))

  const set = (path, value) => {
    setData(prev => {
      const next = structuredClone(prev)
      const keys = path.split(".")
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return next
    })
  }

  const generateOutput = () => {
    const filtered = Object.fromEntries(
      Object.entries(data).filter(([k]) => !hidden.has(k))
    )
    const extras = instructions.trim() ? "\n\n" + instructions : ""
    return JSON.stringify(filtered, null, 2) + extras
  }

  const toggleManualPromptMode = () => {
    if (!manualPromptMode) {
      if (!manualPromptText) setManualPromptText(generateOutput())
    }
    setManualPromptMode(m => !m)
  }

  const outputText = useMemo(
    () => (manualPromptMode ? manualPromptText : generateOutput()),
    [manualPromptMode, manualPromptText, data, hidden, instructions]
  )

  const normalizedSearch = searchQuery.trim().toLowerCase()
  const searchActive = normalizedSearch.length > 0

  const getMatchCount = (text, query) => {
    if (!query) return 0
    let count = 0, idx = 0
    const lower = text.toLowerCase()
    while ((idx = lower.indexOf(query, idx)) !== -1) { count++; idx++ }
    return count
  }

  const matchCount = useMemo(
    () => (searchActive ? getMatchCount(outputText, normalizedSearch) : 0),
    [searchActive, outputText, normalizedSearch]
  )

  useEffect(() => { setMatchIndex(0) }, [normalizedSearch])

  useEffect(() => {
    if (!searchActive || matchCount === 0) return
    document.getElementById(`gt-match-${matchIndex}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [matchIndex, normalizedSearch, searchActive, matchCount])

  const goPrev = () => setMatchIndex(i => (i - 1 + matchCount) % matchCount)
  const goNext = () => setMatchIndex(i => (i + 1) % matchCount)

  const highlightText = (text, query, activeIdx) => {
    if (!query) return [<span key="all">{text}</span>]
    const parts = []
    const lower = text.toLowerCase()
    let last = 0, idx = 0, spanKey = 0, matchNum = 0
    while ((idx = lower.indexOf(query, last)) !== -1) {
      if (idx > last) parts.push(<span key={spanKey++}>{text.slice(last, idx)}</span>)
      const isActive = matchNum === activeIdx
      parts.push(
        <mark key={spanKey++} id={`gt-match-${matchNum}`} style={{ background: isActive ? "#f97316" : "#facc15", color: "#0f172a", borderRadius: "3px", padding: "0 2px", outline: isActive ? "2px solid #fb923c" : "none", outlineOffset: "1px" }}>
          {text.slice(idx, idx + query.length)}
        </mark>
      )
      last = idx + query.length
      matchNum++
    }
    if (last < text.length) parts.push(<span key={spanKey++}>{text.slice(last)}</span>)
    return parts
  }

  const highlightedOutput = useMemo(
    () => (searchActive ? highlightText(outputText, normalizedSearch, matchIndex) : outputText),
    [searchActive, outputText, normalizedSearch, matchIndex]
  )

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const addTarget  = () => { if (!newTarget.trim()) return; set("target_market", [...data.target_market, newTarget.trim()]); setNewTarget("") }
  const rmTarget   = i  => set("target_market", data.target_market.filter((_, j) => j !== i))
  const addElement = () => { if (!newElement.trim()) return; set("background.elements", [...data.background.elements, newElement.trim()]); setNewEl("") }
  const rmElement  = i  => set("background.elements", data.background.elements.filter((_, j) => j !== i))
  const addUsp     = () => { if (!newUsp.trim()) return; set("usp_section.items", [...data.usp_section.items, { thumbnail: "", title: newUsp.trim() }]); setNewUsp("") }
  const rmUsp      = i  => set("usp_section.items", data.usp_section.items.filter((_, j) => j !== i))
  const editUsp    = (i, v) => { const items = structuredClone(data.usp_section.items); items[i].title = v; set("usp_section.items", items) }
  const addNeg     = () => { if (!newNeg.trim()) return; set("negative_prompt", [...data.negative_prompt, newNeg.trim()]); setNewNeg("") }
  const rmNeg      = i  => set("negative_prompt", data.negative_prompt.filter((_, j) => j !== i))

  return (
    <Box sx={{ position: "relative", ...F, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <FontStyle />

      <Stack spacing={3} sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <Card elevation={0} sx={{ ...cardShell, flex: 1, height: "100%", minHeight: 0, display: "flex", flexDirection: "column" }}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={0} alignItems="stretch" sx={{ flex: 1, minHeight: 0, overflow: { xs: "auto", lg: "hidden" } }}>

          {/* ══════════════════════════
              LEFT COLUMN — Form Input
          ══════════════════════════ */}
          <Box sx={{ flex: 1.1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
            <CardContent sx={{ p: { xs: 1.5, md: "16px 24px" }, position: "relative", zIndex: 2, overflow: "hidden", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
              <Stack spacing={1.3} sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>

                {/* Header (fixed) */}
                <Box>
                  <Typography sx={{ ...F, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0f172a" }}>
                    Prompt Builder GT
                  </Typography>
                  <Typography sx={{ ...F, fontSize: "0.7rem", color: "#94a3b8", mt: "2px" }}>
                    Template marketplace home product — JSON prompt auto-generated
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* Scrollable section list — capped so ~5 collapsed cards show by default, rest needs scroll */}
                <Stack spacing={1.5} sx={{
                  flex: 1, minHeight: 0, maxHeight: 320, overflowY: "auto", overflowX: "hidden", pr: 0.5,
                  "&::-webkit-scrollbar": { width: 6 },
                  "&::-webkit-scrollbar-thumb": { background: "rgba(35,57,113,0.25)", borderRadius: 999 },
                  "&::-webkit-scrollbar-track": { background: "transparent" },
                }}>

                {/* ── Design Info ── */}
                <Box sx={sectionCardSx}>
                  <SectionHeader label="Design Info" icon={AutoAwesomeRoundedIcon} sectionKey="design_analysis" isHidden={isHidden("design_analysis")} onToggle={toggleHide}
                    expanded={isExpanded("design_analysis")} onToggleExpand={() => toggleExpanded("design_analysis")}
                  />
                  <SmoothCollapse in={!isHidden("design_analysis") && isExpanded("design_analysis")}>
                    <Stack spacing={1.5}>
                      <TextField select fullWidth label="Design Type" size="small" value={data.design_analysis.design_type} onChange={e => set("design_analysis.design_type", e.target.value)} sx={inputSx}>
                        {DESIGN_TYPES.map(v => <MenuItem key={v} value={v} sx={F}>{v}</MenuItem>)}
                      </TextField>
                      <Stack direction="row" spacing={1.5}>
                        <TextField select fullWidth label="Aspect Ratio" size="small" value={data.design_analysis.aspect_ratio} onChange={e => set("design_analysis.aspect_ratio", e.target.value)} sx={inputSx}>
                          {ASPECT_RATIOS.map(v => <MenuItem key={v} value={v} sx={F}>{v}</MenuItem>)}
                        </TextField>
                        <TextField fullWidth label="Visual Style" size="small" value={data.design_analysis.visual_style} onChange={e => set("design_analysis.visual_style", e.target.value)} sx={inputSx} />
                      </Stack>
                    </Stack>
                  </SmoothCollapse>
                </Box>

                {/* ── Product Info ── */}
                <Box sx={sectionCardSx}>
                  <SectionHeader label="Product Info" icon={LocalMallRoundedIcon} sectionKey="product" isHidden={isHidden("product")} onToggle={toggleHide}
                    expanded={isExpanded("product")} onToggleExpand={() => toggleExpanded("product")}
                  />
                  <SmoothCollapse in={!isHidden("product") && isExpanded("product")}>
                    <Stack spacing={1.5}>
                      <TextField fullWidth label="Product Name" size="small" value={data.product.name} onChange={e => set("product.name", e.target.value)} helperText="Product name. Example: Spin Mop Ultra 2 in 1" sx={inputSx} />
                      <Stack direction="row" spacing={1.5}>
                        <TextField fullWidth label="Product Category" size="small" value={data.product.category} onChange={e => set("product.category", e.target.value)} sx={inputSx} />
                        <TextField select fullWidth label="View Angle" size="small" value={data.product.view_angle} onChange={e => set("product.view_angle", e.target.value)} sx={inputSx}>
                          {VIEW_ANGLES.map(v => <MenuItem key={v} value={v} sx={F}>{v}</MenuItem>)}
                        </TextField>
                      </Stack>
                      <TextField fullWidth label="Main Color" size="small" value={data.product.main_color} onChange={e => set("product.main_color", e.target.value)} helperText="Main product color. Example: Purple and White" sx={inputSx} />
                    </Stack>
                  </SmoothCollapse>
                </Box>

                {/* ── Headline & Text ── */}
                <Box sx={sectionCardSx}>
                  <SectionHeader label="Headline & Text" icon={TextFieldsRoundedIcon} sectionKey="headline_section" isHidden={isHidden("headline_section")} onToggle={toggleHide}
                    expanded={isExpanded("headline_section")} onToggleExpand={() => toggleExpanded("headline_section")}
                  />
                  <SmoothCollapse in={!isHidden("headline_section") && isExpanded("headline_section")}>
                    <Stack spacing={1.5}>
                      <TextField fullWidth label="Font Family" size="small" value={data.typography.font_family} onChange={e => set("typography.font_family", e.target.value)} helperText="Font used across the design. Example: Poppins, Nunito, Montserrat" sx={inputSx} />
                      <Box>
                        <Typography sx={{ ...sectionSub, mb: 0.8 }}>Main Headline</Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <TextField fullWidth size="small" placeholder="Contoh: BERSIH TANPA EFFORT" value={data.headline_section.hierarchy.main_headline.text} onChange={e => set("headline_section.hierarchy.main_headline.text", e.target.value)} sx={inputSx} />
                          <Box sx={{ flexShrink: 0 }}>
                            <Typography sx={{ ...sectionSub, mb: 0.5, fontSize: "0.72rem" }}>Color</Typography>
                            <Box sx={{ position: "relative", width: 46, height: 34, borderRadius: "10px", border: "1.5px solid rgba(35,57,113,0.25)", overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 6px rgba(35,57,113,0.12)", "&:hover": { borderColor: "rgba(35,57,113,0.45)" } }}>
                              <input type="color" value={data.headline_section.hierarchy.main_headline.color} onChange={e => set("headline_section.hierarchy.main_headline.color", e.target.value)}
                                style={{ position: "absolute", inset: "-4px", width: "calc(100% + 8px)", height: "calc(100% + 8px)", border: "none", cursor: "pointer", padding: 0 }} />
                            </Box>
                          </Box>
                        </Stack>
                      </Box>
                      <Box>
                        <Typography sx={{ ...sectionSub, mb: 0.8 }}>Subtitle / Product Name</Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <TextField fullWidth size="small" placeholder="Contoh: Spin Mop Ultra 2 in 1" value={data.headline_section.hierarchy.subtitle.text} onChange={e => set("headline_section.hierarchy.subtitle.text", e.target.value)} sx={inputSx} />
                          <Box sx={{ flexShrink: 0 }}>
                            <Typography sx={{ ...sectionSub, mb: 0.5, fontSize: "0.72rem" }}>Color</Typography>
                            <Box sx={{ position: "relative", width: 46, height: 34, borderRadius: "10px", border: "1.5px solid rgba(35,57,113,0.25)", overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 6px rgba(35,57,113,0.12)", "&:hover": { borderColor: "rgba(35,57,113,0.45)" } }}>
                              <input type="color" value={data.headline_section.hierarchy.subtitle.color} onChange={e => set("headline_section.hierarchy.subtitle.color", e.target.value)}
                                style={{ position: "absolute", inset: "-4px", width: "calc(100% + 8px)", height: "calc(100% + 8px)", border: "none", cursor: "pointer", padding: 0 }} />
                            </Box>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>
                  </SmoothCollapse>
                </Box>

                {/* ── Target Market ── */}
                <Box sx={sectionCardSx}>
                  <SectionHeader label="Target Market" icon={GpsFixedRoundedIcon} sectionKey="target_market" isHidden={isHidden("target_market")} onToggle={toggleHide}
                    expanded={isExpanded("target_market")} onToggleExpand={() => toggleExpanded("target_market")}>
                    {!isHidden("target_market") && isExpanded("target_market") && <Typography sx={{ ...sectionSub, fontSize: "0.75rem" }}>{data.target_market.length} active</Typography>}
                  </SectionHeader>
                  <SmoothCollapse in={!isHidden("target_market") && isExpanded("target_market")}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px", mb: 1.5, ...listBoxSx }}>
                      {data.target_market.map((t, i) => (
                        <Chip key={i} label={t} onDelete={() => rmTarget(i)} size="small"
                          sx={{ ...neutralChipSx, fontSize: "0.73rem" }} />
                      ))}
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ flex: 1, borderRadius: "14px", border: "1.5px solid rgba(35,57,113,0.22)", background: "rgba(241,245,249,0.9)", backdropFilter: "blur(8px)", "&:focus-within": { borderColor: "#233971", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" }, overflow: "hidden" }}>
                        <input value={newTarget} onChange={e => setNewTarget(e.target.value)} onKeyDown={e => e.key === "Enter" && addTarget()} placeholder="Add target market..." style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "9px 14px", fontFamily: "Sora,sans-serif", fontSize: "14px", color: "#1e293b", background: "transparent", border: "none", outline: "none" }} />
                      </Box>
                      <Button variant="contained" onClick={addTarget} sx={{ borderRadius: "14px", minWidth: 42, px: 1.5, background: "linear-gradient(135deg,#2a9d8f,#23857a)", boxShadow: "0 4px 12px rgba(42,157,143,0.32)", "&:hover": { background: "linear-gradient(135deg,#23857a,#1c6b62)", transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                        <AddRoundedIcon />
                      </Button>
                    </Stack>
                  </SmoothCollapse>
                </Box>

                {/* ── Background ── */}
                <Box sx={sectionCardSx}>
                  <SectionHeader label="Background" icon={WallpaperRoundedIcon} sectionKey="background" isHidden={isHidden("background")} onToggle={toggleHide}
                    expanded={isExpanded("background")} onToggleExpand={() => toggleExpanded("background")}
                  />
                  <SmoothCollapse in={!isHidden("background") && isExpanded("background")}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1.5}>
                        <TextField fullWidth label="Background Style" size="small" value={data.background.style} onChange={e => set("background.style", e.target.value)} sx={inputSx} />
                        <TextField fullWidth label="Theme" size="small" value={data.background.theme} onChange={e => set("background.theme", e.target.value)} sx={inputSx} />
                      </Stack>
                      <TextField select fullWidth label="Lighting" size="small" value={data.background.lighting} onChange={e => set("background.lighting", e.target.value)} sx={inputSx}>
                        {LIGHTING_TYPES.map(v => <MenuItem key={v} value={v} sx={F}>{v}</MenuItem>)}
                      </TextField>
                      <Box>
                        <Typography sx={{ ...sectionSub, mb: 1 }}>Background Elements</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px", mb: 1.2 }}>
                          {data.background.elements.map((el, i) => (
                            <Chip key={i} label={el} onDelete={() => rmElement(i)} size="small"
                              sx={{ ...neutralChipSx, fontSize: "0.73rem" }} />
                          ))}
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Box sx={{ flex: 1, borderRadius: "14px", border: "1.5px solid rgba(35,57,113,0.22)", background: "rgba(241,245,249,0.9)", backdropFilter: "blur(8px)", "&:focus-within": { borderColor: "#233971", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" }, overflow: "hidden" }}>
                            <input value={newElement} onChange={e => setNewEl(e.target.value)} onKeyDown={e => e.key === "Enter" && addElement()} placeholder="Example: Wooden Cabinet, White Tiles..." style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "9px 14px", fontFamily: "Sora,sans-serif", fontSize: "14px", color: "#1e293b", background: "transparent", border: "none", outline: "none" }} />
                          </Box>
                          <Button variant="contained" onClick={addElement} sx={{ borderRadius: "14px", minWidth: 42, px: 1.5, background: "linear-gradient(135deg,#2a9d8f,#23857a)", boxShadow: "0 4px 12px rgba(42,157,143,0.32)", "&:hover": { background: "linear-gradient(135deg,#23857a,#1c6b62)", transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                            <AddRoundedIcon />
                          </Button>
                        </Stack>
                      </Box>
                      <TextField fullWidth multiline rows={2} label="Background Purpose" size="small" value={data.background.purpose} onChange={e => set("background.purpose", e.target.value)} sx={inputSx} />
                    </Stack>
                  </SmoothCollapse>
                </Box>

                {/* ── Key Features (USP) ── */}
                <Box sx={sectionCardSx}>
                  <SectionHeader label="Key Features (USP)" icon={WorkspacePremiumRoundedIcon} sectionKey="usp_section" isHidden={isHidden("usp_section")} onToggle={toggleHide}
                    expanded={isExpanded("usp_section")} onToggleExpand={() => toggleExpanded("usp_section")}>
                    {!isHidden("usp_section") && isExpanded("usp_section") && <Typography sx={{ ...sectionSub, fontSize: "0.75rem" }}>{data.usp_section.items.length} features</Typography>}
                  </SectionHeader>
                  <SmoothCollapse in={!isHidden("usp_section") && isExpanded("usp_section")}>
                    <Typography sx={{ ...sectionSub, mb: 1.5 }}>Displayed as pill list on the right side of the design</Typography>
                    <Stack spacing={1.2}>
                      <Stack spacing={1.2} sx={listBoxSx}>
                        {data.usp_section.items.map((item, i) => (
                          <Stack key={i} direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(148,163,184,0.14)", border: "1px solid rgba(148,163,184,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)" }}>
                              <Typography sx={{ ...F, color: "#64748b", fontSize: "0.72rem", fontWeight: 800 }}>{i + 1}</Typography>
                            </Box>
                            <Box sx={{ flex: 1, borderRadius: "14px", border: "1.5px solid rgba(35,57,113,0.22)", background: "rgba(241,245,249,0.9)", backdropFilter: "blur(8px)", "&:focus-within": { borderColor: "#233971", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" }, overflow: "hidden" }}>
                              <input value={item.title} onChange={e => editUsp(i, e.target.value)} placeholder={`Feature ${i + 1}`} style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "9px 14px", fontFamily: "Sora,sans-serif", fontSize: "14px", color: "#1e293b", background: "transparent", border: "none", outline: "none" }} />
                            </Box>
                            <IconButton onClick={() => rmUsp(i)} disabled={data.usp_section.items.length <= 1} size="small"
                              sx={{ width: 34, height: 34, borderRadius: "10px", border: "1.5px solid rgba(127,29,29,0.7)", color: "#7f1d1d", background: "rgba(127,29,29,0.16)", "&:hover": { background: "rgba(127,29,29,0.26)", borderColor: "#7f1d1d" }, "&.Mui-disabled": { color: "rgba(148,163,184,0.4)", borderColor: "rgba(148,163,184,0.2)", background: "transparent" } }}>
                              <CloseRoundedIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        ))}
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <Box sx={{ flex: 1, borderRadius: "14px", border: "1.5px dashed rgba(35,57,113,0.28)", background: "rgba(241,245,249,0.75)", "&:focus-within": { borderColor: "#233971", borderStyle: "solid", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" }, overflow: "hidden" }}>
                          <input value={newUsp} onChange={e => setNewUsp(e.target.value)} onKeyDown={e => e.key === "Enter" && addUsp()} placeholder="Add new feature..." style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "9px 14px", fontFamily: "Sora,sans-serif", fontSize: "14px", color: "#1e293b", background: "transparent", border: "none", outline: "none" }} />
                        </Box>
                        <Button variant="contained" onClick={addUsp} sx={{ borderRadius: "14px", minWidth: 42, px: 1.5, background: "linear-gradient(135deg,#2a9d8f,#23857a)", boxShadow: "0 4px 12px rgba(42,157,143,0.32)", "&:hover": { background: "linear-gradient(135deg,#23857a,#1c6b62)", transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                          <AddRoundedIcon />
                        </Button>
                      </Stack>
                    </Stack>
                  </SmoothCollapse>
                </Box>

                {/* ── Negative Prompt ── */}
                <Box sx={sectionCardSx}>
                  <SectionHeader label="Negative Prompt" icon={BlockRoundedIcon} sectionKey="negative_prompt" isHidden={isHidden("negative_prompt")} onToggle={toggleHide}
                    expanded={isExpanded("negative_prompt")} onToggleExpand={() => toggleExpanded("negative_prompt")}>
                    {!isHidden("negative_prompt") && isExpanded("negative_prompt") && <Typography sx={{ ...sectionSub, fontSize: "0.75rem" }}>{data.negative_prompt.length} rules</Typography>}
                  </SectionHeader>
                  <SmoothCollapse in={!isHidden("negative_prompt") && isExpanded("negative_prompt")}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px", mb: 1.5, ...listBoxSx }}>
                      {data.negative_prompt.map((t, i) => (
                        <Chip key={i} label={t} onDelete={() => rmNeg(i)} size="small"
                          sx={{ ...neutralChipSx, fontSize: "0.71rem" }} />
                      ))}
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Box sx={{ flex: 1, borderRadius: "14px", border: "1.5px solid rgba(239,68,68,0.25)", background: "rgba(241,245,249,0.9)", backdropFilter: "blur(8px)", "&:focus-within": { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239,68,68,0.08)" }, overflow: "hidden" }}>
                        <input value={newNeg} onChange={e => setNewNeg(e.target.value)} onKeyDown={e => e.key === "Enter" && addNeg()} placeholder="Add restriction... Example: Do not crop the product" style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "9px 14px", fontFamily: "Sora,sans-serif", fontSize: "14px", color: "#1e293b", background: "transparent", border: "none", outline: "none" }} />
                      </Box>
                      <Button variant="contained" onClick={addNeg} sx={{ borderRadius: "14px", minWidth: 42, px: 1.5, background: "linear-gradient(135deg,#dc2626,#ef4444)", boxShadow: "0 4px 12px rgba(239,68,68,0.28)", "&:hover": { background: "linear-gradient(135deg,#b91c1c,#dc2626)", transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                        <AddRoundedIcon />
                      </Button>
                    </Stack>
                  </SmoothCollapse>
                </Box>

                </Stack>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Additional Instructions (fixed, fills remaining space like Prompt Output) ── */}
                <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} flexShrink={0}>
                    <Typography sx={sectionLabel}>Additional Instructions</Typography>
                    <Typography sx={{ ...sectionSub, fontSize: "0.75rem" }}>Appended after JSON</Typography>
                  </Stack>
                  <Box sx={{ borderRadius: "16px", border: "1.5px solid rgba(35,57,113,0.22)", background: "rgba(241,245,249,0.9)", backdropFilter: "blur(8px)", transition: "border-color 0.2s, box-shadow 0.2s", "&:focus-within": { borderColor: "#233971", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" }, "&:hover": { borderColor: "rgba(35,57,113,0.35)" }, overflow: "hidden", flex: 1, minHeight: 90, display: "flex", flexDirection: "column" }}>
                    <textarea value={instructions} onChange={e => setInst(e.target.value)}
                      style={{ display: "block", width: "100%", height: "100%", boxSizing: "border-box", resize: "none", flex: 1, minHeight: 0, padding: "12px 14px", fontFamily: "Sora, sans-serif", fontSize: "13px", lineHeight: 1.6, color: "#1e293b", background: "transparent", border: "none", outline: "none" }} />
                  </Box>
                </Box>

              </Stack>
            </CardContent>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", lg: "block" }, borderColor: "rgba(35,57,113,0.12)" }} />
          <Divider sx={{ display: { xs: "block", lg: "none" }, borderColor: "rgba(35,57,113,0.12)" }} />

          {/* ══════════════════════════
              RIGHT COLUMN — Config & Output
          ══════════════════════════ */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
            <CardContent sx={{ p: { xs: 1.5, md: "16px 24px" }, position: "relative", zIndex: 2, overflow: "hidden", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
              <Stack spacing={1.3} sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>

                {/* Header (fixed) */}
                <Box>
                  <Typography sx={{ ...F, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0f172a" }}>
                    Configuration & Output
                  </Typography>
                  <Typography sx={{ ...F, fontSize: "0.7rem", color: "#94a3b8", mt: "2px" }}>
                    Set colors & effects, then copy the full prompt
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* Scrollable section list */}
                <Stack spacing={1.5} sx={{
                  flex: "0 1 auto", minHeight: 0, maxHeight: 220, overflowY: "auto", overflowX: "hidden", pr: 0.5,
                  "&::-webkit-scrollbar": { width: 6 },
                  "&::-webkit-scrollbar-thumb": { background: "rgba(35,57,113,0.25)", borderRadius: 999 },
                  "&::-webkit-scrollbar-track": { background: "transparent" },
                }}>

                {/* ── Color Palette ── */}
                <Box sx={sectionCardSx}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={isExpanded("color_palette") ? 1.5 : 0}
                    onClick={() => toggleExpanded("color_palette")} sx={{ cursor: "pointer", transition: "margin-bottom 260ms cubic-bezier(0.4,0,0.2,1)" }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SectionIcon icon={PaletteRoundedIcon} />
                      <Typography sx={sectionLabel}>Color Palette</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <ExpandToggle expanded={isExpanded("color_palette")} onClick={() => toggleExpanded("color_palette")} />
                    </Stack>
                  </Stack>
                  <SmoothCollapse in={isExpanded("color_palette")}>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
                      {[
                        { key: "primary",         label: "Primary (Purple)" },
                        { key: "secondary",        label: "Secondary (White)" },
                        { key: "accent",           label: "Accent (Black)" },
                        { key: "background_soft",  label: "Background Soft" },
                        { key: "text_dark",        label: "Dark Text" },
                        { key: "text_light",       label: "Light Text" },
                      ].map(({ key, label }) => (
                        <Stack key={key} direction="row" spacing={1} alignItems="center"
                          sx={{ p: 1, borderRadius: "12px", border: "1px solid rgba(35,57,113,0.16)", background: "rgba(255,255,255,0.6)" }}>
                          <Box sx={{ position: "relative", width: 32, height: 32, flexShrink: 0 }}>
                            <Box sx={{
                              position: "relative", width: "100%", height: "100%", borderRadius: "8px",
                              border: "1.5px solid rgba(35,57,113,0.25)", overflow: "hidden",
                              boxShadow: "0 2px 6px rgba(35,57,113,0.12)", cursor: "pointer",
                              transition: "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
                              "&:hover": { borderColor: "#233971", boxShadow: "0 0 0 3px rgba(35,57,113,0.14)", transform: "scale(1.04)" },
                            }}>
                              <input type="color" value={data.color_palette[key]} onChange={e => set(`color_palette.${key}`, e.target.value)}
                                style={{ position: "absolute", inset: "-4px", width: "calc(100% + 8px)", height: "calc(100% + 8px)", border: "none", cursor: "pointer", padding: 0 }} />
                            </Box>
                            <Box sx={{
                              position: "absolute", bottom: -4, right: -4, width: 15, height: 15, borderRadius: "50%",
                              background: "rgba(15,23,42,0.85)", border: "1.5px solid #fff",
                              display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                              "& svg": { fontSize: "8px", color: "#fff" },
                            }}>
                              <EditRoundedIcon />
                            </Box>
                          </Box>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography noWrap sx={{ ...F, fontSize: "0.68rem", color: "#64748b", lineHeight: 1.3 }}>{label}</Typography>
                            <Box sx={{
                              position: "relative", display: "flex", alignItems: "center",
                              borderBottom: "1px dashed rgba(100,116,139,0.4)",
                              "&:hover, &:focus-within": { borderBottomColor: "#233971" },
                              "&:hover .hex-edit-icon, &:focus-within .hex-edit-icon": { opacity: 1 },
                            }}>
                              <input value={data.color_palette[key]} onChange={e => set(`color_palette.${key}`, e.target.value)}
                                style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "0 14px 2px 0", border: "none", outline: "none", background: "transparent", fontFamily: "monospace", fontSize: "0.8rem", letterSpacing: "0.03em", color: "#1e293b" }} />
                              <EditRoundedIcon className="hex-edit-icon" sx={{ position: "absolute", right: 0, bottom: 3, fontSize: "11px", color: "#94a3b8", opacity: 0.4, transition: "opacity 0.2s", pointerEvents: "none" }} />
                            </Box>
                          </Box>
                        </Stack>
                      ))}
                    </Box>
                  </SmoothCollapse>
                </Box>

                {/* ── Visual Effects ── */}
                <Box sx={sectionCardSx}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={isExpanded("visual_effects") ? 1.5 : 0}
                    onClick={() => toggleExpanded("visual_effects")} sx={{ cursor: "pointer", transition: "margin-bottom 260ms cubic-bezier(0.4,0,0.2,1)" }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SectionIcon icon={AutoFixHighRoundedIcon} />
                      <Typography sx={sectionLabel}>Visual Effects</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <ExpandToggle expanded={isExpanded("visual_effects")} onClick={() => toggleExpanded("visual_effects")} />
                    </Stack>
                  </Stack>
                  <SmoothCollapse in={isExpanded("visual_effects")}>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 1, rowGap: 0.3 }}>
                      {[
                        { key: "depth",                        label: "Depth Effect" },
                        { key: "layering",                     label: "Layering" },
                        { key: "realistic_shadow",             label: "Realistic Shadow" },
                        { key: "realistic_lighting",           label: "Realistic Lighting" },
                        { key: "high_detail",                  label: "High Detail" },
                        { key: "premium_finish",               label: "Premium Finish" },
                        { key: "background_blur",              label: "Background Blur" },
                        { key: "white_text_stroke",            label: "White Text Stroke" },
                        { key: "rounded_black_feature_pills",  label: "Feature Pills" },
                      ].map(({ key, label }) => (
                        <FormControlLabel key={key} sx={{ ml: 0, mr: 0, gap: 0.6 }}
                          control={<Switch checked={!!data.visual_effects[key]} onChange={e => set(`visual_effects.${key}`, e.target.checked)} sx={compactSwitchSx} />}
                          label={<Typography noWrap sx={{ ...F, fontSize: "0.76rem", color: "#334155" }}>{label}</Typography>}
                        />
                      ))}
                    </Box>
                  </SmoothCollapse>
                </Box>

                {/* ── Render Quality ── */}
                <Box sx={sectionCardSx}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={isExpanded("render_quality") ? 1.5 : 0}
                    onClick={() => toggleExpanded("render_quality")} sx={{ cursor: "pointer", transition: "margin-bottom 260ms cubic-bezier(0.4,0,0.2,1)" }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SectionIcon icon={VerifiedRoundedIcon} />
                      <Typography sx={sectionLabel}>Render Quality</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <ExpandToggle expanded={isExpanded("render_quality")} onClick={() => toggleExpanded("render_quality")} />
                    </Stack>
                  </Stack>
                  <SmoothCollapse in={isExpanded("render_quality")}>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 1, rowGap: 0.3 }}>
                      {[
                        { key: "photorealistic",     label: "Photorealistic" },
                        { key: "commercial_grade",   label: "Commercial Grade" },
                        { key: "mobile_friendly",    label: "Mobile Friendly" },
                        { key: "realistic_lighting", label: "Realistic Lighting" },
                        { key: "realistic_shadows",  label: "Realistic Shadows" },
                        { key: "high_detail",        label: "High Detail" },
                        { key: "scroll_stopping",    label: "Scroll Stopping" },
                        { key: "marketplace_ready",  label: "Marketplace Ready" },
                      ].map(({ key, label }) => (
                        <FormControlLabel key={key} sx={{ ml: 0, mr: 0, gap: 0.6 }}
                          control={<Switch checked={!!data.rendering_style[key]} onChange={e => set(`rendering_style.${key}`, e.target.checked)} sx={compactSwitchSx} />}
                          label={<Typography noWrap sx={{ ...F, fontSize: "0.76rem", color: "#334155" }}>{label}</Typography>}
                        />
                      ))}
                    </Box>
                  </SmoothCollapse>
                </Box>

                </Stack>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Prompt Output (fixed, fills remaining space) ── */}
                <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.2} flexShrink={0}>
                    <Box>
                      <Typography sx={sectionLabel}>Prompt Output</Typography>
                      <Typography sx={{ ...sectionSub, fontSize: "0.75rem", mt: "2px" }}>Click copy → ready to use</Typography>
                    </Box>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <FormControlLabel
                        control={
                          <Switch checked={manualPromptMode} onChange={toggleManualPromptMode} sx={modernSwitchSx} />
                        }
                        label={<Typography sx={{ ...F, fontSize: "0.78rem", color: "#475569", fontWeight: 600 }}>Manual edit</Typography>}
                        sx={{ m: 0 }}
                      />
                    <Tooltip title={copied ? "Copied!" : "Copy full prompt"}>
                      <Button
                        variant="contained"
                        size="medium"
                        startIcon={copied ? <CheckRoundedIcon /> : <ContentCopyIcon />}
                        onClick={handleCopy}
                        sx={{
                          borderRadius: "999px", px: 2.5, py: 1,
                          textTransform: "none", ...F, fontWeight: 700, fontSize: "0.85rem",
                          background: copied ? "linear-gradient(135deg,#166534,#16a34a)" : "linear-gradient(135deg,#2a9d8f,#23857a)",
                          boxShadow: copied ? "0 6px 18px rgba(22,101,52,0.32)" : "0 6px 18px rgba(42,157,143,0.32)",
                          "&:hover": { background: copied ? "linear-gradient(135deg,#14532d,#166534)" : "linear-gradient(135deg,#23857a,#1c6b62)", transform: "translateY(-1px)", boxShadow: copied ? "0 10px 26px rgba(22,101,52,0.38)" : "0 10px 26px rgba(42,157,143,0.42)" },
                          transition: "all 0.25s ease",
                        }}
                      >
                        {copied ? "Copied!" : "Copy Prompt"}
                      </Button>
                    </Tooltip>
                    </Stack>
                  </Stack>

                  <Box sx={{
                    borderRadius: "16px",
                    border: "1.5px solid rgba(148,163,184,0.24)",
                    background: "rgba(248,250,252,0.94)",
                    backdropFilter: "blur(8px)",
                    overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.85)",
                    flex: 1, minHeight: 120, display: "flex", flexDirection: "column",
                  }}>
                    <Stack direction="row" alignItems="center" flexShrink={0} sx={{ px: 1.5, py: 0.8, borderBottom: "1px solid rgba(148,163,184,0.18)", background: "rgba(255,255,255,0.74)", gap: 1.5 }}>
                      <Stack direction="row" spacing={0.6} flexShrink={0}>
                        {["#cbd5e1", "#94a3b8", "#64748b"].map(c => <Box key={c} sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c, opacity: 0.95 }} />)}
                      </Stack>
                      <Typography sx={{ fontFamily: "monospace", fontSize: "0.68rem", color: "#64748b", flexShrink: 0, fontWeight: 700 }}>
                        prompt-gt.json
                      </Typography>
                      <Box sx={{ flex: 1 }} />
                      <TextField
                        size="small"
                        placeholder="Search JSON..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") goNext() }}
                        sx={{
                          width: 150,
                          "& .MuiOutlinedInput-root": {
                            height: 26, borderRadius: "999px",
                            background: "rgba(241,245,249,0.95)",
                            color: "#1e293b", fontSize: "0.72rem",
                            "& fieldset": { borderColor: "rgba(148,163,184,0.28)" },
                            "&:hover fieldset": { borderColor: "rgba(100,116,139,0.4)" },
                            "&.Mui-focused fieldset": { borderColor: "#64748b" },
                          },
                          "& input": {
                            color: "#1e293b", padding: "4px 12px", fontSize: "0.72rem",
                            "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus": {
                              WebkitBoxShadow: "0 0 0 100px rgba(241,245,249,0.98) inset",
                              WebkitTextFillColor: "#1e293b",
                              transition: "background-color 5000s ease-in-out 0s",
                            },
                          },
                          "& input::placeholder": { color: "rgba(100,116,139,0.62)", opacity: 1 },
                        }}
                      />
                      {searchActive && (
                        <Stack direction="row" spacing={0.4} alignItems="center" flexShrink={0}>
                          <Typography sx={{ fontFamily: "monospace", fontSize: "0.65rem", color: matchCount > 0 ? "#b45309" : "#94a3b8", minWidth: 42, textAlign: "center" }}>
                            {matchCount > 0 ? `${matchIndex + 1}/${matchCount}` : "0 hasil"}
                          </Typography>
                          <IconButton size="small" onClick={goPrev} disabled={matchCount === 0}
                            sx={{ width: 22, height: 22, borderRadius: "6px", color: "#475569", background: "rgba(241,245,249,0.9)", border: "1px solid rgba(148,163,184,0.24)", "&:hover": { background: "rgba(226,232,240,0.9)" }, "&.Mui-disabled": { opacity: 0.3 }, "& svg": { fontSize: "16px !important" } }}>
                            <KeyboardArrowUpRoundedIcon />
                          </IconButton>
                          <IconButton size="small" onClick={goNext} disabled={matchCount === 0}
                            sx={{ width: 22, height: 22, borderRadius: "6px", color: "#475569", background: "rgba(241,245,249,0.9)", border: "1px solid rgba(148,163,184,0.24)", "&:hover": { background: "rgba(226,232,240,0.9)" }, "&.Mui-disabled": { opacity: 0.3 }, "& svg": { fontSize: "16px !important" } }}>
                            <KeyboardArrowDownRoundedIcon />
                          </IconButton>
                        </Stack>
                      )}
                      {searchActive && (
                        <IconButton size="small" onClick={() => setSearchQuery("")}
                          sx={{ width: 22, height: 22, borderRadius: "6px", color: "#64748b", background: "rgba(241,245,249,0.9)", border: "1px solid rgba(148,163,184,0.24)", "&:hover": { background: "rgba(226,232,240,0.9)", color: "#1e293b" }, "& svg": { fontSize: "13px !important" } }}>
                          <CloseRoundedIcon />
                        </IconButton>
                      )}
                    </Stack>
                    {manualPromptMode ? (
                      <Box
                        component="textarea"
                        value={manualPromptText}
                        onChange={e => setManualPromptText(e.target.value)}
                        spellCheck={false}
                        sx={{
                          display: "block",
                          width: "calc(100% - 20px)",
                          m: "10px",
                          p: 1.5,
                          fontSize: "0.68rem", fontFamily: "monospace",
                          color: "#475569",
                          background: "rgba(226,232,240,0.72)",
                          border: "1px solid rgba(100,116,139,0.28)",
                          borderRadius: "14px",
                          outline: "none", resize: "none",
                          flex: 1, minHeight: 0, lineHeight: 1.65,
                          whiteSpace: "pre-wrap", wordBreak: "break-word",
                          boxSizing: "border-box", overflowY: "auto",
                          boxShadow: "inset 0 1px 2px rgba(15,23,42,0.04)",
                          "&:focus": { borderColor: "rgba(100,116,139,0.46)" },
                          "&::selection": { background: "rgba(148,163,184,0.28)" },
                        }}
                      />
                    ) : (
                      <Box component="pre" sx={{
                        m: "10px",
                        p: 1.5,
                        fontSize: "0.68rem", fontFamily: "monospace",
                        color: "#475569",
                        background: "rgba(226,232,240,0.72)",
                        border: "1px solid rgba(100,116,139,0.28)",
                        borderRadius: "14px",
                        overflowX: "auto",
                        flex: 1, minHeight: 0, overflowY: "auto",
                        whiteSpace: "pre-wrap", wordBreak: "break-word",
                        lineHeight: 1.65,
                        boxShadow: "inset 0 1px 2px rgba(15,23,42,0.04)",
                      }}>
                        {highlightedOutput}
                      </Box>
                    )}
                  </Box>

                </Box>

              </Stack>
            </CardContent>
          </Box>

        </Stack>
        </Card>
      </Stack>
    </Box>
  )
}
