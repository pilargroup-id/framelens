import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  TextField,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  MenuItem,
  Modal,
  Fade,
  Snackbar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DownloadIcon from "@mui/icons-material/Download";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PaletteIcon from "@mui/icons-material/Palette";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import ImageIcon from "@mui/icons-material/Image";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import TuneIcon from "@mui/icons-material/Tune";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import BoltIcon from "@mui/icons-material/Bolt";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PhotoSizeSelectLargeIcon from "@mui/icons-material/PhotoSizeSelectLarge";
import HdIcon from "@mui/icons-material/Hd";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PhotoLibraryRoundedIcon from "@mui/icons-material/PhotoLibraryRounded";
import DynamicFeedRoundedIcon from "@mui/icons-material/DynamicFeedRounded";
import AspectRatioRoundedIcon from "@mui/icons-material/AspectRatioRounded";
import HighQualityRoundedIcon from "@mui/icons-material/HighQualityRounded";
import api from "../api/client";

/* --- Google Fonts --- */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
    @keyframes fbf { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
    @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes orbDrift0 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(22px,-18px) scale(1.04)} }
    @keyframes orbDrift1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,22px) scale(1.03)} }
    @keyframes orbDrift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(16px,18px) scale(1.05)} }
    @keyframes gridPulse { 0%,100%{opacity:0.45} 50%{opacity:0.7} }
    @keyframes fadeR { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
    @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  `}</style>
);

/* ----------------------------------------------
   CARD BACKGROUND — gradient soft blue #233971
---------------------------------------------- */
function CardBg({ variant = "left" }) {
  const isLeft = variant === "left";
  return (
    <Box aria-hidden sx={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", borderRadius: "inherit" }}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: isLeft
            ? "linear-gradient(145deg, #e8edf8 0%, #f0f4fb 30%, #e6edf9 60%, #eaf0fb 100%)"
            : "linear-gradient(145deg, #eaf0fb 0%, #e6edf9 30%, #f0f4fb 60%, #e8edf8 100%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(35,57,113,0.18) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          animation: "gridPulse 6s ease-in-out infinite",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: isLeft ? "-20%" : "60%",
          left: isLeft ? "-10%" : "55%",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: isLeft
            ? "radial-gradient(circle, rgba(35,57,113,0.13) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(35,57,113,0.12) 0%, transparent 70%)",
          animation: "orbDrift0 14s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: isLeft ? "50%" : "-15%",
          right: isLeft ? "-8%" : "-10%",
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: isLeft
            ? "radial-gradient(circle, rgba(55,80,145,0.10) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(35,57,113,0.11) 0%, transparent 70%)",
          animation: "orbDrift1 18s ease-in-out infinite 2s",
        }}
      />
    </Box>
  );
}

const PRESETS = [
  {
    key: "my-prompt",
    label: "My Prompt",
    icon: <CenterFocusStrongIcon />,
    group: "position",
    prompt:
      "Design a professional marketplace banner for an e-commerce product. The main product is (Product), placed on the left with a large, clean object, realistic lighting, and premium commercial style. Create a background relevant to the product, use a 1:1 image ratio for marketplace, no text whatsoever.",
  },
];

const GROUP_META = {
  color: { label: "Warna", color: "#233971", bg: "rgba(35,57,113,0.08)", border: "rgba(35,57,113,0.22)" },
  angle: { label: "Sudut", color: "#2a4a9e", bg: "rgba(42,74,158,0.08)", border: "rgba(42,74,158,0.22)" },
  position: { label: "Posisi", color: "#1a5276", bg: "rgba(26,82,118,0.08)", border: "rgba(26,82,118,0.22)" },
  bg: { label: "Background", color: "#1a3a6e", bg: "rgba(26,58,110,0.08)", border: "rgba(26,58,110,0.22)" },
  enhance: { label: "Enhance", color: "#2e5da6", bg: "rgba(46,93,166,0.08)", border: "rgba(46,93,166,0.22)" },
  safe: { label: "Safe", color: "#233971", bg: "rgba(35,57,113,0.08)", border: "rgba(35,57,113,0.22)" },
};

const ASPECT_RATIO_OPTIONS = [
  { value: "original", label: "Original" },
  { value: "1:1", label: "1:1" },
  { value: "9:16", label: "9:16" },
  { value: "16:9", label: "16:9" },
];

const RESOLUTION_OPTIONS = [
  { value: "original",  label: "Original" },
  { value: "hd",       label: "HD  (~720p)" },
  { value: "full-hd",  label: "Full HD  (~1080p)" },
  { value: "2k",       label: "2K  (~1440p)" },
  { value: "4k",       label: "4K  (~2160p)" },
];

// Maps resolution key → max long-edge pixels (preserves aspect ratio)
const RESOLUTION_MAX_PX = {
  "hd":      1280,
  "full-hd": 1920,
  "2k":      2560,
  "4k":      3840,
};

const BATCH_OPTIONS = [
  { value: 1, label: "1 Image" },
  { value: 2, label: "2 Images" },
  { value: 3, label: "3 Images" },
  { value: 4, label: "4 Images" },
];

function getAspectRatioValue(v) {
  const map = {
    "1:1": "1 / 1",
    "4:5": "4 / 5",
    "3:4": "3 / 4",
    "9:16": "9 / 16",
    "16:9": "16 / 9",
    "3:2": "3 / 2",
  };
  return map[v] || null;
}

/* --- Lightbox modal --- */
function Lightbox({ open, src, onClose, onDownload }) {
  if (!src) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2, zIndex: 9999 }}
      BackdropProps={{ sx: { background: "rgba(2,6,23,0.88)", backdropFilter: "blur(12px)" } }}
    >
      <Fade in={open}>
        <Box sx={{ position: "relative", maxWidth: "92vw", maxHeight: "92vh", outline: "none" }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: -16,
              right: -16,
              zIndex: 1,
              width: 36,
              height: 36,
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              "&:hover": { background: "rgba(255,255,255,0.22)" },
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Box
            component="img"
            src={src}
            alt="Preview"
            sx={{
              display: "block",
              maxWidth: "88vw",
              maxHeight: "84vh",
              objectFit: "contain",
              borderRadius: "20px",
              boxShadow: "0 32px 80px rgba(0,0,0,0.55)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
          {onDownload && (
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                borderRadius: "0 0 20px 20px",
                background: "linear-gradient(to top,rgba(2,6,23,0.72),transparent)",
                p: "20px 16px 14px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                size="small"
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={onDownload}
                sx={{
                  borderRadius: "999px",
                  px: 2.5,
                  py: 0.8,
                  fontFamily: "'Sora',sans-serif",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  textTransform: "none",
                  background: "linear-gradient(135deg,#233971,#2e4fa3)",
                  boxShadow: "0 6px 18px rgba(35,57,113,0.4)",
                  "&:hover": { background: "linear-gradient(135deg,#1a2d5a,#233971)", transform: "translateY(-1px)" },
                  transition: "all 0.2s",
                }}
              >
                Download
              </Button>
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}

/* --- Preview image wrapper --- */
function PreviewBox({ src, alt, aspectRatio, minHeight = 240, onPreview, square = false, onPrev, onNext, counterLabel }) {
  const [hover, setHover] = useState(false);
  const ar = getAspectRatioValue(aspectRatio);
  return (
    <Paper
      variant="outlined"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onWheel={(e) => e.preventDefault()}
      sx={{
        ...(square ? { width: "100%", aspectRatio: "1 / 1" } : { minHeight, maxHeight: 220 }),
        borderRadius: "18px",
        overflow: "hidden",
        background: src
          ? "linear-gradient(135deg,rgba(232,237,248,0.6),rgba(240,244,251,0.6))"
          : "rgba(226,232,240,0.52)",
        border: src ? "1px solid rgba(148,163,184,0.35)" : "1.5px dashed rgba(100,116,139,0.32)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 1.5,
        position: "relative",
        cursor: src ? "zoom-in" : "default",
        transition: "all 0.3s ease",
        ...(!src && { boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)" }),
      }}
    >
      {src ? (
        <>
          <Box
            sx={
              ar
                ? {
                    height: "100%",
                    maxWidth: 420,
                    aspectRatio: ar,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    margin: "0 auto",
                  }
                : {
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
            }
          >
            <Box
              component="img"
              src={src}
              alt={alt}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "12px",
                boxShadow: "0 8px 22px rgba(0,0,0,0.07)",
                animation: "fadeR 0.5s ease",
                "@keyframes fadeR": {
                  from: { opacity: 0, transform: "scale(0.97)" },
                  to: { opacity: 1, transform: "scale(1)" },
                },
                transition: "transform 0.3s ease",
                ...(hover && { transform: "scale(1.015)" }),
              }}
            />
          </Box>
          <Box
            onClick={onPreview}
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "18px",
              background: hover ? "rgba(15,23,42,0.28)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s ease",
              opacity: hover ? 1 : 0,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "16px",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1.5px solid rgba(255,255,255,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                transform: hover ? "scale(1)" : "scale(0.8)",
                transition: "transform 0.25s ease",
              }}
            >
              <ZoomInIcon sx={{ color: "#fff", fontSize: 24 }} />
            </Box>
          </Box>
          {onPrev && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              sx={{
                position: "absolute",
                left: 6,
                top: "50%",
                transform: "translateY(-50%)",
                width: 34,
                height: 34,
                zIndex: 2,
                background: "rgba(15,23,42,0.45)",
                backdropFilter: "blur(6px)",
                color: "#fff",
                "&:hover": { background: "rgba(15,23,42,0.65)" },
                "& svg": { fontSize: 20 },
              }}
            >
              <ArrowBackRoundedIcon />
            </IconButton>
          )}
          {onNext && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              sx={{
                position: "absolute",
                right: 6,
                top: "50%",
                transform: "translateY(-50%)",
                width: 34,
                height: 34,
                zIndex: 2,
                background: "rgba(15,23,42,0.45)",
                backdropFilter: "blur(6px)",
                color: "#fff",
                "&:hover": { background: "rgba(15,23,42,0.65)" },
                "& svg": { fontSize: 20 },
              }}
            >
              <ArrowBackRoundedIcon sx={{ transform: "rotate(180deg)" }} />
            </IconButton>
          )}
          {counterLabel && (
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 2,
                px: 1,
                py: "1px",
                borderRadius: "999px",
                background: "rgba(15,23,42,0.55)",
                backdropFilter: "blur(6px)",
              }}
            >
              <Typography sx={{ fontFamily: "'Sora',sans-serif", fontSize: "0.62rem", fontWeight: 700, color: "#fff" }}>
                {counterLabel}
              </Typography>
            </Box>
          )}
        </>
      ) : (
        <Stack spacing={1} alignItems="center">
          <Box sx={{ width: 50, height: 50, borderRadius: "14px", background: "rgba(100,116,139,0.14)", color: "#64748b", border: "1px solid rgba(100,116,139,0.2)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)" }}>
            <AutoAwesomeIcon sx={{ fontSize: 24, color: "currentColor" }} />
          </Box>
          <Typography sx={{ fontFamily: "'Sora',sans-serif", fontSize: "0.82rem", color: "#64748b", fontWeight: 700 }}>
            AI result will appear here
          </Typography>
        </Stack>
      )}
    </Paper>
  );
}

/* --- Batch result card --- */
function BatchCard({ item, index, aspectRatio, onPreview, onDownload, F }) {
  const [hover, setHover] = useState(false);
  const ar = getAspectRatioValue(aspectRatio);
  return (
    <Paper
      variant="outlined"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        p: 1,
        width: { xs: "100%", sm: "calc(50% - 6px)" },
        borderRadius: "16px",
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(148,163,184,0.3)",
        transition: "box-shadow 0.2s, transform 0.2s",
        ...(hover && { boxShadow: "0 8px 24px rgba(35,57,113,0.14)", transform: "translateY(-2px)" }),
      }}
    >
      <Stack spacing={1}>
        <Box
          sx={{
            borderRadius: "12px",
            overflow: "hidden",
            position: "relative",
            background: "linear-gradient(135deg,rgba(232,237,248,0.9),rgba(234,240,251,0.9))",
            aspectRatio: ar || undefined,
            minHeight: ar ? "auto" : 140,
            cursor: "zoom-in",
          }}
          onClick={onPreview}
          onWheel={(e) => e.preventDefault()}
        >
          <Box
            component="img"
            src={item.imageUrl}
            alt={item.fileName}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.3s ease",
              ...(hover && { transform: "scale(1.04)" }),
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: hover ? "rgba(15,23,42,0.22)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s",
              opacity: hover ? 1 : 0,
            }}
          >
            <ZoomInMapIcon sx={{ color: "#fff", fontSize: 22 }} />
          </Box>
        </Box>
        <Typography
          sx={{
            ...F,
            fontWeight: 700,
            fontSize: "0.74rem",
            color: "#334155",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {index + 1}. {item.fileName}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={onDownload}
          sx={{
            borderRadius: "999px",
            textTransform: "none",
            ...F,
            fontWeight: 700,
            borderColor: "rgba(35,57,113,0.25)",
            color: "#233971",
            "&:hover": { borderColor: "rgba(35,57,113,0.45)", background: "rgba(35,57,113,0.06)" },
          }}
        >
          Download
        </Button>
      </Stack>
    </Paper>
  );
}

/* ----------------------------------------------
   NEW -- Reference Image Upload Section
---------------------------------------------- */
function ReferenceImageSection({ refPreviews, onAdd, onRemove, onPreview, dragActiveRef, onDragOver, onDragLeave, onDrop, inputRef, F }) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.6}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0f172a" }}>
            Reference Images
          </Typography>
          <Chip
            size="small"
            label="Optional"
            sx={{
              ...F,
              fontWeight: 800,
              fontSize: "0.64rem",
              borderRadius: "999px",
              height: 18,
              background: "rgba(217,119,6,0.12)",
              color: "#b45309",
              border: "1.5px solid rgba(217,119,6,0.35)",
            }}
          />
        </Stack>
        <Typography sx={{ ...F, fontSize: "0.7rem", color: "#94a3b8" }}>
          Max 8 references
        </Typography>
      </Stack>

      <Paper
        variant="outlined"
        component="label"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        sx={{
          p: 1.2,
          display: "block",
          cursor: "pointer",
          borderRadius: "14px",
          borderStyle: "solid",
          borderWidth: 1.5,
          borderColor: dragActiveRef ? "#2a4a9e" : "rgba(148,163,184,0.35)",
          background: dragActiveRef ? "rgba(42,74,158,0.06)" : "rgba(241,245,249,0.9)",
          backdropFilter: "blur(8px)",
          transition: "all 0.25s ease",
          "&:hover": { borderColor: "rgba(42,74,158,0.5)" },
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Box sx={{ width: 30, height: 30, flexShrink: 0, borderRadius: "10px", background: "rgba(100,116,139,0.12)", color: "#64748b", border: "1px solid rgba(100,116,139,0.18)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s ease", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)" }}>
            <AddPhotoAlternateIcon sx={{ fontSize: 15, color: "currentColor", transition: "color 0.25s" }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography noWrap sx={{ ...F, fontWeight: 700, fontSize: "0.75rem", color: "#1e293b" }}>
              {refPreviews.length ? `${refPreviews.length} reference image${refPreviews.length > 1 ? "s" : ""} selected` : "Upload reference images"}
            </Typography>
            <Typography noWrap sx={{ ...F, fontSize: "0.64rem", color: "#94a3b8" }}>
              {refPreviews.length ? "Preview in Preview Result panel · click to add more" : "Click or drag & drop · up to 8"}
            </Typography>
          </Box>
          <input
            ref={inputRef}
            hidden
            multiple
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={onAdd}
          />
        </Stack>
      </Paper>
    </Box>
  );
}

export default function ImageEditorPage() {
  const fileInputRef = useRef(null);
  // -- NEW: ref image input
  const refFileInputRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [fromGallery, setFromGallery] = useState(Boolean(location.state?.fromGalleryUrl));
  const fromGalleryInitName = location.state?.fromGalleryName || "";

  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [batchResults, setBatchResults] = useState([]);
  const [resultMeta, setResultMeta] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [beforeHover, setBeforeHover] = useState(false);
  const [batchViewIndex, setBatchViewIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState("original");
  const [resolution, setResolution] = useState("original");
  const [batchCount, setBatchCount] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState("");
  const [lightboxMeta, setLightboxMeta] = useState(null);
  const [lightboxDownloadable, setLightboxDownloadable] = useState(true);

  // -- reference images state
  const [refFiles, setRefFiles] = useState([]);
  const [dragActiveRef, setDragActiveRef] = useState(false);

  const openLightbox = (payload, downloadable = true) => {
    if (typeof payload === "string") {
      setLightboxSrc(payload);
      setLightboxMeta(null);
    } else {
      setLightboxSrc(payload?.imageUrl || "");
      setLightboxMeta(payload || null);
    }
    setLightboxDownloadable(downloadable);
    setLightboxOpen(true);
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxMeta(null);
  };

  const previewUrls = useMemo(() => files.map((f) => ({ file: f, url: URL.createObjectURL(f) })), [files]);

  // -- NEW: ref preview urls
  const refPreviewUrls = useMemo(() => refFiles.map((f) => ({ file: f, url: URL.createObjectURL(f) })), [refFiles]);

  useEffect(() => {
    return () => previewUrls.forEach((i) => URL.revokeObjectURL(i.url));
  }, [previewUrls]);

  // -- NEW: cleanup ref URLs
  useEffect(() => {
    return () => refPreviewUrls.forEach((i) => URL.revokeObjectURL(i.url));
  }, [refPreviewUrls]);

  // Auto-load image + prompt when navigated from Gallery
  useEffect(() => {
    const { fromGalleryUrl, fromGalleryName, fromGalleryPrompt } = location.state || {};
    if (!fromGalleryUrl) return;
    // Clear the navigation state so refresh doesn't re-trigger
    navigate(location.pathname, { replace: true, state: {} });
    if (fromGalleryPrompt) setPrompt(fromGalleryPrompt);
    fetch(fromGalleryUrl)
      .then((r) => r.blob())
      .then((blob) => {
        const name = fromGalleryName || "gallery-image.png";
        const ext  = name.split(".").pop() || "png";
        const mime = blob.type || `image/${ext}`;
        const file = new File([blob], name, { type: mime });
        setFiles([file]);
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const primaryPreviewUrl = previewUrls[0]?.url || "";
  const isSingleSourceMode = files.length <= 1;
  const activeBatchItem = batchResults[Math.min(batchViewIndex, Math.max(batchResults.length - 1, 0))] || null;
  const activePresetData = useMemo(() => PRESETS.find((i) => i.key === activePreset) || null, [activePreset]);

  const resultPromptTags = useMemo(() => {
    if (!activePresetData) return [];
    const relevantGroups = ["color", "angle"];
    if (!relevantGroups.includes(activePresetData.group)) return [];
    const meta = GROUP_META[activePresetData.group];
    return [{ label: activePresetData.label, color: meta.color, bg: meta.bg, border: meta.border }];
  }, [activePresetData]);

  const buildFinalPrompt = () => {
    const r = aspectRatio !== "original" ? ` Use aspect ratio ${aspectRatio}.` : "";
    const maxPx = RESOLUTION_MAX_PX[resolution];
    const res = maxPx
      ? ` Output at the highest quality possible, with the longest side at most ${maxPx}px. Do NOT change the aspect ratio — keep the original image proportions exactly.`
      : "";
    const ref = refFiles.length > 0
      ? ` Use the provided ${refFiles.length} reference image${refFiles.length > 1 ? "s" : ""} as visual/style reference.`
      : "";
    return `${prompt.trim()}${ref}${r}${res}`.trim();
  };

  const getAppOrigin = () => {
    if (typeof window !== "undefined" && window.location?.origin) {
      return window.location.origin;
    }
    return "";
  };

  const normalizeUrl = (url) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;

    const origin = getAppOrigin();

    if (url.startsWith("/")) {
      return `${origin}${url}`;
    }

    return `${origin}/${url}`;
  };

  const extractImageResults = (data) => {
    if (!data) return [];

    if (Array.isArray(data?.images)) {
      return data
        .images
        .map((item, index) => {
          if (typeof item === "string") {
            return {
              id: `result-${index}-${Date.now()}`,
              imageUrl: normalizeUrl(item),
              downloadUrl: normalizeUrl(item),
              fileName: `generated-${index + 1}.png`,
              width: null,
              height: null,
            };
          }

          const rawUrl = item?.api_image_url || item?.image_url || item?.url || (item?.filename ? `/api/image/${item.filename}` : "");
          if (!rawUrl) return null;

          return {
            id: item?.filename || `result-${index}-${Date.now()}`,
            imageUrl: normalizeUrl(item?.image_url || item?.api_image_url || rawUrl),
            downloadUrl: normalizeUrl(rawUrl),
            fileName: item?.filename || `generated-${index + 1}.png`,
            width: item?.width ?? null,
            height: item?.height ?? null,
            requestedResolution: item?.requested_resolution || "original",
          };
        })
        .filter(Boolean);
    }

    const rawUrl = data?.api_image_url || data?.image_url || data?.url || (data?.filename ? `/api/image/${data.filename}` : "");
    if (!rawUrl) return [];

    return [{
      id: data?.filename || `result-${Date.now()}`,
      imageUrl: normalizeUrl(data?.image_url || data?.api_image_url || rawUrl),
      downloadUrl: normalizeUrl(rawUrl),
      fileName: data?.filename || `generated-${Date.now()}.png`,
      width: data?.width ?? null,
      height: data?.height ?? null,
      requestedResolution: data?.requested_resolution || "original",
    }];
  };

  const prepareFiles = (incoming) => {
    const valid = Array.from(incoming || []).filter((f) =>
      ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(f.type)
    );

    if (!valid.length) {
      setError("File must be PNG, JPG, JPEG, or WEBP.");
      return;
    }

    setFiles([valid[0]]);
    setResultUrl("");
    setBatchResults([]);
    setResultMeta(null);
    setError("");
    setSuccess("");
    setBatchCount((prev) => prev || 1);
  };

  // -- NEW: prepare reference files
  const prepareRefFiles = (incoming) => {
    const valid = Array.from(incoming || []).filter((f) =>
      ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(f.type)
    );

    if (!valid.length) {
      setError("Reference file must be PNG, JPG, JPEG, or WEBP.");
      return;
    }

    const combined = [...refFiles, ...valid].slice(0, 8);
    setRefFiles(combined);
    setError("");
  };

  // -- NEW: remove single ref file by index
  const removeRefFile = (idx) => {
    setRefFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e) => prepareFiles(e.target.files);

  // -- NEW: handle ref file input change
  const handleRefFileChange = (e) => {
    prepareRefFiles(e.target.files);
    // reset input so same file can be re-added if needed
    if (refFileInputRef.current) refFileInputRef.current.value = "";
  };

  const handlePresetClick = (key, p) => {
    setActivePreset(key);
    setPrompt(p);
  };

  const handleClearAll = () => {
    setFiles([]);
    setPrompt("");
    setLoading(false);
    setResultUrl("");
    setBatchResults([]);
    setResultMeta(null);
    setError("");
    setSuccess("");
    setCopied(false);
    setActivePreset("");
    setDragActive(false);
    setAspectRatio("original");
    setResolution("original");
    setBatchCount(1);
    setRefFiles([]);
    setDragActiveRef(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (refFileInputRef.current) refFileInputRef.current.value = "";
  };

  const createResultItem = ({ imageUrl, downloadUrl, fileName, promptText, variantIndex, width = null, height = null, requestedResolution = "original" }) => ({
    id: `${Date.now()}-${fileName}-${variantIndex}-${Math.random()}`,
    imageUrl,
    downloadUrl: downloadUrl || imageUrl,
    fileName,
    prompt: promptText,
    variantIndex,
    width,
    height,
    requestedResolution,
  });

  const saveToGallery = ({ imageUrl, promptText, originalFile }) => {
    try {
      const old = JSON.parse(localStorage.getItem(" _images_gallery") || "[]");
      const item = {
        id: Date.now() + Math.floor(Math.random() * 10000),
        imageUrl,
        prompt: promptText || "",
        fileName: originalFile?.name || `generated-${Date.now()}.png`,
        createdAt: new Date().toLocaleString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      localStorage.setItem("generated_images_gallery", JSON.stringify([item, ...old]));
    } catch (e) {
      console.error("Failed to save to gallery:", e);
    }
  };

  // -- UPDATED: requestSingleEdit now appends ref files
  const requestSingleEdit = async ({ file, finalPrompt, requestedBatch }) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("prompt", finalPrompt);
    fd.append("batch_size", String(requestedBatch));
    fd.append("aspect_ratio", aspectRatio);
    // Send max long-edge px to backend (or "original" if not set)
    const maxPx = RESOLUTION_MAX_PX[resolution];
    fd.append("resolution", maxPx ? String(maxPx) : "original");

    // -- NEW: append each reference image
    refFiles.forEach((refFile, idx) => {
      fd.append(`reference_image_${idx}`, refFile);
    });
    // -- NEW: send count so backend knows how many
    if (refFiles.length > 0) {
      fd.append("reference_image_count", String(refFiles.length));
    }

    const res = await api.post("/image/edit", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return extractImageResults(res?.data);
  };

  const handleSubmit = async () => {
    if (!files.length) {
      setError("Please upload an image first.");
      return;
    }

    if (!prompt.trim()) {
      setError("Prompt is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setResultUrl("");
      setBatchResults([]);
      setResultMeta(null);

      const fp = buildFinalPrompt();
      const results = [];

      if (files.length === 1) {
        const src = files[0];
        let generatedItems = await requestSingleEdit({
          file: src,
          finalPrompt: fp,
          requestedBatch: batchCount,
        });

        if (!generatedItems.length) throw new Error("No image_url found in response.");

        if (generatedItems.length === 1 && batchCount > 1) {
          const fallbackItems = [generatedItems[0]];
          for (let i = 1; i < batchCount; i++) {
            const retry = await requestSingleEdit({
              file: src,
              finalPrompt: fp,
              requestedBatch: 1,
            });
            if (retry[0]) fallbackItems.push(retry[0]);
          }
          generatedItems = fallbackItems;
        }

        generatedItems.slice(0, batchCount).forEach((item, idx) => {
          results.push(
            createResultItem({
              imageUrl: item.imageUrl,
              downloadUrl: item.downloadUrl,
              fileName:
                item.fileName || (batchCount > 1
                  ? `${src.name.replace(/(\.[^.]+)$/u, "") || src.name}-varian-${idx + 1}.png`
                  : src.name),
              promptText: fp,
              variantIndex: idx + 1,
              width: item.width,
              height: item.height,
              requestedResolution: item.requestedResolution,
            })
          );
          saveToGallery({ imageUrl: item.imageUrl, promptText: fp, originalFile: src });
        });
      } else {
        for (const cf of files) {
          const generatedItems = await requestSingleEdit({
            file: cf,
            finalPrompt: fp,
            requestedBatch: 1,
          });

          if (!generatedItems.length) throw new Error(`No image_url found for file ${cf.name}.`);

          results.push(
            createResultItem({
              imageUrl: generatedItems[0].imageUrl,
              downloadUrl: generatedItems[0].downloadUrl,
              fileName: generatedItems[0].fileName || cf.name,
              promptText: fp,
              variantIndex: 1,
              width: generatedItems[0].width,
              height: generatedItems[0].height,
              requestedResolution: generatedItems[0].requestedResolution,
            })
          );
          saveToGallery({ imageUrl: generatedItems[0].imageUrl, promptText: fp, originalFile: cf });
        }
      }

      setBatchResults(results);
      setBatchViewIndex(0);
      setResultUrl(results[0]?.imageUrl || "");
      setResultMeta(results[0] || null);
      setSuccess(
        files.length === 1 && batchCount > 1
          ? `Successfully generated ${results.length} images.`
          : results.length > 1
          ? `Batch of ${results.length} images processed successfully.`
          : "Image processed successfully."
      );
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSingle = async (target, fallbackFilename = `edited-${Date.now()}.png`) => {
    const url = typeof target === "string" ? target : target?.downloadUrl || target?.imageUrl;
    const filename = typeof target === "string" ? fallbackFilename : target?.fileName || fallbackFilename;
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const a = Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(blob),
        download: filename,
      });
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      setError("Failed to download result image.");
    }
  };

  const handleDownloadAll = async () => {
    for (let i = 0; i < batchResults.length; i++) {
      const item = batchResults[i];
      await handleDownloadSingle(item, `edited-${i + 1}-${item.fileName || Date.now()}.png`);
    }
  };

  const handleCopyPrompt = async () => {
    if (!prompt.trim()) return;
    try {
      await navigator.clipboard.writeText(buildFinalPrompt());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Failed to copy prompt.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    prepareFiles(e.dataTransfer.files);
  };

  // -- NEW: ref drag handlers
  const handleRefDragOver = (e) => { e.preventDefault(); setDragActiveRef(true); };
  const handleRefDragLeave = (e) => { e.preventDefault(); setDragActiveRef(false); };
  const handleRefDrop = (e) => {
    e.preventDefault();
    setDragActiveRef(false);
    prepareRefFiles(e.dataTransfer.files);
  };

  const F = { fontFamily: "'Sora',sans-serif" };

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
  };

  return (
    <Box sx={{ position: "relative", ...F, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <FontStyle />

        <Lightbox
          open={lightboxOpen}
          src={lightboxSrc}
          onClose={closeLightbox}
          onDownload={
            lightboxDownloadable
              ? () => handleDownloadSingle(lightboxMeta || resultMeta || lightboxSrc, `preview-${Date.now()}.png`)
              : null
          }
        />

      <Stack spacing={2} sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>

        {/* -- Back to Gallery banner (shown when user came from Gallery) -- */}
        {fromGallery && (
          <Box
            sx={{
              flexShrink: 0,
              display:"flex", alignItems:{ xs:"flex-start", sm:"center" }, flexDirection:{ xs:"column", sm:"row" }, gap:1.5,
              px:2.5, py:1.6,
              borderRadius:"16px",
              background:"#fff",
              border:"1px solid rgba(35,57,113,0.18)",
              boxShadow:"0 2px 8px rgba(0,0,0,0.05), 0 8px 24px -4px rgba(35,57,113,0.10)",
              animation:"slideUp 0.3s ease",
            }}
          >
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ flex:1, minWidth:0 }}>
              <Box sx={{ width:36, height:36, borderRadius:"11px", flexShrink:0, background:"rgba(35,57,113,0.08)", display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid rgba(35,57,113,0.15)" }}>
                <PhotoLibraryRoundedIcon sx={{ fontSize:18, color:"#233971" }}/>
              </Box>
              <Box sx={{ minWidth:0 }}>
                <Typography sx={{ ...F, fontSize:"0.83rem", fontWeight:700, color:"#0f172a", lineHeight:1.3 }}>
                  Image &amp; prompt from Gallery loaded
                </Typography>
                {fromGalleryInitName && (
                  <Typography sx={{ ...F, fontSize:"0.71rem", color:"#64748b", mt:"2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:360 }}>
                    {fromGalleryInitName}
                  </Typography>
                )}
                <Typography sx={{ ...F, fontSize:"0.71rem", color:"#94a3b8", mt:"1px" }}>
                  Edit the prompt and click Generate to create a new version.
                </Typography>
              </Box>
            </Stack>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon sx={{ fontSize:"16px !important" }}/>}
              onClick={()=>navigate("/")}
              sx={{
                fontFamily:"'Sora',sans-serif",
                textTransform:"none", fontWeight:700, fontSize:"0.80rem",
                borderRadius:"12px",
                color:"#233971",
                borderColor:"rgba(35,57,113,0.3)",
                background:"transparent",
                px:2, py:0.7, flexShrink:0,
                "&:hover":{ background:"rgba(35,57,113,0.05)", borderColor:"rgba(35,57,113,0.5)" },
              }}
            >
              Back to Gallery
            </Button>
          </Box>
        )}

        <Card elevation={0} sx={{ ...cardShell, flex: 1, height: "100%", minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={0} alignItems="stretch" sx={{ flex: 1, minHeight: 0, overflow: { xs: "auto", lg: "hidden" } }}>
          <Box sx={{ flex: 1.05, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>

            <CardContent sx={{ p: { xs: 1.5, md: "16px 24px" }, position: "relative", zIndex: 2, overflowY: "auto", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
              <Stack spacing={2.2} sx={{ flex: 1, minHeight: 0 }}>
                <Box sx={{ flexShrink: 0 }}>
                  <Typography sx={{ ...F, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0f172a" }}>
                    Image Editor
                  </Typography>
                  <Typography sx={{ ...F, fontSize: "0.7rem", color: "#94a3b8", mt: "2px" }}>
                    Upload image & enter prompt for AI editing
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(148,163,184,0.25)", flexShrink: 0 }} />

                <Box sx={{ flexShrink: 0 }}>
                  <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0f172a", mb: 0.6 }}>
                    Upload Image
                  </Typography>
                  <Paper
                    variant="outlined"
                    component="label"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                    }}
                    onDrop={handleDrop}
                    sx={{
                      p: 1.2,
                      display: "block",
                      cursor: "pointer",
                      borderRadius: "14px",
                      borderStyle: "solid",
                      borderWidth: 1.5,
                      borderColor: dragActive ? "#233971" : "rgba(148,163,184,0.35)",
                      background: dragActive ? "rgba(35,57,113,0.06)" : "rgba(241,245,249,0.9)",
                      backdropFilter: "blur(8px)",
                      transition: "all 0.25s ease",
                      "&:hover": { borderColor: "rgba(35,57,113,0.4)" },
                    }}
                  >
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Box sx={{ width: 30, height: 30, flexShrink: 0, borderRadius: "10px", background: "rgba(100,116,139,0.12)", color: "#64748b", border: "1px solid rgba(100,116,139,0.18)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s ease", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)" }}>
                        <CloudUploadIcon sx={{ fontSize: 15, color: "currentColor", transition: "color 0.25s" }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography noWrap sx={{ ...F, fontWeight: 700, fontSize: "0.75rem", color: "#1e293b" }}>
                          {files.length ? (files[0]?.name || "1 image selected") : "Upload image to start generate"}
                        </Typography>
                        <Typography sx={{ ...F, fontSize: "0.64rem", color: "#94a3b8" }}>
                          {files.length ? "Selected · click to replace" : "Click or drag & drop · PNG · JPG · WEBP"}
                        </Typography>
                      </Box>
                      <input
                        ref={fileInputRef}
                        hidden
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleFileChange}
                      />
                    </Stack>
                  </Paper>
                </Box>

                {/* -- NEW: Reference Images Section -- */}
                <Box sx={{ flexShrink: 0 }}>
                  <ReferenceImageSection
                    refFiles={refFiles}
                    refPreviews={refPreviewUrls}
                    onAdd={handleRefFileChange}
                    onRemove={removeRefFile}
                    onPreview={(url) => openLightbox(url, false)}
                    dragActiveRef={dragActiveRef}
                    onDragOver={handleRefDragOver}
                    onDragLeave={handleRefDragLeave}
                    onDrop={handleRefDrop}
                    inputRef={refFileInputRef}
                    F={F}
                  />
                </Box>

                <Stack direction={{ xs: "column", md: "row" }} spacing={1.2} sx={{ flexShrink: 0 }}>
                  {[
                    {
                      label: "Batch Generate",
                      value: batchCount,
                      onChange: (e) => setBatchCount(Number(e.target.value)),
                      options: BATCH_OPTIONS,
                      icon: (
                        <Box sx={{ width: 24, height: 24, borderRadius: "8px", background: "rgba(100,116,139,0.16)", color: "#475569", border: "1px solid rgba(100,116,139,0.22)", display: "flex", alignItems: "center", justifyContent: "center", mr: 0.9, flexShrink: 0, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)" }}>
                          <DynamicFeedRoundedIcon sx={{ color: "currentColor", fontSize: 14 }} />
                        </Box>
                      ),
                      accentColor: "#233971",
                      helper: isSingleSourceMode ? "" : "In multi upload mode, each file produces 1 result",
                    },
                    {
                      label: "Aspect Ratio",
                      value: aspectRatio,
                      onChange: (e) => setAspectRatio(e.target.value),
                      options: ASPECT_RATIO_OPTIONS,
                      icon: (
                        <Box sx={{ width: 24, height: 24, borderRadius: "8px", background: "rgba(100,116,139,0.16)", color: "#475569", border: "1px solid rgba(100,116,139,0.22)", display: "flex", alignItems: "center", justifyContent: "center", mr: 0.9, flexShrink: 0, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)" }}>
                          <AspectRatioRoundedIcon sx={{ color: "currentColor", fontSize: 14 }} />
                        </Box>
                      ),
                      accentColor: "#2a4a9e",
                    },
                    {
                      label: "Resolution",
                      value: resolution,
                      onChange: (e) => setResolution(e.target.value),
                      options: RESOLUTION_OPTIONS,
                      icon: (
                        <Box sx={{ width: 24, height: 24, borderRadius: "8px", background: "rgba(100,116,139,0.16)", color: "#475569", border: "1px solid rgba(100,116,139,0.22)", display: "flex", alignItems: "center", justifyContent: "center", mr: 0.9, flexShrink: 0, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)" }}>
                          <HighQualityRoundedIcon sx={{ color: "currentColor", fontSize: 14 }} />
                        </Box>
                      ),
                      accentColor: "#1a5276",
                    },
                  ].map(({ label, value, onChange, options, icon, accentColor, helper }) => (
                    <TextField
                      key={label}
                      select
                      fullWidth
                      size="small"
                      label={label}
                      value={value}
                      onChange={onChange}
                      helperText={helper}
                      InputProps={{
                        startAdornment: icon,
                        sx: { fontSize: "0.8rem" },
                      }}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{ MenuProps: { PaperProps: { sx: { ...F } } } }}
                      sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "999px",
                          background: "rgba(241,245,249,0.9)",
                          backdropFilter: "blur(8px)",
                          boxShadow: "0 1px 3px rgba(15,23,42,0.04), inset 0 1px 0 rgba(255,255,255,0.75)",
                          ...F,
                        },
                        "& .MuiSelect-select": { py: "8px !important", pl: "14px !important", minHeight: "unset !important" },
                        "& .MuiOutlinedInput-root fieldset": { borderColor: "rgba(100,116,139,0.28)" },
                        "& .MuiOutlinedInput-root:hover fieldset": { borderColor: "rgba(100,116,139,0.48)" },
                        "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: accentColor, borderWidth: "1.5px" },
                        "& .MuiSelect-icon": { color: "#94a3b8" },
                        "& .MuiOutlinedInput-root:hover .MuiSelect-icon": { color: "#64748b" },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiSelect-icon": { color: accentColor },
                        "& .MuiInputLabel-root": { ...F, fontSize: "0.78rem", "&.Mui-focused": { color: accentColor } },
                        "& .MuiFormHelperText-root": { ...F, ml: 1.5, fontSize: "0.62rem", mt: "3px" },
                      }}
                    >
                      {options.map((o) => (
                        <MenuItem key={o.value} value={o.value} disabled={label === "Batch Generate" && !isSingleSourceMode && o.value > files.length} sx={{ fontSize: "0.82rem" }}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  ))}
                </Stack>

                <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.6, flexShrink: 0 }}>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0f172a" }}>Input Prompt</Typography>
                      {copied && (
                        <Typography sx={{ ...F, fontSize: "0.68rem", color: "#233971", fontWeight: 700 }}>Copied!</Typography>
                      )}
                      <Typography sx={{ ...F, fontSize: "0.68rem", color: "#94a3b8" }}>{buildFinalPrompt().length} chars</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <Button
                        size="small"
                        onClick={() => handlePresetClick(PRESETS[0].key, PRESETS[0].prompt)}
                        startIcon={<BookmarkRoundedIcon sx={{ fontSize: "13px !important" }} />}
                        sx={{
                          ...F,
                          height: 26,
                          minWidth: 0,
                          borderRadius: "999px",
                          px: 1.1,
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: "0.68rem",
                          border: "none",
                          background: "linear-gradient(135deg,#10b981,#047857)",
                          color: "#fff",
                          boxShadow:
                            activePreset === PRESETS[0].key
                              ? "0 0 0 2px #a7f3d0, 0 4px 12px rgba(5,150,105,0.5)"
                              : "0 4px 12px rgba(5,150,105,0.4)",
                          transition: "all 0.2s ease",
                          "& .MuiButton-startIcon": { color: "#fff" },
                          "&:hover": {
                            background: "linear-gradient(135deg,#059669,#065f46)",
                            transform: "translateY(-1px) scale(1.03)",
                            boxShadow: "0 6px 16px rgba(5,150,105,0.5)",
                          },
                        }}
                      >
                        {PRESETS[0].label}
                      </Button>
                      <Tooltip title={copied ? "Copied!" : "Copy prompt"}>
                        <span>
                          <IconButton
                            size="small"
                            onClick={handleCopyPrompt}
                            disabled={!prompt.trim()}
                            sx={{
                              width: 27,
                              height: 27,
                              borderRadius: "999px",
                              border: "none",
                              background: copied
                                ? "linear-gradient(135deg,#22c55e,#15803d)"
                                : "linear-gradient(135deg,#10b981,#047857)",
                              boxShadow: copied
                                ? "0 4px 12px rgba(34,197,94,0.4)"
                                : "0 4px 12px rgba(5,150,105,0.4)",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                background: copied
                                  ? "linear-gradient(135deg,#16a34a,#166534)"
                                  : "linear-gradient(135deg,#059669,#065f46)",
                                transform: "translateY(-1px) scale(1.05)",
                                boxShadow: copied
                                  ? "0 6px 16px rgba(34,197,94,0.5)"
                                  : "0 6px 16px rgba(5,150,105,0.5)",
                              },
                              "&:disabled": {
                                opacity: 1,
                                background: "linear-gradient(135deg,#10b981,#047857)",
                                boxShadow: "0 4px 12px rgba(5,150,105,0.25)",
                                cursor: "not-allowed",
                                "& svg": { color: "rgba(255,255,255,0.85)" },
                              },
                            }}
                          >
                            {copied ? (
                              <CheckIcon sx={{ fontSize: 14, color: "#fff" }} />
                            ) : (
                              <ContentCopyRoundedIcon sx={{ fontSize: 13, color: "#fff" }} />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </Box>
                  <Box
                    sx={{
                      borderRadius: "14px",
                      border: "1.5px solid rgba(148,163,184,0.35)",
                      background: "rgba(241,245,249,0.9)",
                      backdropFilter: "blur(8px)",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      "&:focus-within": { borderColor: "#233971", boxShadow: "0 0 0 3px rgba(35,57,113,0.10)" },
                      "&:hover": { borderColor: "rgba(148,163,184,0.55)" },
                      overflow: "hidden",
                      flex: 1,
                      minHeight: 96,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Example: Rotate the product to a left-side view and keep the exact same identity, lighting, and background."
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box",
                        resize: "none",
                        flex: 1,
                        minHeight: 0,
                        padding: "10px 14px",
                        fontFamily: "Sora, sans-serif",
                        fontSize: "14px",
                        lineHeight: 1.55,
                        color: "#1e293b",
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        borderRadius: "14px",
                        WebkitAppearance: "none",
                      }}
                    />
                  </Box>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 0.8, flexShrink: 0 }}>
                  <Button
                    variant="contained"
                    startIcon={<AutoAwesomeIcon />}
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                      flex: 1,
                      borderRadius: "999px",
                      py: 1.2,
                      textTransform: "none",
                      ...F,
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      background: "linear-gradient(135deg,#2a9d8f,#23857a)",
                      boxShadow: "0 8px 22px rgba(42,157,143,0.32)",
                      "&:hover": {
                        background: "linear-gradient(135deg,#23857a,#1c6b62)",
                        boxShadow: "0 12px 30px rgba(42,157,143,0.42)",
                        transform: "translateY(-2px)",
                      },
                      "&:disabled": { background: "rgba(148,163,184,0.28)", boxShadow: "none" },
                      transition: "all 0.25s ease",
                    }}
                  >
                    {loading ? "Processing…" : "Generate Image"}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<RestartAltIcon />}
                    onClick={handleClearAll}
                    disabled={loading}
                    sx={{
                      borderRadius: "999px",
                      py: 1.2,
                      px: 2.5,
                      textTransform: "none",
                      ...F,
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      background: "linear-gradient(135deg,#f43f5e,#be123c)",
                      boxShadow: "0 8px 22px rgba(244,63,94,0.32)",
                      "&:hover": {
                        background: "linear-gradient(135deg,#e11d48,#9f1239)",
                        boxShadow: "0 12px 30px rgba(244,63,94,0.42)",
                        transform: "translateY(-2px)",
                      },
                      "&:disabled": { background: "rgba(148,163,184,0.28)", boxShadow: "none" },
                      transition: "all 0.25s ease",
                    }}
                  >
                    Reset
                  </Button>
                </Stack>

                {loading && (
                  <Box>
                    <LinearProgress
                      sx={{
                        height: 5,
                        borderRadius: "999px",
                        background: "rgba(35,57,113,0.1)",
                        "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg,#233971,#2e4fa3,#5b7ec7)" },
                      }}
                    />
                    <Typography sx={{ ...F, fontSize: "0.78rem", color: "#233971", mt: 0.8, fontWeight: 500 }}>
                      Processing image…
                    </Typography>
                  </Box>
                )}
                {error && (
                  <Alert severity="error" sx={{ borderRadius: "14px", ...F, fontSize: "0.82rem", border: "1px solid rgba(239,68,68,0.18)", background: "rgba(254,242,242,0.9)" }}>
                    {error}
                  </Alert>
                )}
              </Stack>
            </CardContent>
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", lg: "block" }, borderColor: "rgba(148,163,184,0.25)" }}
          />
          <Divider sx={{ display: { xs: "block", lg: "none" }, borderColor: "rgba(148,163,184,0.25)" }} />

          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>

            <CardContent sx={{ p: { xs: 1.5, md: "16px 24px" }, "&:last-child": { pb: { xs: 1.5, md: "16px" } }, position: "relative", zIndex: 2, overflowY: "auto", flex: 1, minHeight: 0 }}>
              <Stack spacing={1.3} sx={{ height: "100%" }}>
                <Box sx={{ pb: 0.9 }}>
                  <Typography sx={{ ...F, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0f172a" }}>
                    Preview Result
                  </Typography>
                  <Typography sx={{ ...F, fontSize: "0.7rem", color: "#94a3b8", mt: "2px" }}>
                    Compare before & after — click image to preview full size
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(148,163,184,0.25)" }} />

                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.6}>
                      <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0f172a" }}>Before</Typography>
                      <Chip
                        size="small"
                        label={files.length ? `${files.length} Image Loaded` : "No File"}
                        sx={{
                          ...F,
                          fontWeight: 700,
                          fontSize: "0.68rem",
                          borderRadius: "999px",
                          height: 20,
                          background: files.length ? "rgba(35,57,113,0.09)" : "rgba(148,163,184,0.09)",
                          color: files.length ? "#233971" : "#94a3b8",
                          border: `1px solid ${files.length ? "rgba(35,57,113,0.25)" : "rgba(148,163,184,0.22)"}`,
                        }}
                      />
                    </Stack>
                    <Paper
                      variant="outlined"
                      onClick={() => primaryPreviewUrl && openLightbox(primaryPreviewUrl, false)}
                      onWheel={(e) => e.preventDefault()}
                      onMouseEnter={() => setBeforeHover(true)}
                      onMouseLeave={() => setBeforeHover(false)}
                      sx={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        borderRadius: "16px",
                        overflow: "hidden",
                        background: primaryPreviewUrl ? "rgba(241,245,249,0.9)" : "rgba(226,232,240,0.52)",
                        backdropFilter: "blur(8px)",
                        border: primaryPreviewUrl ? "1px solid rgba(148,163,184,0.3)" : "1.5px dashed rgba(100,116,139,0.32)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 1,
                        cursor: primaryPreviewUrl ? "zoom-in" : "default",
                        position: "relative",
                        transition: "border-color 0.2s",
                        ...(!primaryPreviewUrl && { boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)" }),
                        "&:hover": primaryPreviewUrl ? { borderColor: "rgba(148,163,184,0.5)" } : {},
                      }}
                    >
                      {primaryPreviewUrl ? (
                        <>
                          <Box
                            component="img"
                            src={primaryPreviewUrl}
                            alt="Before"
                            sx={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                              borderRadius: "12px",
                              boxShadow: "0 8px 22px rgba(0,0,0,0.07)",
                              transition: "transform 0.3s ease",
                              ...(beforeHover && { transform: "scale(1.015)" }),
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              borderRadius: "16px",
                              background: beforeHover ? "rgba(15,23,42,0.28)" : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.25s ease",
                              opacity: beforeHover ? 1 : 0,
                            }}
                          >
                            <Box
                              sx={{
                                width: 52,
                                height: 52,
                                borderRadius: "16px",
                                background: "rgba(255,255,255,0.15)",
                                backdropFilter: "blur(10px)",
                                border: "1.5px solid rgba(255,255,255,0.35)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                                transform: beforeHover ? "scale(1)" : "scale(0.8)",
                                transition: "transform 0.25s ease",
                              }}
                            >
                              <ZoomInIcon sx={{ color: "#fff", fontSize: 24 }} />
                            </Box>
                          </Box>
                        </>
                      ) : (
                        <Stack spacing={1} alignItems="center">
                          <Box sx={{ width: 50, height: 50, borderRadius: "14px", background: "rgba(100,116,139,0.14)", color: "#64748b", border: "1px solid rgba(100,116,139,0.2)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)" }}>
                            <ImageIcon sx={{ fontSize: 24, color: "currentColor" }} />
                          </Box>
                          <Typography sx={{ ...F, fontSize: "0.76rem", color: "#64748b", fontWeight: 700 }}>
                            No image uploaded yet
                          </Typography>
                        </Stack>
                      )}
                    </Paper>
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.6}>
                      <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0f172a" }}>After</Typography>
                      <Stack direction="row" spacing={0.6} alignItems="center">
                        <Chip
                          size="small"
                          label={loading ? "Generating…" : resultUrl ? "Generated ✓" : "Waiting Result"}
                          sx={{
                            ...F,
                            fontWeight: 700,
                            fontSize: "0.68rem",
                            height: 20,
                            borderRadius: "999px",
                            background: loading ? "rgba(245,158,11,0.09)" : resultUrl ? "rgba(35,57,113,0.09)" : "rgba(148,163,184,0.09)",
                            color: loading ? "#f59e0b" : resultUrl ? "#233971" : "#94a3b8",
                            border: `1px solid ${
                              loading ? "rgba(245,158,11,0.25)" : resultUrl ? "rgba(35,57,113,0.25)" : "rgba(148,163,184,0.22)"
                            }`,
                          }}
                        />
                        {!!activeBatchItem?.imageUrl && (
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadSingle(activeBatchItem, `edited-${batchViewIndex + 1}-${activeBatchItem.fileName || Date.now()}.png`)}
                            sx={{
                              width: 20,
                              height: 20,
                              color: "#233971",
                              background: "rgba(35,57,113,0.09)",
                              "&:hover": { background: "rgba(35,57,113,0.16)" },
                              "& svg": { fontSize: "13px" },
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        )}
                      </Stack>
                    </Stack>
                    <PreviewBox
                      src={activeBatchItem?.imageUrl || resultUrl}
                      alt="After"
                      square
                      onPreview={() => activeBatchItem && openLightbox(activeBatchItem)}
                      onPrev={
                        batchResults.length > 1
                          ? () => setBatchViewIndex((i) => (i - 1 + batchResults.length) % batchResults.length)
                          : undefined
                      }
                      onNext={
                        batchResults.length > 1
                          ? () => setBatchViewIndex((i) => (i + 1) % batchResults.length)
                          : undefined
                      }
                      counterLabel={batchResults.length > 1 ? `${batchViewIndex + 1} / ${batchResults.length}` : undefined}
                    />
                  </Box>
                </Stack>

                {resultPromptTags.length > 0 && (
                  <Box>
                    <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", color: "#475569", mb: 0.4 }}>
                      Prompt Result
                    </Typography>
                    <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>
                      {resultPromptTags.map((tag) => (
                        <Chip
                          key={tag.label}
                          label={tag.label}
                          size="small"
                          sx={{
                            ...F,
                            fontWeight: 700,
                            fontSize: "0.68rem",
                            height: 20,
                            borderRadius: "999px",
                            background: tag.bg,
                            color: tag.color,
                            border: `1px solid ${tag.border}`,
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {activeBatchItem?.width && activeBatchItem?.height && (
                  <Typography sx={{ ...F, fontSize: "0.7rem", color: "#64748b", fontWeight: 600 }}>
                    Output size: {activeBatchItem.width} x {activeBatchItem.height}px
                  </Typography>
                )}

                {!resultUrl && loading && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AutoAwesomeIcon
                      sx={{
                        fontSize: 16,
                        color: "#b45309",
                        animation: "spinSlow 2s linear infinite",
                        "@keyframes spinSlow": {
                          "0%": { transform: "rotate(0deg)" },
                          "100%": { transform: "rotate(360deg)" },
                        },
                      }}
                    />
                    <Typography sx={{ ...F, fontSize: "0.78rem", color: "#94a3b8" }}>
                      AI is processing…
                    </Typography>
                  </Box>
                )}

                {previewUrls.length > 1 && (
                  <Box>
                    <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0f172a", mb: 0.6 }}>
                      Batch Preview
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {previewUrls.map((item, idx) => (
                        <Box
                          key={`${item.file.name}-${idx}`}
                          onClick={() => openLightbox(item.url, false)}
                          onWheel={(e) => e.preventDefault()}
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "12px",
                            overflow: "hidden",
                            border: "1px solid rgba(35,57,113,0.22)",
                            background: "rgba(255,255,255,0.7)",
                            boxShadow: "0 4px 10px rgba(15,23,42,0.06)",
                            cursor: "zoom-in",
                            transition: "transform 0.2s,box-shadow 0.2s",
                            "&:hover": { transform: "scale(1.06)", boxShadow: "0 8px 20px rgba(35,57,113,0.16)" },
                          }}
                        >
                          <Box component="img" src={item.url} alt={item.file.name} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* -- NEW: Reference preview strip in result card -- */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.6} sx={{ flexShrink: 0 }}>
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0f172a" }}>
                        Reference Images
                      </Typography>
                      <Chip
                        size="small"
                        label="Optional"
                        sx={{
                          ...F,
                          fontWeight: 800,
                          fontSize: "0.64rem",
                          borderRadius: "999px",
                          height: 18,
                          background: "rgba(217,119,6,0.12)",
                          color: "#b45309",
                          border: "1.5px solid rgba(217,119,6,0.35)",
                        }}
                      />
                    </Stack>
                    <Chip
                      size="small"
                      label={refPreviewUrls.length ? `${refPreviewUrls.length} active` : "No File"}
                      sx={{
                        ...F,
                        fontWeight: 700,
                        fontSize: "0.68rem",
                        height: 20,
                        borderRadius: "999px",
                        background: refPreviewUrls.length ? "rgba(35,57,113,0.09)" : "rgba(148,163,184,0.09)",
                        color: refPreviewUrls.length ? "#233971" : "#94a3b8",
                        border: `1px solid ${refPreviewUrls.length ? "rgba(35,57,113,0.25)" : "rgba(148,163,184,0.22)"}`,
                      }}
                    />
                  </Stack>
                  {refPreviewUrls.length ? (
                    <Box sx={{ position: "relative", flex: 1, minHeight: 158 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        height: "100%",
                        boxSizing: "border-box",
                        overflowX: "auto",
                        overflowY: "hidden",
                        flexWrap: "nowrap",
                        pt: 1.2,
                        pb: 0.2,
                        pr: 3,
                        scrollSnapType: "x mandatory",
                        scrollBehavior: "smooth",
                        "&::-webkit-scrollbar": { height: 6 },
                        "&::-webkit-scrollbar-thumb": { background: "rgba(35,57,113,0.25)", borderRadius: "999px" },
                      }}
                    >
                      {refPreviewUrls.map((item, idx) => (
                        <Box
                          key={`ref-preview-${item.file.name}-${idx}`}
                          sx={{
                            position: "relative",
                            width: 140,
                            height: 140,
                            scrollSnapAlign: "start",
                            flexShrink: 0,
                          }}
                        >
                          <Box
                            onClick={() => openLightbox(item.url, false)}
                            onWheel={(e) => e.preventDefault()}
                            sx={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "20px",
                              overflow: "hidden",
                              border: "1.5px solid rgba(35,57,113,0.28)",
                              background: "rgba(255,255,255,0.7)",
                              cursor: "zoom-in",
                              transition: "transform 0.2s, box-shadow 0.2s",
                              "&:hover": { transform: "scale(1.06)", boxShadow: "0 8px 20px rgba(35,57,113,0.22)" },
                            }}
                          >
                            <Box component="img" src={item.url} alt={item.file.name} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          </Box>
                          <Chip
                            size="small"
                            label={`REF ${idx + 1}`}
                            sx={{
                              ...F,
                              position: "absolute",
                              bottom: 6,
                              left: "50%",
                              transform: "translateX(-50%)",
                              fontWeight: 800,
                              fontSize: "0.62rem",
                              height: 18,
                              borderRadius: "999px",
                              background: "#233971",
                              color: "#fff",
                              border: "1.5px solid #fff",
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRefFile(idx);
                            }}
                            sx={{
                              position: "absolute",
                              top: -8,
                              right: -8,
                              width: 24,
                              height: 24,
                              p: 0,
                              background: "rgba(239,68,68,0.95)",
                              border: "1.5px solid #fff",
                              color: "#fff",
                              zIndex: 3,
                              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                              "&:hover": { background: "rgba(220,38,38,1)" },
                              "& svg": { fontSize: "16px !important" },
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 6,
                        width: 32,
                        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.95))",
                        pointerEvents: "none",
                      }}
                    />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        flex: 1,
                        minHeight: 158,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1.2,
                        p: 1.2,
                        borderRadius: "14px",
                        border: "1.5px dashed rgba(100,116,139,0.32)",
                        background: "rgba(226,232,240,0.52)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)",
                      }}
                    >
                      <Box sx={{ width: 44, height: 44, flexShrink: 0, borderRadius: "12px", background: "rgba(100,116,139,0.14)", color: "#64748b", border: "1px solid rgba(100,116,139,0.2)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)" }}>
                        <AddPhotoAlternateIcon sx={{ fontSize: 24, color: "currentColor" }} />
                      </Box>
                      <Typography sx={{ ...F, fontSize: "0.76rem", color: "#64748b", fontWeight: 700 }}>
                        No reference image yet
                      </Typography>
                    </Box>
                  )}
                </Box>

              </Stack>
            </CardContent>
          </Box>
        </Stack>
        </Card>
      </Stack>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccess("")}
          severity="success"
          variant="filled"
          sx={{ ...F, borderRadius: "12px", fontSize: "0.82rem" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

