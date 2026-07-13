import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import api from "../api/client";

/* ================================================================
   Agent Mila — generate 3 varian gambar produk + varian warna
   Port dari studio-iklan.html ke React (logic canvas dipertahankan
   apa adanya, form diubah jadi controlled React state).
================================================================ */

const VARIAN = [
  { num: 1, key: "1-reference", label: "Item + Reference" },
  { num: 2, key: "2-keypoint", label: "Item + Key Point Sell" },
  { num: 3, key: "3-spesifikasi", label: "Item + Specification" },
  { num: 4, key: "4-cara-penggunaan", label: "Item + How to Use" },
  { num: 5, key: "5-subjek", label: "Item with Subject" },
  { num: 6, key: "6-improvement", label: "Item + Improvement" },
];

const DEFAULT_VARIANT_STATE = { 1: false, 2: true, 3: true, 4: true, 5: false, 6: false };
const MAX_VARIAN_GENERATE = VARIAN.length;
const KEYPOINT_BACKGROUND_RULE =
  "For the Key Point Sell variant only: you may mimic marketplace ad layout direction such as a large product left/center, title top right, and exactly 3 key points on the right. But DO NOT include the reference frame/template: no blue border/edge frame, rounded frame, brand box/logo top left, top banner, watermark, GOSAVE/PASTI AMAN text from the example, diagonal lines, or other template elements. DO NOT create a solid blue panel/column behind the 3 key points and do not add a blue wash/tint/shadow/glow to the background. The background behind the 3 key points must stay a natural photo blended with the main background. For the 3 key points, you may use exactly 3 small blue/navy icon circles like the example, but nothing else; do not add badges, logos, 'AI approved' text, 'approved' text, stamps, or other elements.";
const EXTRA_NEGATIVE_PROMPT =
  "reference frame appearing in result, blue border, blue edge frame, rounded frame, GOSAVE logo, GOSAVE PASTI AMAN, top-left logo banner, watermark, solid blue panel, solid blue column, solid blue background, navy panel, navy wash, blue wash, blue tint, blue shadow, blue glow, blue shadow, diagonal lines, geometric lines, line pattern, AI approved, approved, extra logo, extra badge besides the 3 key points, stamp, extra label, extra icon, odd decorative element, extra text outside the instructions";

// n8n "Prompt 2 - Item + Key Point Sell" sekarang minta AI gambar judul/tagline/badge sendiri,
// jadi overlay Canvas di sini dimatikan supaya tidak dobel. Set true lagi kalau n8n dikembalikan
// ke versi lama (AI cuma gambar produk, badge ditempel web app).
const CANVAS_OVERLAY_KEYPOINT = false;

const KATEGORI_KEY_POINT = [
  ["lock", ["kunci", "lock", "gembok", "terkunci", "pengaman kunci"]],
  ["water", ["air", "waterproof", "tahan air", "anti air", "water", "basah", "hujan", "kedap air", "tumpah"]],
  ["dust", ["debu", "dust", "anti debu", "berdebu", "kotoran", "kotor"]],
  ["uv", ["uv", "sinar matahari", "sinar uv", "panas matahari"]],
  ["star", ["premium", "kualitas", "quality", "material", "bahan", "mewah", "elegan", "eksklusif", "original", "asli", "grade a", "terbaik"]],
  ["clock", ["waktu", "durasi", "menit", "detik", "jam", "cas", "charging", "charge time", "cepat penuh", "fast charging", "isi ulang"]],
  ["bolt", ["kuat", "strong", "cepat", "fast", "quick", "instant", "power", "koneksi", "connection", "kokoh", "daya", "baterai", "battery", "watt", "volt", "mah", "tenaga", "performa", "responsif", "tangguh"]],
  ["shield", ["aman", "safe", "proteksi", "protect", "anti pecah", "tahan benturan", "pengaman", "tahan lama", "awet", "garansi", "tahan banting", "anti gores", "tahan karat"]],
  ["box", ["ringan", "portable", "praktis", "mudah dibawa", "kemasan", "paket", "kapasitas", "ukuran", "dimensi", "berat", "gram", "kilogram", "liter", "ml", "cm", "lipat", "compact", "simpel", "multifungsi", "serbaguna"]],
  ["leaf", ["ramah lingkungan", "eco", "organik", "natural", "alami", "bpa free", "food grade", "daur ulang", "biodegradable", "non toxic"]],
  ["heart", ["nyaman", "empuk", "lembut", "halus", "ergonomis", "wrap-around", "wrap around"]],
  ["tag", ["murah", "hemat", "ekonomis", "worth it", "terjangkau", "harga", "diskon", "promo", "value"]],
  ["star2", ["stylish", "trendy", "modis", "cantik", "keren", "fashionable", "desain", "gaya"]],
];

function cocokkanKategoriKeyPoint(teks) {
  const t = (teks || "").toLowerCase();
  let tipe = null, keyword = null, posisiTerbaik = Infinity;
  KATEGORI_KEY_POINT.forEach(([tp, kws]) => {
    kws.forEach((k) => {
      const idx = t.indexOf(k);
      if (idx !== -1 && idx < posisiTerbaik) { posisiTerbaik = idx; tipe = tp; keyword = k; }
    });
  });
  return { tipe: tipe || "check", keyword };
}

function gambarIkonUV(ctx, cx, cy, r, color) {
  ctx.strokeStyle = color; ctx.fillStyle = color;
  ctx.lineWidth = r * 0.08; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.font = `900 ${Math.round(r * 0.42)}px "Arial Black", "Segoe UI Black", "Segoe UI", Arial, sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("UV", cx, cy - r * 0.02);
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.08, r * 0.58, Math.PI * 1.05, Math.PI * 1.95);
  ctx.stroke();
  for (let i = -3; i <= 3; i++) {
    const a = -Math.PI / 2 + i * 0.25;
    const x1 = cx + Math.cos(a) * r * 0.58;
    const y1 = cy - r * 0.08 + Math.sin(a) * r * 0.58;
    const x2 = cx + Math.cos(a) * r * 0.78;
    const y2 = cy - r * 0.08 + Math.sin(a) * r * 0.78;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.55, cy + r * 0.5);
  ctx.lineTo(cx + r * 0.55, cy + r * 0.5);
  ctx.moveTo(cx - r * 0.32, cy + r * 0.23);
  ctx.lineTo(cx, cy + r * 0.5);
  ctx.lineTo(cx + r * 0.32, cy + r * 0.23);
  ctx.stroke();
}

function gambarIkonWater(ctx, cx, cy, r, color) {
  ctx.strokeStyle = color; ctx.fillStyle = color;
  ctx.lineWidth = r * 0.08; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.72);
  ctx.bezierCurveTo(cx + r * 0.6, cy - r * 0.08, cx + r * 0.45, cy + r * 0.58, cx, cy + r * 0.58);
  ctx.bezierCurveTo(cx - r * 0.45, cy + r * 0.58, cx - r * 0.6, cy - r * 0.08, cx, cy - r * 0.72);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.65, cy + r * 0.72);
  ctx.lineTo(cx + r * 0.65, cy + r * 0.72);
  ctx.stroke();
}

function gambarIkonDust(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx - r * 0.32, cy - r * 0.08, r * 0.32, Math.PI * 0.55, Math.PI * 1.6);
  ctx.arc(cx - r * 0.02, cy - r * 0.4, r * 0.34, Math.PI * 1.05, Math.PI * 1.98);
  ctx.arc(cx + r * 0.34, cy - r * 0.1, r * 0.3, Math.PI * 1.4, Math.PI * 0.42);
  ctx.closePath();
  ctx.fill();
  const dots = [[-0.3, 0.42], [-0.02, 0.5], [0.3, 0.4], [-0.14, 0.62], [0.16, 0.63]];
  for (const [dx, dy] of dots) {
    ctx.beginPath();
    ctx.arc(cx + dx * r, cy + dy * r, r * 0.07, 0, Math.PI * 2);
    ctx.fill();
  }
}

function gambarIkonLock(ctx, cx, cy, r, color) {
  ctx.strokeStyle = color; ctx.fillStyle = color;
  ctx.lineWidth = r * 0.14; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.12, r * 0.42, Math.PI, 0, false);
  ctx.stroke();
  const bw = r * 1.1, bh = r * 0.85, bx = cx - bw / 2, by = cy - r * 0.1, rad = r * 0.14;
  ctx.beginPath();
  ctx.moveTo(bx + rad, by);
  ctx.lineTo(bx + bw - rad, by);
  ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + rad);
  ctx.lineTo(bx + bw, by + bh - rad);
  ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - rad, by + bh);
  ctx.lineTo(bx + rad, by + bh);
  ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - rad);
  ctx.lineTo(bx, by + rad);
  ctx.quadraticCurveTo(bx, by, bx + rad, by);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#1E3A8A";
  ctx.beginPath();
  ctx.arc(cx, by + bh * 0.42, r * 0.09, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.05, by + bh * 0.42);
  ctx.lineTo(cx + r * 0.05, by + bh * 0.42);
  ctx.lineTo(cx + r * 0.09, by + bh * 0.75);
  ctx.lineTo(cx - r * 0.09, by + bh * 0.75);
  ctx.closePath();
  ctx.fill();
}

function gambarIkonStar(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  const spikes = 5, outerR = r * 0.62, innerR = r * 0.27;
  let rot = -Math.PI / 2;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
  for (let i = 0; i < spikes; i++) {
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
  }
  ctx.closePath();
  ctx.fill();
}

function gambarIkonBolt(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.12, cy - r * 0.68);
  ctx.lineTo(cx - r * 0.42, cy + r * 0.08);
  ctx.lineTo(cx - r * 0.02, cy + r * 0.08);
  ctx.lineTo(cx - r * 0.12, cy + r * 0.68);
  ctx.lineTo(cx + r * 0.42, cy - r * 0.12);
  ctx.lineTo(cx + r * 0.02, cy - r * 0.12);
  ctx.closePath();
  ctx.fill();
}

function gambarIkonShield(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.7);
  ctx.lineTo(cx + r * 0.55, cy - r * 0.42);
  ctx.lineTo(cx + r * 0.55, cy + r * 0.05);
  ctx.quadraticCurveTo(cx + r * 0.5, cy + r * 0.5, cx, cy + r * 0.72);
  ctx.quadraticCurveTo(cx - r * 0.5, cy + r * 0.5, cx - r * 0.55, cy + r * 0.05);
  ctx.lineTo(cx - r * 0.55, cy - r * 0.42);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#1E3A8A";
  ctx.lineWidth = r * 0.1; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.24, cy);
  ctx.lineTo(cx - r * 0.04, cy + r * 0.2);
  ctx.lineTo(cx + r * 0.28, cy - r * 0.22);
  ctx.stroke();
}

function gambarIkonBox(ctx, cx, cy, r, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = r * 0.09; ctx.lineCap = "round"; ctx.lineJoin = "round";
  const w = r * 1.05, h = r * 0.95;
  ctx.strokeRect(cx - w / 2, cy - h / 2, w, h);
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, cy - h * 0.15);
  ctx.lineTo(cx + w / 2, cy - h * 0.15);
  ctx.moveTo(cx, cy - h * 0.15);
  ctx.lineTo(cx - w * 0.18, cy - h / 2);
  ctx.moveTo(cx, cy - h * 0.15);
  ctx.lineTo(cx + w * 0.18, cy - h / 2);
  ctx.stroke();
}

function gambarIkonCheck(ctx, cx, cy, r, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = r * 0.16; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.38, cy + r * 0.02);
  ctx.lineTo(cx - r * 0.08, cy + r * 0.35);
  ctx.lineTo(cx + r * 0.42, cy - r * 0.32);
  ctx.stroke();
}

function gambarIkonClock(ctx, cx, cy, r, color) {
  ctx.strokeStyle = color; ctx.fillStyle = color;
  ctx.lineWidth = r * 0.11; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - r * 0.4);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + r * 0.28, cy + r * 0.1);
  ctx.stroke();
}

function gambarIkonLeaf(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.5, cy + r * 0.55);
  ctx.quadraticCurveTo(cx - r * 0.65, cy - r * 0.35, cx + r * 0.1, cy - r * 0.65);
  ctx.quadraticCurveTo(cx + r * 0.7, cy - r * 0.55, cx + r * 0.55, cy + r * 0.1);
  ctx.quadraticCurveTo(cx + r * 0.35, cy + r * 0.6, cx - r * 0.5, cy + r * 0.55);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#1E3A8A";
  ctx.lineWidth = r * 0.07; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.4, cy + r * 0.45);
  ctx.lineTo(cx + r * 0.3, cy - r * 0.3);
  ctx.stroke();
}

function gambarIkonHeart(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy + r * 0.58);
  ctx.bezierCurveTo(cx - r * 0.75, cy + r * 0.05, cx - r * 0.55, cy - r * 0.62, cx, cy - r * 0.22);
  ctx.bezierCurveTo(cx + r * 0.55, cy - r * 0.62, cx + r * 0.75, cy + r * 0.05, cx, cy + r * 0.58);
  ctx.closePath();
  ctx.fill();
}

function gambarIkonTag(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.6, cy - r * 0.55);
  ctx.lineTo(cx + r * 0.15, cy - r * 0.55);
  ctx.lineTo(cx + r * 0.62, cy - r * 0.02);
  ctx.lineTo(cx - r * 0.05, cy + r * 0.62);
  ctx.lineTo(cx - r * 0.6, cy + r * 0.05);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#1E3A8A";
  ctx.beginPath();
  ctx.arc(cx - r * 0.32, cy - r * 0.3, r * 0.11, 0, Math.PI * 2);
  ctx.fill();
}

function gambarIkonKeyPoint(tipe, ctx, cx, cy, r, color) {
  if (tipe === "uv") return gambarIkonUV(ctx, cx, cy, r, color);
  if (tipe === "water") return gambarIkonWater(ctx, cx, cy, r, color);
  if (tipe === "dust") return gambarIkonDust(ctx, cx, cy, r, color);
  if (tipe === "lock") return gambarIkonLock(ctx, cx, cy, r, color);
  if (tipe === "star") return gambarIkonStar(ctx, cx, cy, r, color);
  if (tipe === "bolt") return gambarIkonBolt(ctx, cx, cy, r, color);
  if (tipe === "shield") return gambarIkonShield(ctx, cx, cy, r, color);
  if (tipe === "box") return gambarIkonBox(ctx, cx, cy, r, color);
  if (tipe === "clock") return gambarIkonClock(ctx, cx, cy, r, color);
  if (tipe === "leaf") return gambarIkonLeaf(ctx, cx, cy, r, color);
  if (tipe === "heart") return gambarIkonHeart(ctx, cx, cy, r, color);
  if (tipe === "tag") return gambarIkonTag(ctx, cx, cy, r, color);
  return gambarIkonCheck(ctx, cx, cy, r, color);
}

function bungkusTeksCanvas(ctx, text, maxWidth) {
  const kata = text.split(/\s+/).filter(Boolean);
  const baris = [];
  let sekarang = "";
  kata.forEach((w) => {
    const coba = sekarang ? sekarang + " " + w : w;
    if (ctx.measureText(coba).width > maxWidth && sekarang) {
      baris.push(sekarang);
      sekarang = w;
    } else {
      sekarang = coba;
    }
  });
  if (sekarang) baris.push(sekarang);
  return baris;
}

async function tempelJudulProduk(imageDataUrl, judulText, taglineText) {
  judulText = (judulText || "").trim();
  taglineText = (taglineText || "").trim();
  if (!judulText && !taglineText) return { image: imageDataUrl, bottomY: null };

  try {
    await Promise.all([
      document.fonts.load("800 40px Montserrat"),
      document.fonts.load("800 80px Montserrat"),
      document.fonts.ready,
    ]);
  } catch (e) { console.warn("Montserrat font failed to load, title is still applied using a fallback font.", e); }

  const img = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = imageDataUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const W = canvas.width, H = canvas.height;
  const rightEdge = W * 0.97;
  const maxWidth = W * 0.58;
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";

  let y = H * 0.155;

  if (judulText) {
    let fontSize = Math.round(W * 0.052);
    ctx.font = `800 ${fontSize}px "Montserrat","Arial Black","Segoe UI Black",Arial,sans-serif`;
    let baris = bungkusTeksCanvas(ctx, judulText.toUpperCase(), maxWidth);
    while (baris.length > 3 && fontSize > W * 0.03) {
      fontSize -= 2;
      ctx.font = `800 ${fontSize}px "Montserrat","Arial Black","Segoe UI Black",Arial,sans-serif`;
      baris = bungkusTeksCanvas(ctx, judulText.toUpperCase(), maxWidth);
    }
    const lineHeight = fontSize * 1.32;
    ctx.lineWidth = Math.max(2, fontSize * 0.1);
    ctx.strokeStyle = "rgba(0,0,0,.55)";
    ctx.fillStyle = "#ffffff";
    baris.forEach((line) => {
      ctx.strokeText(line, rightEdge, y);
      ctx.fillText(line, rightEdge, y);
      y += lineHeight;
    });
    y += lineHeight * 0.02;
  }

  if (taglineText) {
    let fontSize = Math.round(W * 0.034);
    const minFontSizeTagline = W * 0.02;
    ctx.font = `800 ${fontSize}px "Montserrat","Arial Black","Segoe UI Black",Arial,sans-serif`;
    let barisTagline = bungkusTeksCanvas(ctx, taglineText, maxWidth);
    while (barisTagline.length > 3 && fontSize > minFontSizeTagline) {
      fontSize -= 1;
      ctx.font = `800 ${fontSize}px "Montserrat","Arial Black","Segoe UI Black",Arial,sans-serif`;
      barisTagline = bungkusTeksCanvas(ctx, taglineText, maxWidth);
    }
    const taglineLineHeight = fontSize * 1.28;
    y += fontSize * 0.05;
    ctx.lineWidth = Math.max(2, fontSize * 0.1);
    ctx.strokeStyle = "rgba(0,0,0,.55)";
    ctx.fillStyle = "#FFD500";
    barisTagline.forEach((line, i) => {
      ctx.strokeText(line, rightEdge, y);
      ctx.fillText(line, rightEdge, y);
      if (i < barisTagline.length - 1) y += taglineLineHeight;
    });
  }

  return { image: canvas.toDataURL("image/png"), bottomY: y };
}

async function tempelBadgeInfo(imageDataUrl, teksMentah, judulBottomY, opsi) {
  const { pesanKosong, jumlahTetap, jumlahMax } = opsi;
  let poin = (teksMentah || "").split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean);
  if (poin.length === 0) throw new Error(pesanKosong);
  if (jumlahTetap) {
    while (poin.length < jumlahTetap) poin.push(poin[poin.length - 1]);
    poin = poin.slice(0, jumlahTetap);
  } else if (jumlahMax) {
    poin = poin.slice(0, jumlahMax);
  }

  try {
    await Promise.all([
      document.fonts.load("800 16px Montserrat"),
      document.fonts.load("800 40px Montserrat"),
      document.fonts.load("800 80px Montserrat"),
      document.fonts.ready,
    ]);
  } catch (e) { console.warn("Montserrat font failed to load, badge is still applied using a fallback font.", e); }

  const img = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = imageDataUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const W = canvas.width, H = canvas.height;
  const iconCx = W * 0.83;
  const labelMaxWidth = W * 0.27;
  const iconBlue = "#1E3A8A";
  const labelGapFactor = 0.28;
  const blockGapFactor = 1.05;

  const LABEL_KATEGORI = {
    lock: "Securely Locked",
    water: "Waterproof",
    dust: "Dustproof",
    uv: "UV Resistant",
    star: "Premium Quality",
    star2: "Stylish Design",
    clock: "Fast Charging",
    bolt: "Powerful",
    shield: "Safe & Protected",
    box: "Easy to Carry",
    leaf: "Eco-Friendly",
    heart: "Comfortable",
    tag: "Great Value",
  };
  const KATA_SAMBUNG = new Set(["dan", "atau", "yang", "dengan", "untuk", "ke", "di", "dari", "serta", "juga", "pada", "akan", "agar", "supaya", "ini", "itu", "adalah", "sebuah", "satu", "bisa", "dapat", "sudah", "tanpa", "saja", "sekali", "sangat", "banget", "tetap", "tak", "tidak", "jadi", "biar", "si", "se", "para"]);
  const ambilKataInti = (s, maksKata) => {
    const kata = s.split(/\s+/).filter(Boolean);
    const inti = kata.filter((k) => !KATA_SAMBUNG.has(k.toLowerCase()));
    const dipakai = (inti.length ? inti : kata).slice(0, maksKata);
    return dipakai.join(" ");
  };
  const jadiTitleCase = (s) => s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

  ctx.textBaseline = "middle";

  const siapkanBlok = (circleR, baseFontSize, minFontSize) => {
    const mentah = poin.map((teks) => {
      const bersih = teks.replace(/^[-–—•*\d.)\s]+/, "").replace(/\s+/g, " ").trim();
      const { tipe } = cocokkanKategoriKeyPoint(bersih);
      const label = tipe !== "check" ? LABEL_KATEGORI[tipe] : jadiTitleCase(ambilKataInti(bersih, 2));
      return { bersih, label, tipe: tipe === "star2" ? "star" : tipe };
    });
    const wrapSemua = (fontSize) => {
      ctx.font = `800 ${fontSize}px "Montserrat", "Arial Black", "Segoe UI Black", "Segoe UI", Arial, sans-serif`;
      return mentah.map((m) => bungkusTeksCanvas(ctx, m.label, labelMaxWidth));
    };
    let labelFontSize = baseFontSize;
    let wrapped = wrapSemua(labelFontSize);
    while (wrapped.some((baris) => baris.length > 2) && labelFontSize > minFontSize) {
      labelFontSize -= 1;
      wrapped = wrapSemua(labelFontSize);
    }
    const labelLineHeight = labelFontSize * 1.22;
    return mentah.map((m, i) => ({
      bersih: m.bersih,
      tipe: m.tipe,
      labelBaris: wrapped[i],
      labelFontSize,
      labelLineHeight,
      tinggiLabel: wrapped[i].length * labelLineHeight,
    }));
  };
  const hitungTinggi = (blok, circleR, labelGap, blockGap) =>
    blok.reduce((total, b) => total + circleR * 2 + labelGap + b.tinggiLabel, 0) + blockGap * (blok.length - 1);

  const jarakDariJudul = H * 0.05;
  const zonaAtas = judulBottomY != null ? judulBottomY + jarakDariJudul : H * 0.14;
  const zonaBawah = H * 0.94;
  const zonaTinggi = zonaBawah - zonaAtas;

  let circleR = W * 0.07;
  let baseFontSize = Math.round(W * 0.031);
  let minFontSize = W * 0.021;
  let labelGap = circleR * labelGapFactor;
  let blockGap = circleR * blockGapFactor;
  let blok = siapkanBlok(circleR, baseFontSize, minFontSize);
  let tinggiTotal = hitungTinggi(blok, circleR, labelGap, blockGap);

  if (tinggiTotal > zonaTinggi) {
    const skala = Math.max(0.55, zonaTinggi / tinggiTotal);
    circleR *= skala;
    baseFontSize = Math.round(baseFontSize * skala);
    minFontSize *= skala;
    labelGap = circleR * labelGapFactor;
    blockGap = circleR * blockGapFactor;
    blok = siapkanBlok(circleR, baseFontSize, minFontSize);
    tinggiTotal = hitungTinggi(blok, circleR, labelGap, blockGap);
  }

  let cy = zonaAtas + Math.max(0, (zonaTinggi - tinggiTotal) * 0.12) + circleR;

  blok.forEach((b) => {
    ctx.font = `800 ${b.labelFontSize}px "Montserrat", "Arial Black", "Segoe UI Black", "Segoe UI", Arial, sans-serif`;
    ctx.textAlign = "center";

    ctx.beginPath();
    ctx.arc(iconCx, cy, circleR, 0, Math.PI * 2);
    ctx.fillStyle = iconBlue;
    ctx.fill();

    gambarIkonKeyPoint(b.tipe, ctx, iconCx, cy, circleR * 0.72, "#fff");

    ctx.font = `800 ${b.labelFontSize}px "Montserrat", "Arial Black", "Segoe UI Black", "Segoe UI", Arial, sans-serif`;
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    ctx.lineWidth = Math.max(4, b.labelFontSize * 0.26);
    ctx.strokeStyle = "rgba(0,0,0,.9)";
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(0,0,0,.55)";
    ctx.shadowBlur = Math.max(3, b.labelFontSize * 0.12);
    let labelY = cy + circleR + labelGap + b.labelLineHeight / 2;
    b.labelBaris.forEach((baris) => {
      ctx.strokeText(baris, iconCx, labelY);
      ctx.fillText(baris, iconCx, labelY);
      labelY += b.labelLineHeight;
    });

    cy += circleR * 2 + labelGap + b.tinggiLabel + blockGap;
  });

  return canvas.toDataURL("image/png");
}

async function tempelBadgeKeyPoint(imageDataUrl, keypointText, judulBottomY) {
  return tempelBadgeInfo(imageDataUrl, keypointText, judulBottomY, {
    pesanKosong: 'The "Key point sell" field is empty or disabled - no text to overlay, badge skipped.',
    jumlahTetap: 3,
  });
}

async function bersihkanPojokKiriAtas(imageDataUrl) {
  const img = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = imageDataUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const W = canvas.width, H = canvas.height;
  const regionW = W * 0.5;
  const regionH = H * 0.15;

  const cekW = Math.max(1, Math.round(regionW));
  const cekH = Math.max(1, Math.round(regionH));
  const data = ctx.getImageData(0, 0, cekW, cekH).data;
  let sum = 0, sumSq = 0, n = 0;
  for (let i = 0; i < data.length; i += 4 * 29) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    sum += lum; sumSq += lum * lum; n++;
  }
  const rata = sum / n;
  const stdDev = Math.sqrt(Math.max(0, sumSq / n - rata * rata));
  const AMBANG_POLOS = 14;
  if (stdDev > AMBANG_POLOS) {
    return canvas.toDataURL("image/png");
  }

  ctx.drawImage(canvas, 0, regionH, regionW, regionH, 0, 0, regionW, regionH);

  return canvas.toDataURL("image/png");
}

/* ---------------- Shared theme tokens (senada dengan halaman lain) ---------------- */

const FontStyle = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');`}</style>
);

const F = { fontFamily: "'Sora',sans-serif" };

const cardShell = {
  borderRadius: "32px",
  border: "1px solid rgba(148,163,184,0.25)",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05), 0 16px 40px -8px rgba(35,57,113,0.13)",
  overflow: "hidden",
  position: "relative",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    background: "rgba(241,245,249,0.9)",
    backdropFilter: "blur(8px)",
    ...F,
    fontSize: "0.76rem",
    "& fieldset": { borderColor: "rgba(148,163,184,0.35)" },
    "&:hover fieldset": { borderColor: "rgba(148,163,184,0.6)" },
    "&.Mui-focused fieldset": { borderColor: "#233971", borderWidth: "1.5px" },
  },
  "& .MuiInputBase-input": { py: "7px", fontSize: "0.76rem", lineHeight: 1.35 },
  "& textarea.MuiInputBase-input": { py: 0, lineHeight: 1.32 },
  "& .MuiInputBase-input::placeholder": { color: "#475569", opacity: 1 },
  "& .MuiInputLabel-root": { ...F, "&.Mui-focused": { color: "#233971" } },
  "& .MuiFormHelperText-root": { ...F },
};

const inputSxDark = {
  ...inputSx,
  "& .MuiOutlinedInput-root": {
    ...inputSx["& .MuiOutlinedInput-root"],
    background: "rgba(226,232,240,0.95)",
  },
};

const sectionLabel = { ...F, fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "#0f172a" };

const sectionCardSx = {
  borderRadius: "14px",
  border: "1px solid rgba(35,57,113,0.13)",
  background: "rgba(255,255,255,0.7)",
  boxShadow: "0 1px 4px rgba(15,23,42,0.04), 0 8px 20px -10px rgba(35,57,113,0.14)",
  p: 1,
};

const formBlockSx = {
  minWidth: 0,
  p: 0.5,
  borderRadius: "14px",
  border: "1px solid rgba(148,163,184,0.22)",
  background: "rgba(248,250,252,0.78)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)",
};

const compactSwitchSx = {
  width: 32, height: 19, padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: "2.5px",
    transitionDuration: "220ms",
    "&.Mui-checked": {
      transform: "translateX(13px)",
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
    width: 14, height: 14,
    boxShadow: "0 1px 3px rgba(15,23,42,0.3)",
  },
  "& .MuiSwitch-track": {
    borderRadius: 999,
    background: "rgba(148,163,184,0.55)",
    opacity: 1,
    transition: "background 0.25s ease",
  },
};

const gridCanvasSx = {
  aspectRatio: "1 / 1",
  borderRadius: "12px",
  overflow: "hidden",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg,rgba(232,237,248,0.9),rgba(234,240,251,0.9))",
};

/* ---------------- UI helper components ---------------- */

function FieldLabel({ label, hint }) {
  return (
    <Stack direction="row" spacing={0.55} alignItems="center" sx={{ minWidth: 0 }}>
      <Typography noWrap sx={sectionLabel}>
        {label}{" "}
        {hint && <Typography component="span" sx={{ ...F, fontWeight: 400, textTransform: "none", fontSize: "0.62rem", color: "#94a3b8" }}>{hint}</Typography>}
      </Typography>
    </Stack>
  );
}

function ToggleField({ label, hint, value, onChange, active, onActiveChange, textarea = false, placeholder, sx, dark = false }) {
  return (
    <Box sx={{ ...formBlockSx, gridColumn: { xs: "1 / -1", md: "span 6" }, opacity: active ? 1 : 0.6, transition: "opacity 0.2s", ...sx }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.35}>
        <FieldLabel label={label} hint={hint} />
        <Switch size="small" checked={active} onChange={(e) => onActiveChange(e.target.checked)} sx={compactSwitchSx} />
      </Stack>
      <TextField
        fullWidth
        size="small"
        multiline={textarea}
        minRows={textarea ? 2 : 1}
        maxRows={textarea ? 2 : 1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!active}
        placeholder={placeholder}
        sx={[dark ? inputSxDark : inputSx, !textarea && { "& .MuiOutlinedInput-root": { minHeight: "44px", boxSizing: "border-box" } }]}
      />
    </Box>
  );
}

function UploadBox({ icon, title, subtitle, accept, multiple = false, onFile, disabled = false, dashed = true, iconBg = "rgba(100,116,139,0.12)", iconColor = "#64748b" }) {
  const inputRef = useRef(null);
  return (
    <Paper
      variant="outlined"
      onClick={() => { if (!disabled) inputRef.current?.click(); }}
      sx={{
        p: 0.8,
        minHeight: "44px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        borderRadius: "12px",
        borderStyle: dashed ? "dashed" : "solid",
        borderWidth: 1.5,
        borderColor: "rgba(148,163,184,0.35)",
        background: "rgba(241,245,249,0.9)",
        backdropFilter: "blur(8px)",
        transition: "all 0.25s ease",
        "&:hover": disabled ? undefined : { borderColor: "rgba(35,57,113,0.4)" },
      }}
    >
      <Stack direction="row" spacing={0.8} alignItems="center" sx={{ width: "100%" }}>
        {icon && (
          <Box
            sx={{
              width: 28,
              height: 28,
              flexShrink: 0,
              borderRadius: "9px",
              background: iconBg,
              color: iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.65)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
              "& svg": { fontSize: 15, color: "currentColor" },
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography noWrap sx={{ ...F, fontWeight: 700, fontSize: "0.68rem", color: "#1e293b" }}>{title}</Typography>
          <Typography noWrap sx={{ ...F, fontSize: "0.58rem", color: "#94a3b8" }}>{subtitle}</Typography>
        </Box>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} hidden onChange={(e) => { onFile(e.target.files); e.target.value = ""; }} />
      </Stack>
    </Paper>
  );
}

const ResultCard = memo(function ResultCard({ label, index, active, toggleNum, onToggleActive, status, data, editKey, onEdit, onPreview, subtitle }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 0.75,
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: "14px",
        background: active ? "rgba(255,255,255,0.72)" : "rgba(241,245,249,0.55)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(148,163,184,0.3)",
        opacity: active ? 1 : 0.6,
        transition: "opacity 0.2s, box-shadow 0.2s",
      }}
    >
      <Stack spacing={0.7} sx={{ flex: 1, minHeight: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography noWrap sx={{ ...F, fontWeight: 700, fontSize: "0.64rem", color: "#334155" }}>
            {String(index + 1).padStart(2, "0")}. {subtitle || label}
          </Typography>
          {onToggleActive && (
            <Switch size="small" checked={active} onChange={(e) => onToggleActive(toggleNum, e.target.checked)} sx={compactSwitchSx} />
          )}
        </Stack>
        <Box sx={{ ...gridCanvasSx, flex: 1, minHeight: 0, aspectRatio: "auto" }}>
          {status === "loading" && <CircularProgress size={26} thickness={4} sx={{ color: "#233971" }} />}
          {status === "idle" && (
            <Typography sx={{ ...F, fontSize: "0.66rem", color: "#94a3b8", textAlign: "center", px: 2 }}>
              Result will appear here
            </Typography>
          )}
          {status === "skip" && (
            <Typography sx={{ ...F, fontSize: "0.66rem", color: "#94a3b8", textAlign: "center", px: 2 }}>
              Disabled
            </Typography>
          )}
          {status === "error" && (
            <Typography sx={{ ...F, fontSize: "0.66rem", color: "#b45309", textAlign: "center", px: 2 }}>
              {data?.errorMsg || "Failed to generate"}
            </Typography>
          )}
          {status === "done" && (
            <Box
              component="img"
              src={data.image}
              alt={label}
              onClick={() => onPreview && onPreview({ image: data.image, label: subtitle || label, editKey, fileName: data.fileName })}
              sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", cursor: "zoom-in" }}
            />
          )}
        </Box>
        {status === "done" && (
          <Stack direction="row" spacing={0.8}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onEdit(editKey)}
              startIcon={<EditRoundedIcon sx={{ fontSize: "14px !important" }} />}
              sx={{ ...F, flex: 1, borderRadius: "999px", textTransform: "none", fontWeight: 700, fontSize: "0.68rem", color: "#233971", borderColor: "rgba(35,57,113,0.25)", "&:hover": { borderColor: "rgba(35,57,113,0.45)", background: "rgba(35,57,113,0.06)" } }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="contained"
              component="a"
              href={data.image}
              download={data.fileName}
              startIcon={<DownloadRoundedIcon sx={{ fontSize: "14px !important" }} />}
              sx={{ ...F, flex: 1, borderRadius: "999px", textTransform: "none", fontWeight: 700, fontSize: "0.68rem", background: "linear-gradient(135deg,#233971,#2e4fa3)", boxShadow: "0 6px 16px rgba(35,57,113,0.3)" }}
            >
              Download
            </Button>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
});

/* ================================================================ */

export default function AgentMilaPage() {
  const MAX_PRODUK = 10;

  const [filePdf, setFilePdf] = useState(null);
  const [pdfStatus, setPdfStatus] = useState({ type: "", text: "" });

  const [produkFiles, setProdukFiles] = useState([]);
  const [fileFrame, setFileFrame] = useState(null);
  const [frameOn, setFrameOn] = useState(true);

  const [judulProduk, setJudulProduk] = useState("");
  const [judulOn, setJudulOn] = useState(true);
  const [tagline, setTagline] = useState("");
  const [taglineOn, setTaglineOn] = useState(true);
  const [deskripsi, setDeskripsi] = useState("");
  const [deskripsiOn, setDeskripsiOn] = useState(true);
  const [spesifikasi, setSpesifikasi] = useState("");
  const [spesifikasiOn, setSpesifikasiOn] = useState(true);
  const [keypoint1, setKeypoint1] = useState("");
  const [keypoint2, setKeypoint2] = useState("");
  const [keypoint3, setKeypoint3] = useState("");
  const [keypointOn, setKeypointOn] = useState(true);
  const [cara, setCara] = useState("");
  const [caraOn, setCaraOn] = useState(true);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [negativePromptOn, setNegativePromptOn] = useState(true);
  const [subjek, setSubjek] = useState("");
  const [subjekOn, setSubjekOn] = useState(true);
  const [improvement, setImprovement] = useState("");
  const [improvementOn, setImprovementOn] = useState(true);
  const [background, setBackground] = useState("");
  const [backgroundOn, setBackgroundOn] = useState(true);

  const [warnaList, setWarnaList] = useState([]);
  const [warnaOn, setWarnaOn] = useState(false);
  const [warnaInput, setWarnaInput] = useState("");

  const [variantState, setVariantState] = useState(DEFAULT_VARIANT_STATE);
  const [variantSlots, setVariantSlots] = useState({});
  const [warnaSlots, setWarnaSlots] = useState([]);

  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const [editKey, setEditKey] = useState(null);
  const [editInstruksi, setEditInstruksi] = useState("");
  const [editStatus, setEditStatus] = useState({ type: "", text: "" });
  const [editLoading, setEditLoading] = useState(false);
  const editCanvasRef = useRef(null);

  const [lainLainOpen, setLainLainOpen] = useState(false);
  const [resultTab, setResultTab] = useState("utama");
  const [warnaPage, setWarnaPage] = useState(0);

  const [previewItem, setPreviewItem] = useState(null);
  const [previewZoom, setPreviewZoom] = useState(1);
  const closePreview = () => { setPreviewItem(null); setPreviewZoom(1); };

  const produkPreviews = useMemo(() => produkFiles.map((f) => URL.createObjectURL(f)), [produkFiles]);
  useEffect(() => () => produkPreviews.forEach((u) => URL.revokeObjectURL(u)), [produkPreviews]);

  const framePreview = useMemo(() => (fileFrame ? URL.createObjectURL(fileFrame) : ""), [fileFrame]);
  useEffect(() => () => { if (framePreview) URL.revokeObjectURL(framePreview); }, [framePreview]);

  const getAktifVarian = (vs = variantState) => VARIAN.filter((v) => vs[v.num] !== false).slice(0, MAX_VARIAN_GENERATE);
  const totalAktifVarian = (vs = variantState) => getAktifVarian(vs).length;
  const isVarianAktifUntukGenerate = (v, vs = variantState) => getAktifVarian(vs).some((aktif) => aktif.num === v.num);

  const handleProdukFilesSelected = (fileList) => {
    const sisa = MAX_PRODUK - produkFiles.length;
    const dipilih = Array.from(fileList || []).slice(0, sisa);
    if (dipilih.length) setProdukFiles((prev) => [...prev, ...dipilih]);
  };
  const removeProdukFile = (i) => setProdukFiles((prev) => prev.filter((_, idx) => idx !== i));

  const extractFromPdf = async (file) => {
    const fd = new FormData();
    fd.append("pdf", file);
    setPdfStatus({ type: "", text: "Reading PDF with AI…" });
    try {
      const res = await api.post("/studio-iklan/extract-pdf", fd);
      const data = res.data;
      if (data.sukses === false) throw new Error(data.error || "Extraction failed with no details.");

      let terisi = 0;
      const setIfVal = (val, setter, toggleSetter) => {
        const v = (val || "").trim();
        if (!v) return;
        setter(v);
        terisi++;
        if (toggleSetter) toggleSetter(true);
      };
      setIfVal(data.judul_produk, setJudulProduk, setJudulOn);
      setIfVal(data.tagline, setTagline, setTaglineOn);
      setIfVal(data.deskripsi, setDeskripsi, setDeskripsiOn);
      setIfVal(data.spesifikasi, setSpesifikasi, setSpesifikasiOn);
      setIfVal(data.cara_penggunaan, setCara, setCaraOn);
      setIfVal(data.subjek, setSubjek, setSubjekOn);
      setIfVal(data.improvement, setImprovement, setImprovementOn);
      setIfVal(data.background, setBackground, setBackgroundOn);

      const kpMentah = data.key_point_sell;
      const kpList = Array.isArray(kpMentah)
        ? kpMentah.map((s) => String(s).trim()).filter(Boolean)
        : String(kpMentah || "").split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean);
      if (kpList.length) {
        setKeypoint1(kpList[0] || "");
        setKeypoint2(kpList[1] || "");
        setKeypoint3(kpList[2] || "");
        terisi++;
        setKeypointOn(true);
      }

      const warnaDariPdf = (data.warna || "").trim();
      if (warnaDariPdf) {
        const tambahan = warnaDariPdf.split(/\r?\n|,/).map((w) => w.trim()).filter(Boolean);
        setWarnaList((prev) => {
          const merged = [...prev];
          tambahan.forEach((w) => { if (!merged.some((x) => x.toLowerCase() === w.toLowerCase())) merged.push(w); });
          return merged;
        });
        setWarnaOn(true);
        terisi++;
      }

      setPdfStatus({
        type: "ok",
        text: terisi > 0 ? `${terisi} field auto-filled from the PDF. Check & edit before generating.` : "PDF was read but no fields could be auto-filled.",
      });
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message;
      setPdfStatus({ type: "err", text: "Failed to read PDF: " + msg });
    }
  };

  const handlePdfSelected = (fileList) => {
    const f = fileList && fileList[0];
    if (!f) return;
    setFilePdf(f);
    extractFromPdf(f);
  };

  const tambahWarna = () => {
    const nilai = warnaInput.trim();
    if (!nilai) return;
    if (warnaList.some((w) => w.toLowerCase() === nilai.toLowerCase())) { setWarnaInput(""); return; }
    setWarnaList((prev) => [...prev, nilai]);
    setWarnaInput("");
  };
  const hapusWarna = (i) => setWarnaList((prev) => prev.filter((_, idx) => idx !== i));

  const buildFormDataDasar = (gunakanFrame) => {
    const fd = new FormData();
    produkFiles.forEach((f, i) => fd.append("produk_" + (i + 1), f));
    if (gunakanFrame && fileFrame) fd.append("frame", fileFrame);
    fd.append("gunakan_frame", gunakanFrame ? "true" : "false");
    fd.append("deskripsi", deskripsiOn ? deskripsi : "");
    fd.append("spesifikasi", spesifikasiOn ? spesifikasi : "");
    const keypointGabung = keypointOn ? [keypoint1, keypoint2, keypoint3].map((s) => s.trim()).filter(Boolean).join("\n") : "";
    fd.append("key_point_sell", keypointGabung);
    fd.append("judul_produk", judulOn ? judulProduk : "");
    fd.append("tagline", taglineOn ? tagline : "");
    fd.append("cara_penggunaan", caraOn ? cara : "");
    fd.append("subjek", subjekOn ? subjek : "");
    fd.append("improvement", improvementOn ? improvement : "");
    const backgroundFinal = [backgroundOn ? background.trim() : "", KEYPOINT_BACKGROUND_RULE].filter(Boolean).join("\n");
    const negativePromptFinal = [negativePromptOn ? negativePrompt.trim() : "", EXTRA_NEGATIVE_PROMPT].filter(Boolean).join(", ");
    fd.append("background", backgroundFinal);
    fd.append("negative_prompt", negativePromptFinal);
    fd.append("gunakan_negative_prompt", "true");
    return fd;
  };

  const handleGenerate = async () => {
    setStatus({ type: "", text: "" });
    if (produkFiles.length === 0) { setStatus({ type: "err", text: "No product photo selected (minimum 1, maximum 10)." }); return; }
    const gunakanFrame = frameOn;
    if (gunakanFrame && !fileFrame) { setStatus({ type: "err", text: "No reference frame selected (or turn off the Reference Frame toggle)." }); return; }
    const totalAktif = totalAktifVarian();
    const warnaAktif = warnaOn && warnaList.length > 0;
    const keypointAktif = isVarianAktifUntukGenerate(VARIAN.find((v) => v.key === "2-keypoint"));
    const keypointList = [keypoint1, keypoint2, keypoint3].map((s) => s.trim());
    if (keypointAktif && (!keypointOn || keypointList.some((s) => !s))) {
      setStatus({ type: "err", text: "For the Key Point Sell variant, fill in exactly 3 key points first so the AI doesn't add odd points on its own." });
      return;
    }
    if (totalAktif === 0 && !warnaAktif) {
      setStatus({ type: "err", text: "Select at least 1 image variant (toggle on a result card) or add at least 1 color to generate." });
      return;
    }

    const totalSemua = totalAktif + (warnaAktif ? warnaList.length : 0);
    setGenerating(true);
    setStatus({ type: "", text: `Sending to n8n. Generating + AI cleanup running for ${totalSemua} images.` });

    const initialSlots = {};
    VARIAN.forEach((v) => { initialSlots[v.key] = isVarianAktifUntukGenerate(v) ? { status: totalAktif > 0 ? "loading" : "skip" } : { status: "skip" }; });
    setVariantSlots(initialSlots);
    setWarnaSlots(warnaAktif ? warnaList.map((w) => ({ warna: w, status: "loading" })) : []);

    let okTotal = 0;

    try {
      if (totalAktif > 0) {
        const fd = buildFormDataDasar(gunakanFrame);
        VARIAN.forEach((v) => fd.append("varian_" + v.num + "_aktif", isVarianAktifUntukGenerate(v) ? "true" : "false"));
        fd.append("varian_7_aktif", "false");

        const res = await api.post("/studio-iklan/generate", fd);
        const data = res.data;
        const hasil = data.hasil || [];

        const newSlots = { ...initialSlots };
        for (const v of VARIAN) {
          if (!isVarianAktifUntukGenerate(v)) { newSlots[v.key] = { status: "skip" }; continue; }
          const item = hasil.find((h) => h.varian === v.key);
          if (item && item.image) {
            okTotal++;
            let finalImage = item.image;
            try { finalImage = await bersihkanPojokKiriAtas(finalImage); } catch (e) { console.warn("Failed to clean up top-left corner:", e); }
            let badgeError = "";
            if (v.key === "2-keypoint" && CANVAS_OVERLAY_KEYPOINT) {
              let judulBottomY = null;
              try {
                const hasilJudul = await tempelJudulProduk(finalImage, judulOn ? judulProduk : "", taglineOn ? tagline : "");
                finalImage = hasilJudul.image;
                judulBottomY = hasilJudul.bottomY;
              } catch (e) { console.warn("Failed to overlay product title:", e); }
              const sebelumBadge = finalImage;
              try {
                const keypointGabung = keypointOn ? [keypoint1, keypoint2, keypoint3].map((s) => s.trim()).filter(Boolean).join("\n") : "";
                finalImage = await tempelBadgeKeyPoint(sebelumBadge, keypointGabung, judulBottomY);
              } catch (e) {
                console.error("Failed to overlay key point sell badge:", e);
                badgeError = e && e.message ? e.message : "Failed to overlay key point badge.";
                finalImage = sebelumBadge;
              }
            }
            const m = /^data:([^;]+);base64,(.*)$/.exec(finalImage);
            newSlots[v.key] = {
              status: "done",
              image: finalImage,
              fileName: item.fileName || (v.key + ".png"),
              mimeType: m ? m[1] : "image/png",
              base64: m ? m[2] : "",
              badgeError,
            };
          } else {
            newSlots[v.key] = { status: "error", errorMsg: "No image returned from API" };
          }
        }
        setVariantSlots(newSlots);
      }

      if (warnaAktif) {
        const slotsAcc = warnaList.map((w) => ({ warna: w, status: "loading" }));
        setWarnaSlots([...slotsAcc]);
        for (let i = 0; i < warnaList.length; i++) {
          const warna = warnaList[i];
          try {
            const fd = buildFormDataDasar(gunakanFrame);
            VARIAN.forEach((v) => fd.append("varian_" + v.num + "_aktif", "false"));
            fd.append("varian_7_aktif", "true");
            fd.append("warna", warna);

            const res = await api.post("/studio-iklan/generate", fd);
            const data = res.data;
            const item = (data.hasil || []).find((h) => h.varian === "7-warna");
            if (!item || !item.image) throw new Error("No image returned from API");

            okTotal++;
            let finalImage = item.image;
            try { finalImage = await bersihkanPojokKiriAtas(finalImage); } catch (e) { console.warn("Failed to clean up top-left corner:", e); }
            const m = /^data:([^;]+);base64,(.*)$/.exec(finalImage);
            slotsAcc[i] = {
              warna,
              status: "done",
              image: finalImage,
              fileName: item.fileName || ("color-" + warna + ".png"),
              mimeType: m ? m[1] : "image/png",
              base64: m ? m[2] : "",
            };
          } catch (e) {
            console.error('Failed to generate color "' + warna + '":', e);
            slotsAcc[i] = { warna, status: "error", errorMsg: e?.response?.data?.detail || e.message || "Failed" };
          }
          setWarnaSlots([...slotsAcc]);
        }
      }

      setStatus({
        type: "ok",
        text: okTotal === totalSemua ? `Done! ${totalSemua} images generated successfully.` : `Done with ${okTotal} of ${totalSemua} images.`,
      });
    } catch (err) {
      setVariantSlots({});
      setWarnaSlots([]);
      const msg = err?.response?.data?.detail || err.message;
      setStatus({ type: "err", text: "Failed: " + msg + ". Make sure the n8n workflow is active." });
    } finally {
      setGenerating(false);
    }
  };

  const openEditor = useCallback((key) => {
    const data = key.startsWith("7-warna-") ? warnaSlots[Number(key.split("-").pop())] : variantSlots[key];
    if (!data || !data.image) return;
    const img = new Image();
    img.onload = () => {
      setEditKey(key);
      setEditInstruksi("");
      setEditStatus({ type: "", text: "" });
      const canvas = editCanvasRef.current;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
    };
    img.src = data.image;
  }, [warnaSlots, variantSlots]);

  const closeEditor = () => setEditKey(null);

  const handleEditAi = async () => {
    if (!editKey) return;
    const instruksi = editInstruksi.trim();
    if (!instruksi) { setEditStatus({ type: "err", text: "Enter an edit instruction first (e.g. change the background to blue)." }); return; }

    setEditLoading(true);
    setEditStatus({ type: "", text: "Sending image + instruction to AI, this takes about 30-60 seconds…" });
    try {
      const canvas = editCanvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      const fd = new FormData();
      fd.append("gambar", blob, "gambar.png");
      fd.append("instruksi", instruksi);

      const res = await api.post("/studio-iklan/edit-image", fd);
      const data = res.data;
      if (data.sukses === false || !data.image) throw new Error(data.error || "AI did not return an image.");

      const img2 = await new Promise((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = reject;
        el.src = data.image;
      });
      canvas.width = img2.naturalWidth;
      canvas.height = img2.naturalHeight;
      canvas.getContext("2d").drawImage(img2, 0, 0);

      setEditStatus({ type: "ok", text: "Done! Check the result, and press Save Changes once it looks right. You can also send another instruction for further edits." });
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message;
      setEditStatus({ type: "err", text: "Edit failed: " + msg });
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditSave = () => {
    if (!editKey) return;
    const canvas = editCanvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    const m = /^data:([^;]+);base64,(.*)$/.exec(dataUrl);
    const patch = { image: dataUrl, mimeType: m ? m[1] : "image/png", base64: m ? m[2] : "" };
    if (editKey.startsWith("7-warna-")) {
      const idx = Number(editKey.split("-").pop());
      setWarnaSlots((prev) => { const next = [...prev]; next[idx] = { ...next[idx], ...patch }; return next; });
    } else {
      setVariantSlots((prev) => ({ ...prev, [editKey]: { ...prev[editKey], ...patch } }));
    }
    setEditKey(null);
  };

  const totalAktif = totalAktifVarian();
  const warnaAktif = warnaOn && warnaList.length > 0;
  const doneCount = VARIAN.reduce((n, v) => n + (variantSlots[v.key]?.status === "done" ? 1 : 0), 0);
  const warnaDoneCount = warnaSlots.reduce((n, s) => n + (s.status === "done" ? 1 : 0), 0);
  const warnaPageSize = 6;
  const warnaTotalPages = Math.max(1, Math.ceil(warnaList.length / warnaPageSize));
  const visibleWarnaList = warnaList.slice(warnaPage * warnaPageSize, warnaPage * warnaPageSize + warnaPageSize);
  useEffect(() => {
    if (!warnaAktif && resultTab === "warna") setResultTab("utama");
    if (warnaPage > warnaTotalPages - 1) setWarnaPage(Math.max(0, warnaTotalPages - 1));
  }, [warnaAktif, resultTab, warnaPage, warnaTotalPages]);
  const handleVariantToggle = useCallback((num, checked) => {
    setVariantState((prev) => {
      if (!checked) return { ...prev, [num]: false };
      if (totalAktifVarian(prev) >= MAX_VARIAN_GENERATE && prev[num] === false) {
        setStatus({ type: "err", text: `Maximum ${MAX_VARIAN_GENERATE} main variants per generate. Turn off another variant first to swap.` });
        return prev;
      }
      setStatus((current) => current.type === "err" && current.text.includes("Maximum") ? { type: "", text: "" } : current);
      return { ...prev, [num]: true };
    });
  }, []);

  return (
    <Box sx={{ position: "relative", ...F, height: { xs: "auto", lg: "100%" }, display: "flex", flexDirection: "column", overflow: { xs: "visible", lg: "hidden" } }}>
      <FontStyle />

      {/* ============ MODAL EDIT GAMBAR (AI) ============ */}
      {editKey && (
        <Box
          onClick={(e) => { if (e.target === e.currentTarget) closeEditor(); }}
          sx={{ position: "fixed", inset: 0, zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center", p: 2, background: "rgba(2,6,23,0.6)", backdropFilter: "blur(6px)" }}
        >
          <Paper sx={{ ...cardShell, borderRadius: "24px", maxWidth: 900, width: "100%", maxHeight: "92vh", overflow: "auto", display: "flex", flexDirection: "column" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                px: 2.5,
                py: 1.8,
                background: "linear-gradient(180deg,rgba(24,43,88,1) 0%,rgba(27,55,112,0.96) 100%)",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                gap: 1,
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ minWidth: 0 }}>
                <Box sx={{ width: 34, height: 34, borderRadius: "10px", flexShrink: 0, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <AutoFixHighRoundedIcon sx={{ fontSize: 17, color: "rgba(233,196,106,0.95)" }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ ...F, fontWeight: 800, fontSize: "0.95rem", color: "#fff", lineHeight: 1.2 }}>
                    Edit Image with AI
                  </Typography>
                  <Typography sx={{ ...F, fontWeight: 500, fontSize: "0.66rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.2, mt: "2px" }}>
                    Describe the change you want, AI will apply it
                  </Typography>
                </Box>
              </Stack>
              <IconButton size="small" onClick={closeEditor} sx={{ width: 32, height: 32, borderRadius: "9px", flexShrink: 0, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.08)", color: "#fff", "&:hover": { background: "rgba(255,255,255,0.18)" } }}>
                <CloseRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Stack>
            <Box sx={{ p: 2.5, overflow: "hidden" }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Box sx={{ flex: 1, minWidth: 280, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "14px", overflow: "hidden", background: "linear-gradient(135deg,rgba(232,237,248,0.9),rgba(234,240,251,0.9))" }}>
                  <canvas ref={editCanvasRef} style={{ maxWidth: "100%", maxHeight: "60vh", display: "block" }} />
                </Box>
                <Stack spacing={1.2} sx={{ width: { xs: "100%", sm: 240 }, flexShrink: 0 }}>
                  <Typography sx={{ ...F, fontWeight: 700, fontSize: "0.7rem", color: "#64748b" }}>Edit instruction</Typography>
                  <TextField
                    multiline
                    minRows={4}
                    size="small"
                    value={editInstruksi}
                    onChange={(e) => setEditInstruksi(e.target.value)}
                    placeholder="Example: change the background to a blue gradient, remove the shadow on the left, enlarge the product slightly"
                    sx={inputSxDark}
                  />
                  <Button
                    variant="contained"
                    disabled={editLoading}
                    onClick={handleEditAi}
                    startIcon={editLoading ? <CircularProgress size={14} sx={{ color: "#fff" }} /> : <AutoFixHighRoundedIcon />}
                    sx={{ ...F, fontWeight: 700, textTransform: "none", borderRadius: "999px", background: "linear-gradient(135deg,#233971,#2e4fa3)" }}
                  >
                    {editLoading ? "AI is editing…" : "Edit with AI"}
                  </Button>
                </Stack>
              </Stack>
            </Box>

            <Stack direction="row" justifyContent="flex-end" sx={{ px: 1.5, py: 1.2, borderTop: "1px solid rgba(148,163,184,0.18)" }}>
              <Button
                variant="contained"
                onClick={handleEditSave}
                sx={{ ...F, borderRadius: "999px", textTransform: "none", fontWeight: 800, fontSize: "0.76rem", px: 2.2, background: "linear-gradient(135deg,#2a9d8f,#23857a)", boxShadow: "0 6px 16px rgba(42,157,143,0.32)", "&:hover": { background: "linear-gradient(135deg,#23857a,#1c6b62)" } }}
              >
                Save Changes
              </Button>
            </Stack>
          </Paper>
        </Box>
      )}

      {previewItem && (
        <Box
          onClick={(e) => { if (e.target === e.currentTarget) closePreview(); }}
          sx={{ position: "fixed", inset: 0, zIndex: 1320, display: "flex", alignItems: "center", justifyContent: "center", p: 2, background: "rgba(2,6,23,0.65)", backdropFilter: "blur(6px)" }}
        >
          <Paper sx={{ ...cardShell, borderRadius: "24px", width: "min(900px, 94vw)", maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                px: 2.5,
                py: 1.8,
                background: "linear-gradient(180deg,rgba(24,43,88,1) 0%,rgba(27,55,112,0.96) 100%)",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                gap: 1,
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ minWidth: 0 }}>
                <Box sx={{ width: 34, height: 34, borderRadius: "10px", flexShrink: 0, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <PaletteRoundedIcon sx={{ fontSize: 17, color: "rgba(233,196,106,0.95)" }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography noWrap sx={{ ...F, fontWeight: 800, fontSize: "0.95rem", color: "#fff", lineHeight: 1.2 }}>
                    Image Preview
                  </Typography>
                  <Typography noWrap sx={{ ...F, fontWeight: 500, fontSize: "0.66rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.2, mt: "2px" }}>
                    {previewItem.label}
                  </Typography>
                </Box>
              </Stack>
              <IconButton size="small" onClick={closePreview} sx={{ width: 32, height: 32, borderRadius: "9px", flexShrink: 0, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.08)", color: "#fff", "&:hover": { background: "rgba(255,255,255,0.18)" } }}>
                <CloseRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Stack>

            <Box sx={{ p: 2.5, overflow: "auto" }}>
              <Stack spacing={1.2}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ px: 1, py: 0.6, borderRadius: "10px", background: "rgba(232,237,248,0.6)", border: "1px solid rgba(35,57,113,0.1)" }}>
                  <Stack direction="row" spacing={0.6} alignItems="center">
                    <Typography sx={{ ...F, fontSize: "0.72rem", color: "#233971", fontWeight: 700, minWidth: 38, textAlign: "center" }}>
                      {Math.round(previewZoom * 100)}%
                    </Typography>
                    <Button size="small" variant="outlined" onClick={() => setPreviewZoom((v) => Math.max(0.25, parseFloat((v - 0.25).toFixed(2))))} sx={{ ...F, minWidth: 32, px: 0, borderRadius: "8px", fontWeight: 800 }}>−</Button>
                    <Button size="small" variant="outlined" onClick={() => setPreviewZoom(1)} sx={{ ...F, minWidth: 0, px: 1, borderRadius: "8px", fontSize: "0.66rem", fontWeight: 800, textTransform: "none" }}>Reset</Button>
                    <Button size="small" variant="outlined" onClick={() => setPreviewZoom((v) => Math.min(5, parseFloat((v + 0.25).toFixed(2))))} sx={{ ...F, minWidth: 32, px: 0, borderRadius: "8px", fontWeight: 800 }}>+</Button>
                  </Stack>
                </Stack>

                <Box
                  sx={{
                    width: "100%",
                    height: "58vh",
                    minHeight: 260,
                    overflow: "auto",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg,rgba(232,237,248,0.9),rgba(234,240,251,0.9))",
                    border: "1px solid rgba(35,57,113,0.15)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={previewItem.image}
                    alt={previewItem.label}
                    sx={{
                      display: "block",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      transform: `scale(${previewZoom})`,
                      transformOrigin: "center center",
                      transition: "transform 0.15s ease",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              </Stack>
            </Box>

            <Stack direction="row" spacing={1} sx={{ px: 2.5, py: 1.5, borderTop: "1px solid rgba(148,163,184,0.18)" }}>
              <Button
                variant="outlined"
                onClick={() => { const key = previewItem.editKey; closePreview(); openEditor(key); }}
                startIcon={<EditRoundedIcon sx={{ fontSize: "16px !important" }} />}
                sx={{ ...F, flex: 1, borderRadius: "999px", textTransform: "none", fontWeight: 700, color: "#233971", borderColor: "rgba(35,57,113,0.25)", "&:hover": { borderColor: "rgba(35,57,113,0.45)", background: "rgba(35,57,113,0.06)" } }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                component="a"
                href={previewItem.image}
                download={previewItem.fileName}
                startIcon={<DownloadRoundedIcon sx={{ fontSize: "16px !important" }} />}
                sx={{ ...F, flex: 1, borderRadius: "999px", textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg,#233971,#2e4fa3)", boxShadow: "0 6px 16px rgba(35,57,113,0.3)" }}
              >
                Download
              </Button>
            </Stack>
          </Paper>
        </Box>
      )}

      {lainLainOpen && (
        <Box
          onClick={(e) => { if (e.target === e.currentTarget) setLainLainOpen(false); }}
          sx={{ position: "fixed", inset: 0, zIndex: 1250, display: "flex", alignItems: "center", justifyContent: "center", p: 2, background: "rgba(2,6,23,0.45)", backdropFilter: "blur(6px)" }}
        >
          <Paper sx={{ ...cardShell, width: "min(820px, 94vw)", maxHeight: "90vh", overflow: "hidden", borderRadius: "24px", display: "flex", flexDirection: "column" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                px: 2.5,
                py: 1.8,
                background: "linear-gradient(180deg,rgba(24,43,88,1) 0%,rgba(27,55,112,0.96) 100%)",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                gap: 1,
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ minWidth: 0 }}>
                <Box sx={{ width: 34, height: 34, borderRadius: "10px", flexShrink: 0, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TuneRoundedIcon sx={{ fontSize: 17, color: "rgba(233,196,106,0.95)" }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ ...F, fontWeight: 800, fontSize: "0.95rem", color: "#fff", lineHeight: 1.2 }}>
                    Advanced Options
                  </Typography>
                  <Typography noWrap sx={{ ...F, fontWeight: 500, fontSize: "0.66rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.2, mt: "2px" }}>
                    Extra fields stay available without pushing down the main layout
                  </Typography>
                </Box>
              </Stack>
              <IconButton size="small" onClick={() => setLainLainOpen(false)} sx={{ width: 32, height: 32, borderRadius: "9px", flexShrink: 0, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.08)", color: "#fff", "&:hover": { background: "rgba(255,255,255,0.18)" } }}>
                <CloseRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Stack>

            <Box sx={{ p: 1.5, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,minmax(0,1fr))" }, gap: 1.1, overflow: "hidden" }}>
              <ToggleField
                label="How to use"
                value={cara}
                onChange={setCara}
                active={caraOn}
                onActiveChange={setCaraOn}
                textarea
                placeholder="Example: 1) Fill with fruit & water 2) Attach the lid 3) Press the button 2x"
                sx={{ gridColumn: "span 1" }}
                dark
              />
              <ToggleField
                label="Negative prompt"
                value={negativePrompt}
                onChange={setNegativePrompt}
                active={negativePromptOn}
                onActiveChange={setNegativePromptOn}
                textarea
                placeholder="Example: blurry text, watermark, deformed fingers, wrong proportions"
                sx={{ gridColumn: "span 1" }}
                dark
              />
              <ToggleField
                label="Subject / model"
                value={subjek}
                onChange={setSubjek}
                active={subjekOn}
                onActiveChange={setSubjekOn}
                placeholder="Example: young woman in a modern kitchen"
                sx={{ gridColumn: "span 1" }}
                dark
              />
              <ToggleField
                label="Creative improvement"
                value={improvement}
                onChange={setImprovement}
                active={improvementOn}
                onActiveChange={setImprovementOn}
                placeholder="Example: fresh fruit splash, dynamic feel"
                sx={{ gridColumn: "span 1" }}
                dark
              />
              <ToggleField
                label="Background & lighting"
                value={background}
                onChange={setBackground}
                active={backgroundOn}
                onActiveChange={setBackgroundOn}
                placeholder="Example: orange gradient, warm morning light"
                sx={{ gridColumn: "span 1" }}
                dark
              />

              <Box sx={{ ...sectionCardSx, opacity: warnaOn ? 1 : 0.72 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.6}>
                  <FieldLabel label="Color variants" />
                  <Switch size="small" checked={warnaOn} onChange={(e) => setWarnaOn(e.target.checked)} sx={compactSwitchSx} />
                </Stack>
                <Stack direction="row" spacing={0.8}>
                  <TextField
                    size="small"
                    fullWidth
                    value={warnaInput}
                    onChange={(e) => setWarnaInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); tambahWarna(); } }}
                    disabled={!warnaOn}
                    placeholder="Example: black"
                    sx={inputSxDark}
                  />
                  <Button
                    variant="contained"
                    disabled={!warnaOn}
                    onClick={tambahWarna}
                    startIcon={<AddRoundedIcon sx={{ fontSize: "15px !important" }} />}
                    sx={{
                      ...F,
                      flexShrink: 0,
                      borderRadius: "999px",
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: "0.68rem",
                      px: 1.3,
                      color: "#fff",
                      background: "linear-gradient(135deg,#233971,#2e4fa3)",
                      "&.Mui-disabled": { color: "rgba(255,255,255,0.75)", background: "rgba(100,116,139,0.45)" },
                    }}
                  >
                    Add
                  </Button>
                </Stack>
                {warnaList.length > 0 && (
                  <Stack direction="row" flexWrap="wrap" gap={0.6} sx={{ mt: 0.8, maxHeight: 58, overflow: "hidden" }}>
                    {warnaList.map((warna, i) => (
                      <Chip
                        key={warna + i}
                        label={warna}
                        onDelete={() => hapusWarna(i)}
                        size="small"
                        icon={<PaletteRoundedIcon sx={{ fontSize: "13px !important" }} />}
                        sx={{ ...F, height: 22, fontWeight: 700, fontSize: "0.64rem", background: "rgba(35,57,113,0.08)", color: "#233971", border: "1px solid rgba(35,57,113,0.2)" }}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            </Box>

            <Stack direction="row" justifyContent="flex-end" sx={{ px: 1.5, py: 1.2, borderTop: "1px solid rgba(148,163,184,0.18)" }}>
              <Button
                variant="contained"
                onClick={() => setLainLainOpen(false)}
                sx={{ ...F, borderRadius: "999px", textTransform: "none", fontWeight: 800, fontSize: "0.76rem", px: 2.2, background: "linear-gradient(135deg,#2a9d8f,#23857a)", boxShadow: "0 6px 16px rgba(42,157,143,0.32)", "&:hover": { background: "linear-gradient(135deg,#23857a,#1c6b62)" } }}
              >
                Done
              </Button>
            </Stack>
          </Paper>
        </Box>
      )}

      <Card elevation={0} sx={{ ...cardShell, flex: 1, height: { xs: "auto", lg: "100%" }, minHeight: 0, display: "flex", flexDirection: "column", overflow: { xs: "visible", lg: "hidden" } }}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={0} alignItems="stretch" sx={{ flex: 1, minHeight: 0, overflow: { xs: "visible", lg: "hidden" } }}>

          {/* ============ FORM ============ */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: { xs: "visible", lg: "hidden" }, minHeight: 0, borderRight: { lg: "1px solid rgba(148,163,184,0.18)" } }}>
            <CardContent sx={{ p: { xs: 1.4, md: "10px 14px" }, overflow: { xs: "visible", lg: "hidden" }, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflow: { xs: "visible", lg: "hidden" },
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(12,minmax(0,1fr))" },
                  gridAutoRows: "min-content",
                  gap: { xs: 0.9, md: 0.4 },
                  alignContent: { xs: "start", lg: "space-between" },
                  alignItems: "start",
                }}
              >
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <Typography sx={{ ...F, fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#0f172a" }}>
                    Agent Mila
                  </Typography>
                  <Typography noWrap sx={{ ...F, fontSize: "0.6rem", color: "#94a3b8", mt: 0.2 }}>
                    Upload product photos + reference frame, generate ad image variants automatically
                  </Typography>
                </Box>

                <Divider sx={{ gridColumn: "1 / -1", borderColor: "rgba(148,163,184,0.25)" }} />

                <Box sx={{ ...formBlockSx, gridColumn: { xs: "1 / -1", md: "span 6" } }}>
                  <Box sx={{ mb: 0.35 }}>
                    <FieldLabel label="Upload Product PDF" hint="(optional)" />
                  </Box>
                  <UploadBox
                    icon={<PictureAsPdfRoundedIcon />}
                    iconBg="rgba(100,116,139,0.12)"
                    iconColor="#64748b"
                    title={filePdf ? filePdf.name : "Upload product PDF"}
                    subtitle={filePdf ? "Auto-filled · click to change" : "Click to select, form auto-fills"}
                    accept="application/pdf"
                    onFile={handlePdfSelected}
                  />
                </Box>

                <Box sx={{ ...formBlockSx, gridColumn: { xs: "1 / -1", md: "span 6" } }}>
                  <Box sx={{ mb: 0.35 }}>
                    <FieldLabel label="Product Photos" hint={`(max ${MAX_PRODUK})`} />
                  </Box>
                  {produkFiles.length === 0 ? (
                    <UploadBox
                      icon={<CloudUploadIcon />}
                      iconBg="rgba(100,116,139,0.12)"
                      iconColor="#64748b"
                      title="Upload product photos"
                      subtitle="Click or drag & drop · multi-select supported"
                      accept="image/*"
                      multiple
                      onFile={handleProdukFilesSelected}
                    />
                  ) : (
                    <Paper variant="outlined" sx={{ p: 0.75, borderRadius: "12px", borderColor: "rgba(35,57,113,0.25)", background: "rgba(241,245,249,0.9)" }}>
                      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(42px,1fr))", gap: 0.6, maxHeight: 96, overflow: "hidden" }}>
                        {produkPreviews.map((url, i) => (
                          <Box key={i} sx={{ position: "relative", borderRadius: "8px", overflow: "hidden", aspectRatio: "1/1" }}>
                            <Box component="img" src={url} alt={`produk-${i}`} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                            <IconButton
                              size="small"
                              onClick={() => removeProdukFile(i)}
                              sx={{ position: "absolute", top: 2, right: 2, width: 18, height: 18, background: "rgba(0,0,0,0.6)", color: "#fff", "&:hover": { background: "#b45309" }, "& svg": { fontSize: 12 } }}
                            >
                              <CloseRoundedIcon />
                            </IconButton>
                          </Box>
                        ))}
                        {produkFiles.length < MAX_PRODUK && (
                          <Box
                            onClick={() => document.getElementById("siqFileProduk")?.click()}
                            sx={{ aspectRatio: "1/1", borderRadius: "8px", border: "1.5px dashed rgba(148,163,184,0.5)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8", "&:hover": { borderColor: "#233971", color: "#233971" } }}
                          >
                            <AddPhotoAlternateIcon sx={{ fontSize: 18 }} />
                          </Box>
                        )}
                      </Box>
                      <input id="siqFileProduk" type="file" accept="image/*" multiple hidden onChange={(e) => { handleProdukFilesSelected(e.target.files); e.target.value = ""; }} />
                      <Typography sx={{ ...F, fontSize: "0.58rem", color: "#94a3b8", mt: 0.5 }}>{produkFiles.length} / {MAX_PRODUK} photos selected</Typography>
                    </Paper>
                  )}
                </Box>

                <Box sx={{ ...formBlockSx, gridColumn: { xs: "1 / -1", md: "span 6" }, opacity: frameOn ? 1 : 0.6 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.35}>
                    <FieldLabel label="Reference Frame" hint="(ratio/layout)" />
                    <Switch size="small" checked={frameOn} onChange={(e) => setFrameOn(e.target.checked)} sx={compactSwitchSx} />
                  </Stack>
                  <UploadBox
                    icon={<AddPhotoAlternateIcon />}
                    iconBg="rgba(100,116,139,0.12)"
                    iconColor="#64748b"
                    title={fileFrame ? fileFrame.name : "Upload reference frame"}
                    subtitle="Not included in the result"
                    accept="image/*"
                    disabled={!frameOn}
                    onFile={(files) => setFileFrame(files && files[0] ? files[0] : null)}
                  />
                </Box>

                <ToggleField
                  label="Product Title"
                  hint="(large title on the result image, Key Point variant only)"
                  value={judulProduk}
                  onChange={setJudulProduk}
                  active={judulOn}
                  onActiveChange={setJudulOn}
                  placeholder="Example: Eco Brava Fashion Safety Glasses"
                  sx={{ gridColumn: { xs: "1 / -1", md: "span 6" } }}
                  dark
                />

                <ToggleField
                  label="Tagline"
                  hint="(small subtitle below the title)"
                  value={tagline}
                  onChange={setTagline}
                  active={taglineOn}
                  onActiveChange={setTaglineOn}
                  placeholder="Example: Style Meets Safety"
                  sx={{ gridColumn: "1 / -1" }}
                  dark
                />

                <ToggleField
                  label="Product description"
                  value={deskripsi}
                  onChange={setDeskripsi}
                  active={deskripsiOn}
                  onActiveChange={setDeskripsiOn}
                  textarea
                  placeholder="Example: Portable blender for everyday needs, compact design, easy to carry…"
                  sx={{ gridColumn: { xs: "1 / -1", md: "span 6" } }}
                  dark
                />

                <ToggleField
                  label="Specification"
                  value={spesifikasi}
                  onChange={setSpesifikasi}
                  active={spesifikasiOn}
                  onActiveChange={setSpesifikasiOn}
                  textarea
                  placeholder="Example: 500ml capacity, 2000mAh battery, 6 stainless blades, 2-hour charge time"
                  sx={{ gridColumn: { xs: "1 / -1", md: "span 6" } }}
                  dark
                />

                <Box sx={{ ...formBlockSx, gridColumn: "1 / -1", opacity: keypointOn ? 1 : 0.6 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.35}>
                    <FieldLabel label="Key point sell" hint="(3 points)" />
                    <Switch size="small" checked={keypointOn} onChange={(e) => setKeypointOn(e.target.checked)} sx={compactSwitchSx} />
                  </Stack>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3,minmax(0,1fr))" }, gap: 0.6 }}>
                    <TextField size="small" fullWidth value={keypoint1} onChange={(e) => setKeypoint1(e.target.value)} disabled={!keypointOn} placeholder="Point 1: Charge once, blend 15x" sx={inputSxDark} />
                    <TextField size="small" fullWidth value={keypoint2} onChange={(e) => setKeypoint2(e.target.value)} disabled={!keypointOn} placeholder="Point 2: Take it anywhere" sx={inputSxDark} />
                    <TextField size="small" fullWidth value={keypoint3} onChange={(e) => setKeypoint3(e.target.value)} disabled={!keypointOn} placeholder="Point 3: All-day battery life" sx={inputSxDark} />
                  </Box>
                </Box>

                <Box sx={{ ...formBlockSx, gridColumn: "1 / -1" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Box sx={{ minWidth: 0 }}>
                      <FieldLabel label="Advanced options" />
                      <Typography noWrap sx={{ ...F, fontSize: "0.58rem", color: "#94a3b8", mt: 0.2 }}>
                        How to use, negative prompt, subject, background, color variants
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setLainLainOpen(true)}
                      endIcon={<TuneRoundedIcon sx={{ fontSize: "15px !important" }} />}
                      sx={{
                        ...F,
                        flexShrink: 0,
                        borderRadius: "999px",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.66rem",
                        px: 1.6,
                        py: 0.35,
                        color: "#fff",
                        background: "linear-gradient(135deg,#233971,#2e4fa3)",
                        boxShadow: "0 4px 12px rgba(35,57,113,0.28)",
                        "&:hover": { background: "linear-gradient(135deg,#1c2e5c,#233971)", boxShadow: "0 6px 16px rgba(35,57,113,0.38)" },
                      }}
                    >
                      Adjust
                    </Button>
                  </Stack>
                </Box>

              </Box>
              <Box sx={{ flexShrink: 0, pt: 0.6, mt: 0.6, borderTop: "1px solid rgba(148,163,184,0.18)" }}>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={generating}
                  onClick={handleGenerate}
                  startIcon={generating ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <AutoAwesomeIcon />}
                  sx={{ ...F, fontWeight: 700, textTransform: "none", fontSize: "0.85rem", borderRadius: "999px", py: 0.85, background: "linear-gradient(135deg,#2a9d8f,#23857a)", boxShadow: "0 8px 22px rgba(42,157,143,0.32)", "&:hover": { background: "linear-gradient(135deg,#23857a,#1c6b62)", boxShadow: "0 12px 30px rgba(42,157,143,0.42)", transform: "translateY(-2px)" }, "&:disabled": { background: "rgba(148,163,184,0.28)", boxShadow: "none" }, transition: "all 0.25s ease" }}
                >
                  {generating ? "Generating..." : "Generate All"}
                </Button>
              </Box>
            </CardContent>
          </Box>

          {/* ============ HASIL ============ */}
          <Box sx={{ flex: 1.15, display: "flex", flexDirection: "column", overflow: { xs: "visible", lg: "hidden" }, minHeight: { xs: 640, lg: 0 } }}>
            <CardContent sx={{ p: { xs: 1.4, md: "12px 16px" }, overflow: { xs: "visible", lg: "hidden" }, flex: 1, minHeight: { xs: 640, lg: 0 }, display: "flex", flexDirection: "column" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={sectionLabel}>Generated Results</Typography>
                  <Typography noWrap sx={{ ...F, fontSize: "0.6rem", color: "#94a3b8", mt: 0.2 }}>
                    {resultTab === "warna" ? "Product color variants" : "Main ad image variants"}
                  </Typography>
                </Box>
                <Tabs
                  value={resultTab}
                  onChange={(_, value) => setResultTab(value)}
                  sx={{
                    minHeight: 30,
                    p: 0.25,
                    borderRadius: "999px",
                    background: "linear-gradient(135deg,rgba(226,232,240,0.85),rgba(241,245,249,0.92))",
                    border: "1px solid rgba(148,163,184,0.3)",
                    boxShadow: "inset 0 1px 2px rgba(15,23,42,0.05)",
                    "& .MuiTabs-indicator": { display: "none" },
                    "& .MuiTab-root": {
                      ...F,
                      minHeight: 26,
                      minWidth: 0,
                      px: 1.3,
                      py: 0,
                      borderRadius: "999px",
                      textTransform: "none",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      color: "#334155",
                      transition: "all 0.2s ease",
                      "&.Mui-disabled": { color: "rgba(51,65,85,0.4)" },
                      "&:hover:not(.Mui-selected):not(.Mui-disabled)": { color: "#233971", background: "rgba(255,255,255,0.6)" },
                    },
                    "& .Mui-selected": {
                      color: "#fff !important",
                      background: "linear-gradient(135deg,#233971,#2e4fa3)",
                      boxShadow: "0 4px 14px rgba(35,57,113,0.4)",
                    },
                  }}
                >
                  <Tab value="utama" label={`Main ${doneCount}/${totalAktif}`} />
                  <Tab value="warna" disabled={!warnaAktif} label={`Colors ${warnaDoneCount}/${warnaList.length}`} />
                </Tabs>
              </Stack>

              <Divider sx={{ my: 0.8, borderColor: "rgba(148,163,184,0.25)", flexShrink: 0 }} />

              {resultTab === "utama" ? (
                <Box sx={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: { xs: "repeat(2,minmax(0,1fr))", xl: "repeat(3,minmax(0,1fr))" }, gridTemplateRows: { xs: "repeat(3,minmax(0,1fr))", xl: "repeat(2,minmax(0,1fr))" }, gap: 1, overflow: "hidden" }}>
                  {VARIAN.map((v, i) => {
                    const aktif = isVarianAktifUntukGenerate(v);
                    const slot = variantSlots[v.key];
                    const status2 = aktif ? (slot?.status || "idle") : "skip";
                    return (
                      <ResultCard
                        key={v.key}
                        label={v.label}
                        index={i}
                        active={aktif}
                        toggleNum={v.num}
                        onToggleActive={handleVariantToggle}
                        status={status2}
                        data={slot}
                        editKey={v.key}
                        onEdit={openEditor}
                        onPreview={setPreviewItem}
                      />
                    );
                  })}
                </Box>
              ) : (
                <>
                  <Box sx={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: { xs: "repeat(2,minmax(0,1fr))", xl: "repeat(3,minmax(0,1fr))" }, gridTemplateRows: { xs: "repeat(3,minmax(0,1fr))", xl: "repeat(2,minmax(0,1fr))" }, gap: 1, overflow: "hidden" }}>
                    {visibleWarnaList.map((warna, localIndex) => {
                      const i = warnaPage * warnaPageSize + localIndex;
                      const slot = warnaSlots[i];
                      const status2 = slot?.status || "idle";
                      return (
                        <ResultCard
                          key={warna + i}
                          label={`Color ${warna}`}
                          subtitle={`Color: ${warna}`}
                          index={i}
                          active
                          status={status2}
                          data={slot}
                          editKey={"7-warna-" + i}
                          onEdit={openEditor}
                          onPreview={setPreviewItem}
                        />
                      );
                    })}
                  </Box>
                  {warnaTotalPages > 1 && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mt={0.8} sx={{ flexShrink: 0 }}>
                      <Typography sx={{ ...F, fontSize: "0.62rem", color: "#94a3b8", fontWeight: 700 }}>
                        Page {warnaPage + 1} / {warnaTotalPages}
                      </Typography>
                      <Stack direction="row" spacing={0.6}>
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={warnaPage === 0}
                          onClick={() => setWarnaPage((p) => Math.max(0, p - 1))}
                          sx={{ ...F, minWidth: 58, borderRadius: "999px", textTransform: "none", fontWeight: 800, fontSize: "0.66rem", py: 0.25 }}
                        >
                          Prev
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={warnaPage >= warnaTotalPages - 1}
                          onClick={() => setWarnaPage((p) => Math.min(warnaTotalPages - 1, p + 1))}
                          sx={{ ...F, minWidth: 58, borderRadius: "999px", textTransform: "none", fontWeight: 800, fontSize: "0.66rem", py: 0.25 }}
                        >
                          Next
                        </Button>
                      </Stack>
                    </Stack>
                  )}
                </>
              )}
            </CardContent>
          </Box>
        </Stack>
      </Card>

      <Snackbar
        open={!!pdfStatus.text}
        autoHideDuration={pdfStatus.type ? 4000 : null}
        onClose={() => setPdfStatus({ type: "", text: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setPdfStatus({ type: "", text: "" })}
          severity={pdfStatus.type === "err" ? "error" : pdfStatus.type === "ok" ? "success" : "info"}
          variant="filled"
          sx={{ ...F, borderRadius: "12px", fontSize: "0.82rem" }}
        >
          {pdfStatus.text}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!status.text}
        autoHideDuration={status.type ? (status.type === "err" ? 6000 : 4000) : null}
        onClose={() => setStatus({ type: "", text: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setStatus({ type: "", text: "" })}
          severity={status.type === "err" ? "error" : status.type === "ok" ? "success" : "info"}
          variant="filled"
          sx={{ ...F, borderRadius: "12px", fontSize: "0.82rem" }}
        >
          {status.text}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!editStatus.text}
        autoHideDuration={editStatus.type ? (editStatus.type === "err" ? 6000 : 4000) : null}
        onClose={() => setEditStatus({ type: "", text: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setEditStatus({ type: "", text: "" })}
          severity={editStatus.type === "err" ? "error" : editStatus.type === "ok" ? "success" : "info"}
          variant="filled"
          sx={{ ...F, borderRadius: "12px", fontSize: "0.82rem" }}
        >
          {editStatus.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
