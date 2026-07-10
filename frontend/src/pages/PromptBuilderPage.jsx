import { useState, useEffect } from "react"
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
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded"
import HighQualityRoundedIcon from "@mui/icons-material/HighQualityRounded"
import EditRoundedIcon from "@mui/icons-material/EditRounded"
import LayersRoundedIcon from "@mui/icons-material/LayersRounded"

/* ─── Fonts & Animations ─── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
  `}</style>
)

const F = { fontFamily: "'Sora',sans-serif" }

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
    borderRadius: "14px",
    background: "rgba(241,245,249,0.9)",
    backdropFilter: "blur(8px)",
    ...F,
    "& fieldset": { borderColor: "rgba(148,163,184,0.35)" },
    "&:hover fieldset": { borderColor: "rgba(148,163,184,0.6)" },
    "&.Mui-focused fieldset": { borderColor: "#233971", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": { ...F, "&.Mui-focused": { color: "#233971" } },
  "& .MuiFormHelperText-root": { ...F },
}

const sectionLabel = { ...F, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0f172a" }
const sectionSub   = { ...F, fontSize: "0.78rem", color: "#64748b" }

// bounded, visibly-boxed scroll area for growable lists —
// only this inner box scrolls, like a table body, instead of the whole section pushing content down
const listBoxSx = {
  maxHeight: 168,
  overflowY: "auto",
  border: "1px solid rgba(35,57,113,0.14)",
  borderRadius: "12px",
  background: "rgba(241,245,249,0.6)",
  p: 1,
}

const sectionCardSx = {
  borderRadius: "18px",
  border: "1px solid rgba(35,57,113,0.13)",
  background: "rgba(255,255,255,0.7)",
  boxShadow: "0 1px 4px rgba(15,23,42,0.04), 0 8px 20px -10px rgba(35,57,113,0.14)",
  p: 1.5,
  transition: "box-shadow 0.25s ease, border-color 0.25s ease",
  "&:hover": {
    borderColor: "rgba(35,57,113,0.24)",
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

function SectionIcon({ icon: Icon, gradient = "linear-gradient(135deg,#233971,#2e4fa3)", shadow = "rgba(35,57,113,0.38)" }) {
  return (
    <Box sx={{
      width: 26, height: 26, borderRadius: "9px", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: gradient,
      boxShadow: `0 3px 8px -1px ${shadow}`,
      color: "#fff",
      "& svg": { fontSize: "15px" },
    }}>
      <Icon />
    </Box>
  )
}

const SMOOTH_EASING = { enter: "cubic-bezier(0.4,0,0.2,1)", exit: "cubic-bezier(0.4,0,0.2,1)" }

function SmoothCollapse({ children, ...props }) {
  return <Collapse timeout={260} easing={SMOOTH_EASING} {...props}>{children}</Collapse>
}

function SectionHeader({ label, icon, iconGradient, iconShadow, sectionKey, isHidden, onToggle, expanded, onToggleExpand, children }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={isHidden || !expanded ? 0 : 1.5}
      onClick={onToggleExpand} sx={{ cursor: "pointer", transition: "margin-bottom 260ms cubic-bezier(0.4,0,0.2,1)" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        {icon && <SectionIcon icon={icon} gradient={iconGradient} shadow={iconShadow} />}
        <Typography sx={sectionLabel}>{label}</Typography>
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

// Header variant for sections with no hide/remove control (Color Palette, Rendering Style, Key Features)
function PlainSectionHeader({ label, icon, iconGradient, iconShadow, expanded, onToggleExpand, children }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={expanded ? 1.5 : 0}
      onClick={onToggleExpand} sx={{ cursor: "pointer", transition: "margin-bottom 260ms cubic-bezier(0.4,0,0.2,1)" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        {icon && <SectionIcon icon={icon} gradient={iconGradient} shadow={iconShadow} />}
        <Typography sx={sectionLabel}>{label}</Typography>
      </Stack>
      <Stack direction="row" spacing={0.8} alignItems="center">
        {children}
        <ExpandToggle expanded={expanded} onClick={onToggleExpand} />
      </Stack>
    </Stack>
  )
}

const VIEW_ANGLES   = ["Front View", "Side View", "Back View", "3/4 View", "Top View", "Isometric"]
const ASPECT_RATIOS = ["1:1", "4:3", "16:9", "9:16", "3:4", "2:3"]
const DESIGN_TYPES  = ["Marketplace Main Image", "Marketplace Lifestyle Image", "Product Detail Shot", "Infographic Banner", "Social Media Post"]

const ADVANCED_SECTIONS = [
  { key: "rule_number_one_most_important", label: "Rule #1" },
  { key: "layout_instructions_do_not_render_as_text", label: "Layout Instructions" },
  { key: "product_display", label: "Product Display" },
  { key: "headline_styling", label: "Headline Styling" },
  { key: "usp_styling", label: "USP Styling" },
]

const DEFAULT_DATA = {
  rule_number_one_most_important:
    "Use the provided 1 reference image as the visual and style reference. Use aspect ratio 1:1. Output at the highest quality possible, with the longest side at most 1920px. Do NOT change the aspect ratio - keep the original image proportions exactly.",

  design_analysis: {
    design_type: "Marketplace Main Image",
    aspect_ratio: "1:1",
    visual_style: "Industrial Safety Eyewear Product Advertising",
    objective: [
      "Menghentikan scrolling dalam 1-3 detik",
      "Menonjolkan fungsi perlindungan mata secara instan",
      "Menunjukkan kombinasi tampilan fashion dan keamanan kerja",
      "Meningkatkan persepsi produk yang modern, nyaman, dan profesional",
      "Mendorong klik dan konversi marketplace",
    ],
  },

  visible_text_whitelist: {
    instruction: "ONLY the texts listed below may appear as visible text in the image. Nothing else.",
    product_name: "ECO BRAVA FASHION SAFETY GLASSES",
    tagline: "Gaya Dalam Safety",
    usp_labels: ["Anti UV", "Waterproof", "Anti-Dust"],
  },

  product: {
    name: "ECO BRAVA FASHION SAFETY GLASSES",
    category: "Safety Glasses",
    view_angle: "Front 3/4 View",
    preservation:
      "Preserve exact shape, proportion, material, texture, logo, color, and all details. Do not redesign or alter the product.",
  },

  target_market_context:
    "Pekerja proyek, teknisi lapangan, operator mesin, pekerja industri, tim K3, Safety Officer",

  layout_instructions_do_not_render_as_text: {
    note: "Everything in this section describes WHERE to place elements. These are layout directions only - never draw, print, or display any of these words inside the image.",
    structure: "Z Pattern",
    badge_reserved_area:
      "The top-left area shows the GOSAVE Border Header. Keep a safe margin of at least 5 percent from the canvas edges.",
    headline_zone:
      "Place the product name and headline in the top-right area, right-aligned.",
    hero_zone:
      "Place the hero product in the center-left area, sized around 70-80 percent of the canvas.",
    usp_zone:
      "Place the USP feature list vertically on the right side.",
    frame_clearance:
      "Keep all text and icons at least 5 percent away from every edge.",
  },

  background: {
    style: "Industrial Work Environment",
    theme: "Modern Safety Workplace",
    lighting: "Premium Dramatic Product Lighting",
    depth_of_field: "Moderate Depth of Field",
    elements: ["Construction Site", "Workshop Area", "Industrial Factory", "Safety Equipment Area", "Machinery Background", "Work Zone"],
    purpose: "Menunjukkan penggunaan safety glasses pada lingkungan kerja dengan perlindungan maksimal",
  },

  product_display: {
    position: "Center Left",
    size: "70-80% of canvas",
    angle: "Front 3/4 View",
    shadow: "Realistic Soft Ground Shadow",
    lighting: "Commercial Product Photography with controlled lens reflection and rim light",
  },

  headline_styling: {
    placement: "Top Right",
    alignment: "Right",
    product_name_style:
      "Extra bold, clean white sans-serif, large, with a thin soft drop shadow",
    tagline_style:
      "Medium weight, safety-yellow, smaller than the product name",
  },

  usp_styling: {
    placement: "Right Side",
    layout: "Vertical Icon List",
    icon_style:
      "Three uniform circular icons, deep navy blue with white pictograms. These three small circles are the only graphic shapes allowed in the entire image.",
    label_style:
      "Short white text label below each icon, typed directly on the photo with a thin soft drop shadow",
    icons: [
      "UV Protection",
      "Water Drop",
      "Dust Shield",
    ],
  },

  color_palette: {
    note: "Use these as color directions only - never display color codes as text in the image.",
    primary: "#1E3A8A",
    secondary: "#FFD500",
    accent: "#FFFFFF",
    text_dark: "#000000",
    background_dark: "#1A1A1A",
    lens_accent: "#C0C0C0",
  },

  visual_effects: {
    depth: true,
    layering: true,
    realistic_shadow: true,
    realistic_lighting: true,
    high_detail: true,
    premium_finish: true,
    lens_reflection_effect: true,
  },

  visual_priority: [
    "Safety Glasses Product",
    "Product Name",
    "Protection Features",
    "USP Features",
    "Industrial Environment",
    "Branding",
  ],

  design_formula: {
    product_focus: "75%",
    headline: "10%",
    usp: "10%",
    branding: "3%",
    background_support: "2%",
  },

  rendering_style: {
    quality: "Highest Possible",
    photorealistic: true,
    commercial_grade: true,
    mobile_friendly: true,
    realistic_lighting: true,
    realistic_shadows: true,
    high_detail: true,
    scroll_stopping: true,
  },

  final_instructions:
    "Use a 1:1 aspect ratio, longest side at most 1920px. Do NOT change the aspect ratio - keep the original image proportions exactly. Use the provided 1 reference image as visual and style reference. Do not invent new product styling, background concepts, or extra creative elements beyond the supplied prompt data.",
}

export default function PromptBuilderPage() {
  const [data, setData]           = useState(DEFAULT_DATA)
  const [copied, setCopied]       = useState(false)
  const [manualPromptMode, setManualPromptMode] = useState(false)
  const [manualPromptText, setManualPromptText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [matchIndex, setMatchIndex] = useState(0)
  const [newElement, setNewEl]    = useState("")
  const [newUspLabel, setNewUspLabel] = useState("")
  const [newUspIcon, setNewUspIcon]   = useState("")
  const [hidden, setHidden]       = useState(new Set())
  const [expandedSections, setExpandedSections] = useState(new Set())

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

  const setProductName = (val) => {
    setData(prev => {
      const next = structuredClone(prev)
      next.visible_text_whitelist.product_name = val
      next.product.name = val
      return next
    })
  }

  const generateOutput = () => {
    const filtered = Object.fromEntries(
      Object.entries(data).filter(([k]) => !hidden.has(k))
    )
    return JSON.stringify(filtered, null, 2)
  }

  const outputText = manualPromptMode ? manualPromptText : generateOutput()

  const normalizedSearch = searchQuery.trim().toLowerCase()
  const searchActive = normalizedSearch.length > 0

  const getMatchCount = (text, query) => {
    if (!query) return 0
    let count = 0
    let idx = 0
    const lower = text.toLowerCase()
    while ((idx = lower.indexOf(query, idx)) !== -1) { count++; idx++ }
    return count
  }

  const matchCount = searchActive ? getMatchCount(outputText, normalizedSearch) : 0

  useEffect(() => { setMatchIndex(0) }, [normalizedSearch])

  useEffect(() => {
    if (!searchActive || matchCount === 0) return
    const el = document.getElementById(`json-match-${matchIndex}`)
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [matchIndex, normalizedSearch, searchActive, matchCount])

  const goPrev = () => setMatchIndex(i => (i - 1 + matchCount) % matchCount)
  const goNext = () => setMatchIndex(i => (i + 1) % matchCount)

  const highlightText = (text, query, activeIdx) => {
    if (!query) return [<span key="all">{text}</span>]
    const parts = []
    const lower = text.toLowerCase()
    let last = 0
    let idx = 0
    let spanKey = 0
    let matchNum = 0
    while ((idx = lower.indexOf(query, last)) !== -1) {
      if (idx > last) parts.push(<span key={spanKey++}>{text.slice(last, idx)}</span>)
      const isActive = matchNum === activeIdx
      parts.push(
        <mark
          key={spanKey++}
          id={`json-match-${matchNum}`}
          style={{
            background: isActive ? "#f97316" : "#facc15",
            color: "#0f172a",
            borderRadius: "3px",
            padding: "0 2px",
            outline: isActive ? "2px solid #fb923c" : "none",
            outlineOffset: "1px",
          }}
        >
          {text.slice(idx, idx + query.length)}
        </mark>
      )
      last = idx + query.length
      matchNum++
    }
    if (last < text.length) parts.push(<span key={spanKey++}>{text.slice(last)}</span>)
    return parts
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const toggleManualPromptMode = () => {
    setManualPromptMode(prev => {
      const next = !prev
      if (next && !manualPromptText.trim()) {
        setManualPromptText(generateOutput())
      }
      return next
    })
  }

  const addElement = () => {
    if (!newElement.trim()) return
    set("background.elements", [...data.background.elements, newElement.trim()])
    setNewEl("")
  }
  const rmElement = (i) => set("background.elements", data.background.elements.filter((_, j) => j !== i))

  const addUsp = () => {
    if (!newUspLabel.trim()) return
    setData(prev => {
      const next = structuredClone(prev)
      next.visible_text_whitelist.usp_labels.push(newUspLabel.trim())
      next.usp_styling.icons.push(newUspIcon.trim() || `Custom icon for '${newUspLabel.trim()}'`)
      return next
    })
    setNewUspLabel("")
    setNewUspIcon("")
  }
  const rmUsp = (i) => {
    setData(prev => {
      const next = structuredClone(prev)
      next.visible_text_whitelist.usp_labels = next.visible_text_whitelist.usp_labels.filter((_, j) => j !== i)
      next.usp_styling.icons = next.usp_styling.icons.filter((_, j) => j !== i)
      return next
    })
  }
  const editUspLabel = (i, v) => {
    setData(prev => {
      const next = structuredClone(prev)
      next.visible_text_whitelist.usp_labels[i] = v
      return next
    })
  }
  const editUspIcon = (i, v) => {
    setData(prev => {
      const next = structuredClone(prev)
      next.usp_styling.icons[i] = v
      return next
    })
  }

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
                    Prompt Builder Form
                  </Typography>
                  <Typography sx={{ ...F, fontSize: "0.7rem", color: "#94a3b8", mt: "2px" }}>
                    Fill in the form below — JSON prompt is auto-generated
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

                {/* ── Visible Text Whitelist ── */}
                <Box sx={sectionCardSx}>
                  <SectionHeader label="Visible Text" icon={TextFieldsRoundedIcon} sectionKey="visible_text_whitelist" isHidden={isHidden("visible_text_whitelist")} onToggle={toggleHide}
                    expanded={isExpanded("visible_text_whitelist")} onToggleExpand={() => toggleExpanded("visible_text_whitelist")}
                  />
                  <SmoothCollapse in={!isHidden("visible_text_whitelist") && isExpanded("visible_text_whitelist")}>
                    <Stack spacing={1.5}>
                      <TextField
                        fullWidth label="Product Name" size="small"
                        value={data.visible_text_whitelist.product_name}
                        onChange={e => setProductName(e.target.value)}
                        helperText="Auto-synced with product.name — write in capitals"
                        sx={inputSx}
                      />
                      <TextField
                        fullWidth label="Tagline / Headline" size="small"
                        value={data.visible_text_whitelist.tagline}
                        onChange={e => set("visible_text_whitelist.tagline", e.target.value)}
                        sx={inputSx}
                      />
                    </Stack>
                  </SmoothCollapse>
                </Box>

                {/* ── Key Features (USP) ── */}
                <Box sx={sectionCardSx}>
                  <PlainSectionHeader label="Key Features (USP)" icon={WorkspacePremiumRoundedIcon}
                    expanded={isExpanded("usp_panel")} onToggleExpand={() => toggleExpanded("usp_panel")}>
                    {isExpanded("usp_panel") && <Typography sx={{ ...sectionSub, fontSize: "0.75rem" }}>{data.visible_text_whitelist.usp_labels.length} features</Typography>}
                  </PlainSectionHeader>
                  <SmoothCollapse in={isExpanded("usp_panel")}>
                    <Typography sx={{ ...sectionSub, mb: 1.5, fontSize: "0.72rem", fontStyle: "italic" }}>Each item updates the text whitelist and the icon description for USP styling</Typography>
                    <Stack spacing={1.2}>
                      <Stack spacing={1.2} sx={listBoxSx}>
                        {data.visible_text_whitelist.usp_labels.map((label, i) => (
                          <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                            <Box sx={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#233971,#2e4fa3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, mt: "2px", boxShadow: "0 4px 10px rgba(35,57,113,0.28)" }}>
                              <Typography sx={{ ...F, color: "#fff", fontSize: "0.7rem", fontWeight: 800 }}>{i + 1}</Typography>
                            </Box>
                            <Stack sx={{ flex: 1 }} spacing={1}>
                              <Box sx={{ flex: 1, borderRadius: "14px", border: "1.5px solid rgba(35,57,113,0.22)", background: "rgba(241,245,249,0.9)", backdropFilter: "blur(8px)", "&:focus-within": { borderColor: "#233971", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" }, overflow: "hidden" }}>
                                <input
                                  value={label}
                                  onChange={e => editUspLabel(i, e.target.value)}
                                  placeholder="Label text (e.g. Premium Mesh Material)"
                                  style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "9px 14px", fontFamily: "Sora,sans-serif", fontSize: "14px", color: "#1e293b", background: "transparent", border: "none", outline: "none" }}
                                />
                              </Box>
                              <Box sx={{ flex: 1, borderRadius: "14px", border: "1.5px dashed rgba(35,57,113,0.28)", background: "rgba(241,245,249,0.75)", "&:focus-within": { borderColor: "#233971", borderStyle: "solid", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" }, overflow: "hidden" }}>
                                <input
                                  value={data.usp_styling.icons[i] || ""}
                                  onChange={e => editUspIcon(i, e.target.value)}
                                  placeholder="Icon description (e.g. Mesh fabric pictogram for '...')"
                                  style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "9px 14px", fontFamily: "Sora,sans-serif", fontSize: "13px", color: "#475569", background: "transparent", border: "none", outline: "none" }}
                                />
                              </Box>
                            </Stack>
                            <IconButton
                              onClick={() => rmUsp(i)}
                              disabled={data.visible_text_whitelist.usp_labels.length <= 1}
                              size="small"
                              sx={{ width: 34, height: 34, borderRadius: "10px", border: "1.5px solid rgba(127,29,29,0.7)", color: "#7f1d1d", background: "rgba(127,29,29,0.16)", "&:hover": { background: "rgba(127,29,29,0.26)", borderColor: "#7f1d1d" }, "&.Mui-disabled": { color: "rgba(148,163,184,0.4)", borderColor: "rgba(148,163,184,0.2)", background: "transparent" } }}
                            >
                              <CloseRoundedIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        ))}
                      </Stack>

                      {/* Add new USP */}
                      <Stack spacing={1}>
                        <Box sx={{ flex: 1, borderRadius: "14px", border: "1.5px dashed rgba(35,57,113,0.28)", background: "rgba(241,245,249,0.75)", "&:focus-within": { borderColor: "#233971", borderStyle: "solid", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" }, overflow: "hidden" }}>
                          <input
                            value={newUspLabel}
                            onChange={e => setNewUspLabel(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && addUsp()}
                            placeholder="Label text..."
                            style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "9px 14px", fontFamily: "Sora,sans-serif", fontSize: "14px", color: "#1e293b", background: "transparent", border: "none", outline: "none" }}
                          />
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Box sx={{ flex: 1, borderRadius: "14px", border: "1.5px dashed rgba(35,57,113,0.28)", background: "rgba(241,245,249,0.75)", "&:focus-within": { borderColor: "#233971", borderStyle: "solid", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" }, overflow: "hidden" }}>
                            <input
                              value={newUspIcon}
                              onChange={e => setNewUspIcon(e.target.value)}
                              onKeyDown={e => e.key === "Enter" && addUsp()}
                              placeholder="Icon description (optional)..."
                              style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "9px 14px", fontFamily: "Sora,sans-serif", fontSize: "13px", color: "#475569", background: "transparent", border: "none", outline: "none" }}
                            />
                          </Box>
                          <Button variant="contained" onClick={addUsp} sx={{ borderRadius: "14px", minWidth: 42, px: 1.5, background: "linear-gradient(135deg,#2a9d8f,#23857a)", boxShadow: "0 4px 12px rgba(42,157,143,0.32)", "&:hover": { background: "linear-gradient(135deg,#23857a,#1c6b62)", transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                            <AddRoundedIcon />
                          </Button>
                        </Stack>
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
                      <Stack direction="row" spacing={1.5}>
                        <TextField fullWidth label="Product Category" size="small" value={data.product.category} onChange={e => set("product.category", e.target.value)} sx={inputSx} />
                        <TextField select fullWidth label="View Angle" size="small" value={data.product.view_angle} onChange={e => set("product.view_angle", e.target.value)} sx={inputSx}>
                          {VIEW_ANGLES.map(v => <MenuItem key={v} value={v} sx={F}>{v}</MenuItem>)}
                        </TextField>
                      </Stack>
                      <TextField fullWidth multiline rows={2} label="Preservation Instruction" size="small" value={data.product.preservation} onChange={e => set("product.preservation", e.target.value)} sx={inputSx} />
                    </Stack>
                  </SmoothCollapse>
                </Box>

                {/* ── Target Market ── */}
                <Box sx={sectionCardSx}>
                  <SectionHeader label="Target Market" icon={GpsFixedRoundedIcon} sectionKey="target_market_context" isHidden={isHidden("target_market_context")} onToggle={toggleHide}
                    expanded={isExpanded("target_market_context")} onToggleExpand={() => toggleExpanded("target_market_context")}
                  />
                  <SmoothCollapse in={!isHidden("target_market_context") && isExpanded("target_market_context")}>
                    <TextField
                      fullWidth multiline rows={2} size="small"
                      label="Target Market Context"
                      value={data.target_market_context}
                      onChange={e => set("target_market_context", e.target.value)}
                      helperText="Single description of who this product is for"
                      sx={inputSx}
                    />
                  </SmoothCollapse>
                </Box>

                {/* ── Background ── */}
                <Box sx={sectionCardSx}>
                  <SectionHeader label="Background" icon={WallpaperRoundedIcon} iconGradient="linear-gradient(135deg,#166534,#16a34a)" iconShadow="rgba(22,101,52,0.38)" sectionKey="background" isHidden={isHidden("background")} onToggle={toggleHide}
                    expanded={isExpanded("background")} onToggleExpand={() => toggleExpanded("background")}
                  />
                  <SmoothCollapse in={!isHidden("background") && isExpanded("background")}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1.5}>
                        <TextField fullWidth label="Background Style" size="small" value={data.background.style} onChange={e => set("background.style", e.target.value)} sx={inputSx} />
                        <TextField fullWidth label="Theme" size="small" value={data.background.theme} onChange={e => set("background.theme", e.target.value)} sx={inputSx} />
                      </Stack>
                      <TextField fullWidth label="Lighting" size="small" value={data.background.lighting} onChange={e => set("background.lighting", e.target.value)} sx={inputSx} />
                      <TextField fullWidth label="Depth of Field" size="small" value={data.background.depth_of_field} onChange={e => set("background.depth_of_field", e.target.value)} sx={inputSx} />
                      <Box>
                        <Typography sx={{ ...sectionSub, mb: 1 }}>Background Elements</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px", mb: 1.2 }}>
                          {data.background.elements.map((el, i) => (
                            <Chip key={i} label={el} onDelete={() => rmElement(i)} size="small"
                              sx={{ borderRadius: "999px", ...F, fontWeight: 600, fontSize: "0.73rem", background: "rgba(22,101,52,0.08)", color: "#166534", border: "1px solid rgba(22,101,52,0.22)", "& .MuiChip-deleteIcon": { color: "rgba(22,101,52,0.45)", "&:hover": { color: "#166534" } } }} />
                          ))}
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Box sx={{ flex: 1, borderRadius: "14px", border: "1.5px solid rgba(35,57,113,0.22)", background: "rgba(241,245,249,0.9)", backdropFilter: "blur(8px)", "&:focus-within": { borderColor: "#233971", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" }, overflow: "hidden" }}>
                            <input value={newElement} onChange={e => setNewEl(e.target.value)} onKeyDown={e => e.key === "Enter" && addElement()} placeholder="Example: Scaffolding, Heavy Equipment..." style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "9px 14px", fontFamily: "Sora,sans-serif", fontSize: "14px", color: "#1e293b", background: "transparent", border: "none", outline: "none" }} />
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

                </Stack>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Final Instructions (fixed, fills remaining space like Prompt Output) ── */}
                <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} flexShrink={0}>
                    <Typography sx={sectionLabel}>Final Instructions</Typography>
                    <Typography sx={{ ...sectionSub, fontSize: "0.75rem" }}>End of prompt</Typography>
                  </Stack>
                  <Box sx={{ borderRadius: "16px", border: "1.5px solid rgba(35,57,113,0.22)", background: "rgba(241,245,249,0.9)", backdropFilter: "blur(8px)", transition: "border-color 0.2s, box-shadow 0.2s", "&:focus-within": { borderColor: "#233971", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" }, "&:hover": { borderColor: "rgba(35,57,113,0.35)" }, overflow: "hidden", flex: 1, minHeight: 90, display: "flex", flexDirection: "column" }}>
                    <textarea value={data.final_instructions} onChange={e => set("final_instructions", e.target.value)}
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
                    Toggle structural sections, colors, then copy the full prompt
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(35,57,113,0.12)" }} />

                {/* ── Structural Sections Toggle (fixed) ── */}
                <Box sx={{ ...sectionCardSx, boxSizing: "border-box", width: "calc(100% - 4px)" }}>
                  <PlainSectionHeader label="Structural Sections" icon={LayersRoundedIcon}
                    expanded={isExpanded("structural_sections")} onToggleExpand={() => toggleExpanded("structural_sections")}>
                    {isExpanded("structural_sections") && <Typography sx={{ ...sectionSub, fontSize: "0.72rem" }}>click to toggle</Typography>}
                  </PlainSectionHeader>
                  <SmoothCollapse in={isExpanded("structural_sections")}>
                    <Typography sx={{ ...sectionSub, mb: 1.2, fontSize: "0.75rem" }}>Include or exclude these sections from the generated JSON</Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {ADVANCED_SECTIONS.map(({ key, label }) => {
                        const included = !isHidden(key)
                        return (
                          <Chip
                            key={key}
                            label={label}
                            onClick={() => toggleHide(key)}
                            sx={{
                              cursor: "pointer", ...F, fontWeight: 600, fontSize: "0.75rem",
                              borderRadius: "999px",
                              background: included ? "linear-gradient(135deg,#2a9d8f,#23857a)" : "rgba(35,57,113,0.06)",
                              color: included ? "#fff" : "#94a3b8",
                              border: included ? "none" : "1px solid rgba(35,57,113,0.18)",
                              transition: "all 0.2s",
                              "& .MuiChip-label": { px: 1.5 },
                              "&:hover": {
                                background: included ? "linear-gradient(135deg,#23857a,#1c6b62)" : "rgba(35,57,113,0.12)",
                                color: included ? "#fff" : "#233971",
                              },
                            }}
                          />
                        )
                      })}
                    </Box>
                  </SmoothCollapse>
                </Box>

                {/* Scrollable section list */}
                <Stack spacing={1.5} sx={{
                  flex: "0 1 auto", minHeight: 0, maxHeight: 220, overflowY: "auto", overflowX: "hidden", pr: 0.5,
                  "&::-webkit-scrollbar": { width: 6 },
                  "&::-webkit-scrollbar-thumb": { background: "rgba(35,57,113,0.25)", borderRadius: 999 },
                  "&::-webkit-scrollbar-track": { background: "transparent" },
                }}>

                {/* ── Color Palette ── */}
                <Box sx={sectionCardSx}>
                  <PlainSectionHeader label="Color Palette" icon={PaletteRoundedIcon}
                    expanded={isExpanded("color_palette")} onToggleExpand={() => toggleExpanded("color_palette")} />
                  <SmoothCollapse in={isExpanded("color_palette")}>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
                      {[
                        { key: "primary",   label: "Primary Color" },
                        { key: "secondary", label: "Secondary Color" },
                        { key: "accent",    label: "Accent Color" },
                        { key: "text_dark", label: "Dark Text Color" },
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

                {/* ── Rendering Style ── */}
                <Box sx={sectionCardSx}>
                  <PlainSectionHeader label="Rendering Style" icon={HighQualityRoundedIcon}
                    expanded={isExpanded("rendering_style")} onToggleExpand={() => toggleExpanded("rendering_style")} />
                  <SmoothCollapse in={isExpanded("rendering_style")}>
                    <Stack spacing={1.5}>
                      <TextField fullWidth label="Quality" size="small" value={data.rendering_style.quality} onChange={e => set("rendering_style.quality", e.target.value)} sx={inputSx} />
                      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 1, rowGap: 0.3 }}>
                        {[
                          { key: "photorealistic",     label: "Photorealistic" },
                          { key: "commercial_grade",   label: "Commercial Grade" },
                          { key: "mobile_friendly",    label: "Mobile Friendly" },
                          { key: "realistic_lighting", label: "Realistic Lighting" },
                          { key: "realistic_shadows",  label: "Realistic Shadows" },
                          { key: "high_detail",        label: "High Detail" },
                          { key: "scroll_stopping",    label: "Scroll Stopping" },
                        ].map(({ key, label }) => (
                          <FormControlLabel key={key} sx={{ ml: 0, mr: 0, gap: 0.6 }}
                            control={<Switch checked={!!data.rendering_style[key]} onChange={e => set(`rendering_style.${key}`, e.target.checked)} sx={compactSwitchSx} />}
                            label={<Typography noWrap sx={{ ...F, fontSize: "0.76rem", color: "#334155" }}>{label}</Typography>}
                          />
                        ))}
                      </Box>
                    </Stack>
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

                  {copied && (
                    <Alert severity="success" sx={{ borderRadius: "12px", ...F, fontSize: "0.8rem", mb: 1.5, border: "1px solid rgba(35,57,113,0.18)", background: "rgba(232,237,248,0.9)", "& .MuiAlert-icon": { color: "#233971" }, color: "#233971", flexShrink: 0 }}>
                      Prompt copied — paste directly into your AI image generator!
                    </Alert>
                  )}

                  <Box sx={{
                    borderRadius: "16px",
                    border: "1.5px solid rgba(35,57,113,0.2)",
                    background: "rgba(15,23,42,0.96)",
                    backdropFilter: "blur(8px)",
                    overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
                    flex: 1, minHeight: 120, display: "flex", flexDirection: "column",
                  }}>
                    <Stack direction="row" alignItems="center" flexShrink={0} sx={{ px: 1.5, py: 0.8, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.04)", gap: 1.5 }}>
                      <Stack direction="row" spacing={0.6} flexShrink={0}>
                        {["#ef4444", "#f59e0b", "#22c55e"].map(c => <Box key={c} sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c, opacity: 0.8 }} />)}
                      </Stack>
                      <Typography sx={{ fontFamily: "monospace", fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>
                        prompt.json
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
                            background: "rgba(15,23,42,0.85)",
                            color: "#e2e8f0", fontSize: "0.72rem",
                            "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
                            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.24)" },
                            "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.32)" },
                          },
                          "& input": {
                            color: "#e2e8f0", padding: "4px 12px", fontSize: "0.72rem",
                            "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus": {
                              WebkitBoxShadow: "0 0 0 100px rgba(15,23,42,0.98) inset",
                              WebkitTextFillColor: "#e2e8f0",
                              transition: "background-color 5000s ease-in-out 0s",
                            },
                          },
                          "& input::placeholder": { color: "rgba(226,232,240,0.45)", opacity: 1 },
                        }}
                      />
                      {searchActive && (
                        <Stack direction="row" spacing={0.4} alignItems="center" flexShrink={0}>
                          <Typography sx={{ fontFamily: "monospace", fontSize: "0.65rem", color: matchCount > 0 ? "#facc15" : "rgba(226,232,240,0.45)", minWidth: 42, textAlign: "center" }}>
                            {matchCount > 0 ? `${matchIndex + 1}/${matchCount}` : "0 hasil"}
                          </Typography>
                          <IconButton size="small" onClick={goPrev} disabled={matchCount === 0}
                            sx={{ width: 22, height: 22, borderRadius: "6px", color: "#e2e8f0", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", "&:hover": { background: "rgba(255,255,255,0.12)" }, "&.Mui-disabled": { opacity: 0.3 }, "& svg": { fontSize: "16px !important" } }}>
                            <KeyboardArrowUpRoundedIcon />
                          </IconButton>
                          <IconButton size="small" onClick={goNext} disabled={matchCount === 0}
                            sx={{ width: 22, height: 22, borderRadius: "6px", color: "#e2e8f0", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", "&:hover": { background: "rgba(255,255,255,0.12)" }, "&.Mui-disabled": { opacity: 0.3 }, "& svg": { fontSize: "16px !important" } }}>
                            <KeyboardArrowDownRoundedIcon />
                          </IconButton>
                        </Stack>
                      )}
                      {searchActive && (
                        <IconButton size="small" onClick={() => setSearchQuery("")}
                          sx={{ width: 22, height: 22, borderRadius: "6px", color: "rgba(226,232,240,0.5)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", "&:hover": { background: "rgba(255,255,255,0.1)", color: "#e2e8f0" }, "& svg": { fontSize: "13px !important" } }}>
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
                          display: "block", width: "100%", m: 0, p: 2,
                          fontSize: "0.68rem", fontFamily: "monospace",
                          color: "#e2e8f0", background: "transparent",
                          border: "none", outline: "none", resize: "none",
                          flex: 1, minHeight: 0, lineHeight: 1.65,
                          whiteSpace: "pre-wrap", wordBreak: "break-word",
                          boxSizing: "border-box", overflowY: "auto",
                          "&::selection": { background: "rgba(148,163,184,0.3)" },
                        }}
                      />
                    ) : (
                      <Box component="pre" sx={{
                        m: 0, p: 2,
                        fontSize: "0.68rem", fontFamily: "monospace",
                        color: "#e2e8f0", overflowX: "auto",
                        flex: 1, minHeight: 0, overflowY: "auto",
                        whiteSpace: "pre-wrap", wordBreak: "break-word",
                        lineHeight: 1.65,
                      }}>
                        {searchActive ? highlightText(outputText, normalizedSearch, matchIndex) : outputText}
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
