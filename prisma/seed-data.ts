import type { EventType, RelationType } from "../src/generated/prisma";
import { resolveThemeBgUrl } from "../src/lib/theme-images";
import { EVENT_OVERLAY_EMOJIS } from "../src/lib/events";

const EVENT_TYPES: EventType[] = [
  "BIRTHDAY",
  "ANNIVERSARY",
  "APOLOGY",
  "SPECIAL",
  "CUSTOM",
];

type QuoteSeed = {
  text: string;
  kind?: "DAILY" | "MILESTONE" | "CELEBRATION";
  dayOffset?: number;
  milestoneDays?: number;
};

export const QUOTE_SEEDS: Record<RelationType, QuoteSeed[]> = {
  GIRLFRIEND_BOYFRIEND: [
    { text: "তোমাকে ভালোবাসা মানে নিজের ভেতরের সবচেয়ে শান্ত জায়গাটায় ফিরে যাওয়া।", dayOffset: 0 },
    { text: "প্রতিটা রাত তোমার কথা ভেবে শেষ হয়, আর প্রতিটা সকাল তোমার অপেক্ষায় শুরু হয়।", dayOffset: 1 },
    { text: "তুমি না থাকলে সময়টা শুধু ঘড়ির কাঁটা, তুমি থাকলে সেটাই হয়ে যায় ভালোবাসা।", dayOffset: 2 },
    { text: "কিছু মানুষের জন্য অপেক্ষা করতে কষ্ট হয় না, কারণ অপেক্ষাটাই তখন ভালোবাসার একটা রূপ হয়ে যায়।", dayOffset: 3 },
    { text: "তোমার হাসি দেখার জন্য আমি আমার সবচেয়ে খারাপ দিনগুলোতেও একটা কারণ খুঁজে নিই।", dayOffset: 4 },
    { text: "আমি জানি না ভালোবাসার সংজ্ঞা কী, কিন্তু জানি — তুমি থাকলে সবকিছু সহজ লাগে।", dayOffset: 5 },
    { text: "তোমার নামটা আমার কাছে শুধু একটা শব্দ না, এটা আমার শান্তির ঠিকানা।", dayOffset: 6 },
    { text: "দূরে থাকলেও মনে হয় তুমি আমার পাশেই আছো, কারণ তুমি আমার ভাবনার প্রতিটা কোণায় ছড়িয়ে আছো।", dayOffset: 7 },
    { text: "কাউন্টডাউনের প্রতিটা সংখ্যা কমছে, কিন্তু তোমার জন্য আমার ভালোবাসাটা প্রতিদিন একটু একটু বাড়ছে।", dayOffset: 8 },
    { text: "তোমাকে ভালোবেসে বুঝেছি, কিছু মানুষ জীবনে আসে না, তারা জীবনটাই হয়ে যায়।", dayOffset: 9 },
    { text: "তোমার নামটা উচ্চারণ করলেই বুকের ভেতর একটা শহর জেগে ওঠে।", dayOffset: 10 },
    { text: "প্রতিটা সেকেন্ড গুনছি, কারণ প্রতিটা সেকেন্ডই তোমার কাছাকাছি যাওয়ার একটা ধাপ।", dayOffset: 11 },
    { text: "তুমি আসার আগেই আমার পৃথিবীটা গুছিয়ে রাখছি, যেন তোমার পা পড়ার জায়গাটা একটুও এলোমেলো না থাকে।", dayOffset: 12 },
    { text: "দূরত্ব শুধু একটা সংখ্যা, কিন্তু তোমাকে ভাবা একটা অভ্যাস — যেটা কখনো কমে না।", dayOffset: 13 },
    { text: "জন্মদিনটা তোমার, কিন্তু অপেক্ষাটা আমাদের দুজনের।", dayOffset: 14 },
    { text: "কিছু মানুষ ক্যালেন্ডারে থাকে না, তারা থাকে বুকের ভেতর — তুমি ঠিক তেমন একজন।", dayOffset: 15 },
    { text: "তোমার জন্মদিনের কাউন্টডাউন দেখে বুঝি, সময়ও মাঝে মাঝে আমার মতোই অস্থির হয়ে যায়।", dayOffset: 16 },
    { text: "তোমার চোখে তাকালে মনে হয়, সব প্রশ্নের উত্তর ওখানেই লুকানো।", dayOffset: 17 },
    { text: "তোমাকে নিয়ে দেখা স্বপ্নগুলো বাস্তবের চেয়েও বেশি সত্যি মনে হয়।", dayOffset: 18 },
    { text: "তুমি আমার সবচেয়ে প্রিয় অপেক্ষা, সবচেয়ে প্রিয় প্রাপ্তি।", dayOffset: 19 },
    { text: "তোমার কণ্ঠ শুনলেই মনে হয়, দিনটা হঠাৎ সুন্দর হয়ে গেল।", dayOffset: 20 },
    { text: "তোমাকে ভালোবেসে আমি শিখেছি, ভালোবাসা মানে অপেক্ষাকেও ভালোবাসা।", dayOffset: 21 },
    { text: "তুমি আমার রোজকার সবচেয়ে শান্ত আশ্রয়।", dayOffset: 22 },
    { text: "তোমার পাশে দাঁড়ালে মনে হয়, এই মুহূর্তটাই যথেষ্ট।", dayOffset: 23 },
    { text: "তোমাকে নিয়ে ভাবলে সময় থেমে যায়, কিন্তু হৃদয় ছুটতে থাকে।", dayOffset: 24 },
    { text: "তুমি আমার জীবনের সেই অধ্যায়, যেটা বারবার পড়তে ইচ্ছা করে।", dayOffset: 25 },
    { text: "তোমার ভালোবাসা আমার কাছে সবচেয়ে নিরাপদ জায়গা।", dayOffset: 26 },
    { text: "তোমাকে কাছে পাওয়ার অপেক্ষাটাও আমার কাছে একটা উৎসব।", dayOffset: 27 },
    { text: "তুমি আমার প্রতিটা দিনের নিঃশব্দ কারণ, যেটা না বললেও বোঝা যায়।", dayOffset: 28 },
    { text: "তোমার জন্মদিনের প্রতিটা বাকি সেকেন্ড আমার কাছে একটা ছোট্ট উপহারের মতো।", dayOffset: 29 },
    { text: "আর মাত্র এক মাস — তোমার কাছে যাওয়ার প্রতিটা দিন আমার কাছে বিশেষ।", kind: "MILESTONE", milestoneDays: 30 },
    { text: "তোমার জন্মদিনের অপেক্ষায় প্রতিটা রাত একটু কম লম্বা লাগে।", kind: "MILESTONE", milestoneDays: 7 },
    { text: "আর তিন দিন — হৃদয়টা যেন গান গাইতে চায়।", kind: "MILESTONE", milestoneDays: 3 },
    { text: "আগামীকাল তোমার দিন — আজ রাতটা যেন কখনো শেষ না হয়।", kind: "MILESTONE", milestoneDays: 1 },
    { text: "শুভ জন্মদিন, প্রিয়তম! আজ তোমার দিন — আমার সবচেয়ে সুন্দর দিন।", kind: "CELEBRATION" },
    { text: "জন্মদিনের শুভেচ্ছা! তুমি আমার জীবনের সবচেয়ে বড় উপহার।", kind: "CELEBRATION" },
  ],
  BEST_FRIEND: [
    { text: "তুই আমার লাইফের সবচেয়ে পাগলামির সাক্ষী।", dayOffset: 0 },
    { text: "তোর সাথে ঝগড়া করাও একটা এন্টারটেইনমেন্ট।", dayOffset: 1 },
    { text: "তুই থাকলে বোরিং দিনও মজার হয়ে যায়।", dayOffset: 2 },
    { text: "তোকে ছাড়া কোনো প্ল্যানই ঠিক জমে না।", dayOffset: 3 },
    { text: "তুই আমার সবচেয়ে বিশ্বস্ত বিরক্তিকর মানুষ।", dayOffset: 4 },
    { text: "তোর সাথে কাটানো প্রতিটা মুহূর্তই একটা গল্প।", dayOffset: 5 },
    { text: "তুই জানিস আমার সব পাগলামির হিসাব।", dayOffset: 6 },
    { text: "তোর হাসির আওয়াজেই আমার মুড ঠিক হয়ে যায়।", dayOffset: 7 },
    { text: "তুই আমার লাইফের সবচেয়ে ভরসার নাম, যদিও সবসময় ফাজলামি করিস।", dayOffset: 8 },
    { text: "জন্মদিনে তোকে যত ক্ষ্যাপাই, ভেতরে ভেতরে তত ভালোবাসি।", dayOffset: 9 },
    { text: "তোর সাথে থাকলে কোনো এক্সপ্লেনেশন লাগে না।", dayOffset: 10 },
    { text: "তুই আমার সবচেয়ে পুরনো আর সবচেয়ে আপন পাগল।", dayOffset: 11 },
    { text: "তোর প্রতিটা পাগলামির পেছনে আমি থাকবোই।", dayOffset: 12 },
    { text: "তুই আমার লাইফের পার্মানেন্ট মেম্বার, এটা ফিক্সড।", dayOffset: 13 },
    { text: "জন্মদিনের কাউন্টডাউনেও তোকে নিয়ে এত হাসাহাসি করতে পারি, এটাই তো বন্ধুত্ব।", dayOffset: 14 },
    { text: "তোর সাথে চুপচাপ বসে থাকাটাও আমার কাছে মজার।", dayOffset: 15 },
    { text: "তুই আমার সিক্রেট কিপার আর সবচেয়ে বড় গসিপ পার্টনার, দুটোই।", dayOffset: 16 },
    { text: "তোকে রাগাতে যত ভালো লাগে, তোর পাশে থাকতে তার চেয়েও বেশি ভালো লাগে।", dayOffset: 17 },
    { text: "তুই আমার লাইফের সেই ক্যারেক্টার, যাকে স্ক্রিপ্ট থেকে কখনো কাটা যাবে না।", dayOffset: 18 },
    { text: "তোর জন্মদিন মানে আমার জন্যও একটা সেলিব্রেশনের অজুহাত।", dayOffset: 19 },
    { text: "এক মাস পর তোর পাগলামি আবার শুরু — অপেক্ষায় আছি!", kind: "MILESTONE", milestoneDays: 30 },
    { text: "সাত দিন পর তোর জন্মদিন — কেকের হিসাব শুরু!", kind: "MILESTONE", milestoneDays: 7 },
    { text: "তিন দিন পর তোকে ক্ষ্যাপানোর নতুন সুযোগ!", kind: "MILESTONE", milestoneDays: 3 },
    { text: "আগামীকাল তোর দিন — আজ রাতটা পার্টি প্ল্যান করি!", kind: "MILESTONE", milestoneDays: 1 },
    { text: "শুভ জন্মদিন, বেস্টি! আজ তোকে যত ক্ষ্যাপাই, ভালোবাসাও তত!", kind: "CELEBRATION" },
  ],
  CLOSE_FRIEND: [
    { text: "তোমার পাশে থাকলে নিজেকে একা মনে হয় না।", dayOffset: 0 },
    { text: "তুমি এমন একজন, যাকে সব বলা যায় বিনা দ্বিধায়।", dayOffset: 1 },
    { text: "তোমার উপস্থিতিই অনেক সময় যথেষ্ট স্বস্তি দেয়।", dayOffset: 2 },
    { text: "তুমি আমার জীবনের শান্ত আর ভরসার একটা জায়গা।", dayOffset: 3 },
    { text: "তোমার সাথে কথা বললে মন হালকা হয়ে যায়।", dayOffset: 4 },
    { text: "তুমি সেই মানুষ, যাকে কখনো হারাতে চাই না।", dayOffset: 5 },
    { text: "তোমার পরামর্শ সবসময় মন থেকেই আসে।", dayOffset: 6 },
    { text: "তোমার বন্ধুত্ব আমার জীবনের একটা বড় পাওয়া।", dayOffset: 7 },
    { text: "তুমি পাশে থাকলে কঠিন সময়ও সহজ লাগে।", dayOffset: 8 },
    { text: "তোমার সাথে কাটানো সময়গুলো সত্যিই মূল্যবান।", dayOffset: 9 },
    { text: "তুমি এমন একজন বন্ধু, যাকে ব্যাখ্যা না করেই বোঝা যায়।", dayOffset: 10 },
    { text: "তোমার ভরসাটা আমার কাছে অনেক বড় একটা শক্তি।", dayOffset: 11 },
    { text: "তুমি জানো কখন কথা বলতে হয়, কখন শুধু পাশে থাকতে হয়।", dayOffset: 12 },
    { text: "তোমার সাথে বন্ধুত্বটা সময়ের সাথে আরও গভীর হয়েছে।", dayOffset: 13 },
    { text: "তোমার জন্মদিনে শুধু একটাই কথা, তুমি এমনই থেকো সবসময়।", dayOffset: 14 },
    { text: "এক মাস পর তোমার দিন — পাশে থাকার অপেক্ষায় আছি।", kind: "MILESTONE", milestoneDays: 30 },
    { text: "সাত দিন বাকি — তোমার জন্মদিনের উৎসব শুরু হতে চলেছে।", kind: "MILESTONE", milestoneDays: 7 },
    { text: "তিন দিন পর তোমার বিশেষ দিন — মনটা উৎসাহে ভরে গেছে।", kind: "MILESTONE", milestoneDays: 3 },
    { text: "আগামীকাল তোমার দিন — আজ রাতটা বিশেষ মনে হচ্ছে।", kind: "MILESTONE", milestoneDays: 1 },
    { text: "শুভ জন্মদিন! তুমি এমনই থেকো — আমার ভরসার মানুষ।", kind: "CELEBRATION" },
  ],
  FAMILY: [
    { text: "তোমার ভালোবাসাই আমার সবচেয়ে বড় শক্তি।", dayOffset: 0 },
    { text: "তুমি আছো বলেই অনেক কিছু সহজ মনে হয়।", dayOffset: 1 },
    { text: "তোমার দোয়া আর ভালোবাসা আমার পথচলার সবচেয়ে বড় সম্বল।", dayOffset: 2 },
    { text: "তোমার হাসিমুখ দেখাই আমার সবচেয়ে বড় চাওয়া।", dayOffset: 3 },
    { text: "তুমি ছিলে বলেই আজকের আমি হতে পেরেছি।", dayOffset: 4 },
    { text: "তোমার ছায়াতেই আমার সবচেয়ে নিরাপদ অনুভূতি।", dayOffset: 5 },
    { text: "তোমাকে খুশি রাখা আমার সবচেয়ে বড় দায়িত্ব আর ভালোবাসা।", dayOffset: 6 },
    { text: "তোমার পাশে থাকলেই মনে হয় সব ঠিক আছে।", dayOffset: 7 },
    { text: "তোমার আশীর্বাদই আমার সবচেয়ে বড় পুঁজি।", dayOffset: 8 },
    { text: "আজকের দিনে শুধু একটাই চাওয়া, তুমি সবসময় সুস্থ আর খুশি থাকো।", dayOffset: 9 },
    { text: "তোমার পরিশ্রম আর ভালোবাসার ঋণ কখনো শোধ হবার নয়।", dayOffset: 10 },
    { text: "তুমি আমার শেকড়, আর শেকড় ছাড়া কোনো গাছ দাঁড়াতে পারে না।", dayOffset: 11 },
    { text: "তোমার চোখের ভাষাতেই আমি সবচেয়ে বেশি ভরসা খুঁজে পাই।", dayOffset: 12 },
    { text: "তোমার উপস্থিতি মানেই আমার কাছে নিরাপত্তা।", dayOffset: 13 },
    { text: "জন্মদিনে শুধু এটাই বলতে চাই, তোমাকে অনেক ভালোবাসি।", dayOffset: 14 },
    { text: "এক মাস পর তোমার বিশেষ দিন — দোয়া করি সুস্থ থাকবে।", kind: "MILESTONE", milestoneDays: 30 },
    { text: "সাত দিন পর তোমার জন্মদিন — আশীর্বাদে ভরা দিন।", kind: "MILESTONE", milestoneDays: 7 },
    { text: "তিন দিন বাকি — তোমার জন্য বিশেষ প্রস্তুতি চলছে।", kind: "MILESTONE", milestoneDays: 3 },
    { text: "আগামীকাল তোমার দিন — শ্রদ্ধা ও ভালোবাসায় ভরা।", kind: "MILESTONE", milestoneDays: 1 },
    { text: "শুভ জন্মদিন! আপনাকে অনেক শুভেচ্ছা ও ভালোবাসা।", kind: "CELEBRATION" },
  ],
  CRUSH: [
    { text: "তোমার নামটা মনে এলেই একটু লজ্জা লাগে, একটু ভালোও লাগে।", dayOffset: 0 },
    { text: "তোমাকে দেখলে কথা গুছিয়ে বলতে ভুলে যাই।", dayOffset: 1 },
    { text: "তোমার হাসিটা মাথা থেকে সহজে যায় না।", dayOffset: 2 },
    { text: "তোমার সাথে কথা বলতে ইচ্ছা করে, কিন্তু সাহস হয় না।", dayOffset: 3 },
    { text: "তোমাকে নিয়ে ভাবাটা একটা মিষ্টি অভ্যাস হয়ে গেছে।", dayOffset: 4 },
    { text: "তোমার প্রতিটা মেসেজে একটু বেশিই খুশি হই।", dayOffset: 5 },
    { text: "তোমার আশেপাশে থাকলে নিজেকে অন্যরকম লাগে।", dayOffset: 6 },
    { text: "তোমাকে নিয়ে ভাবনাগুলো লুকিয়ে রাখতেই বেশি ভালো লাগে।", dayOffset: 7 },
    { text: "তোমার দিনটা ভালো কাটুক, এই ছোট্ট চাওয়াটা প্রতিদিনই থাকে।", dayOffset: 8 },
    { text: "তোমাকে নিয়ে ভাবাটাই আজকাল সবচেয়ে প্রিয় কাজ।", dayOffset: 9 },
    { text: "তোমার নাম স্ক্রিনে ভেসে উঠলেই হঠাৎ হার্টবিট বেড়ে যায়।", dayOffset: 10 },
    { text: "তোমাকে দেখার একটা সুযোগের জন্য সারাদিন অপেক্ষা করি।", dayOffset: 11 },
    { text: "তোমার প্রতি এই টানটা ঠিক কী, এখনো বুঝে উঠতে পারিনি।", dayOffset: 12 },
    { text: "তোমাকে নিয়ে ভাবনাগুলো খুব সাধারণ, কিন্তু খুব আপন।", dayOffset: 13 },
    { text: "তোমার জন্মদিনে শুধু এটুকুই বলতে চাই, তুমি ভালো থেকো, খুব ভালো।", dayOffset: 14 },
    { text: "এক মাস পর তোমার দিন — মনটা একটু বেশি উৎসুক।", kind: "MILESTONE", milestoneDays: 30 },
    { text: "সাত দিন বাকি — হৃদয়টা একটু দ্রুত ধড়ফড় করে।", kind: "MILESTONE", milestoneDays: 7 },
    { text: "তিন দিন পর তোমার বিশেষ দিন — একটু বেশি উৎকণ্ঠা।", kind: "MILESTONE", milestoneDays: 3 },
    { text: "আগামীকাল তোমার দিন — শুভকামনা জানাতে চাই।", kind: "MILESTONE", milestoneDays: 1 },
    { text: "শুভ জন্মদিন! তুমি ভালো থেকো, খুব ভালো।", kind: "CELEBRATION" },
  ],
  CUSTOM: [
    { text: "তোমার জন্মদিনের অপেক্ষায় প্রতিটা দিন বিশেষ।", dayOffset: 0 },
    { text: "তোমার জন্য গণনা করছি প্রতিটা সেকেন্ড।", dayOffset: 1 },
    { text: "তোমার দিনটা কাছে এলেই মন ভালো হয়ে যায়।", dayOffset: 2 },
    { text: "তোমার জন্য তৈরি এই বিশেষ কাউন্টডাউন।", dayOffset: 3 },
    { text: "তোমার জন্মদিনের উৎসব শুরু হতে চলেছে।", kind: "MILESTONE", milestoneDays: 7 },
    { text: "শুভ জন্মদিন! তোমার দিনটা আনন্দময় হোক।", kind: "CELEBRATION" },
  ],
};

type ThemePalette = {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  gradient: string;
};

const ROMANTIC_PALETTES: ThemePalette[] = [
  { primary: "#ec4899", secondary: "#be185d", accent: "#fbbf24", text: "#fff5f7", gradient: "linear-gradient(135deg, #fce7f3 0%, #ec4899 40%, #831843 100%)" },
  { primary: "#f43f5e", secondary: "#9f1239", accent: "#fcd34d", text: "#fff1f2", gradient: "linear-gradient(160deg, #fda4af 0%, #e11d48 50%, #4c0519 100%)" },
  { primary: "#db2777", secondary: "#701a75", accent: "#fde68a", text: "#fdf2f8", gradient: "linear-gradient(135deg, #fbcfe8 0%, #c026d3 45%, #581c87 100%)" },
  { primary: "#e879f9", secondary: "#a21caf", accent: "#f9a8d4", text: "#faf5ff", gradient: "linear-gradient(145deg, #f5d0fe 0%, #d946ef 50%, #701a75 100%)" },
  { primary: "#f472b6", secondary: "#9d174d", accent: "#fef08a", text: "#ffffff", gradient: "linear-gradient(120deg, #fbcfe8 0%, #f472b6 40%, #831843 100%)" },
  { primary: "#fb7185", secondary: "#be123c", accent: "#fde047", text: "#fff1f2", gradient: "linear-gradient(135deg, #fecdd3 0%, #e11d48 55%, #881337 100%)" },
  { primary: "#f9a8d4", secondary: "#be185d", accent: "#fff7ed", text: "#500724", gradient: "linear-gradient(180deg, #fce7f3 0%, #f472b6 60%, #9d174d 100%)" },
];

const PLAYFUL_PALETTES: ThemePalette[] = [
  { primary: "#f59e0b", secondary: "#ea580c", accent: "#14b8a6", text: "#fffbeb", gradient: "linear-gradient(135deg, #fde68a 0%, #f59e0b 45%, #c2410c 100%)" },
  { primary: "#fbbf24", secondary: "#d97706", accent: "#2dd4bf", text: "#ffffff", gradient: "linear-gradient(145deg, #fef08a 0%, #f97316 50%, #0d9488 100%)" },
  { primary: "#fb923c", secondary: "#c2410c", accent: "#38bdf8", text: "#fff7ed", gradient: "linear-gradient(120deg, #fed7aa 0%, #ea580c 55%, #0369a1 100%)" },
  { primary: "#facc15", secondary: "#ca8a04", accent: "#22d3ee", text: "#422006", gradient: "linear-gradient(135deg, #fef9c3 0%, #eab308 50%, #0891b2 100%)" },
  { primary: "#f97316", secondary: "#9a3412", accent: "#4ade80", text: "#ffffff", gradient: "linear-gradient(160deg, #ffedd5 0%, #f97316 45%, #166534 100%)" },
  { primary: "#eab308", secondary: "#a16207", accent: "#06b6d4", text: "#fefce8", gradient: "linear-gradient(135deg, #fef08a 0%, #ca8a04 50%, #0e7490 100%)" },
  { primary: "#f59e0b", secondary: "#b45309", accent: "#a78bfa", text: "#ffffff", gradient: "linear-gradient(140deg, #fde68a 0%, #d97706 40%, #7c3aed 100%)" },
];

const WARM_PALETTES: ThemePalette[] = [
  { primary: "#22c55e", secondary: "#15803d", accent: "#d6d3d1", text: "#f0fdf4", gradient: "linear-gradient(135deg, #bbf7d0 0%, #16a34a 50%, #365314 100%)" },
  { primary: "#4ade80", secondary: "#166534", accent: "#a8a29e", text: "#ffffff", gradient: "linear-gradient(145deg, #dcfce7 0%, #22c55e 45%, #3f6212 100%)" },
  { primary: "#65a30d", secondary: "#3f6212", accent: "#d6d3d1", text: "#f7fee7", gradient: "linear-gradient(120deg, #ecfccb 0%, #65a30d 55%, #44403c 100%)" },
  { primary: "#10b981", secondary: "#047857", accent: "#e7e5e4", text: "#ecfdf5", gradient: "linear-gradient(135deg, #a7f3d0 0%, #059669 50%, #1c1917 100%)" },
  { primary: "#84cc16", secondary: "#4d7c0f", accent: "#a8a29e", text: "#ffffff", gradient: "linear-gradient(160deg, #d9f99d 0%, #65a30d 50%, #57534e 100%)" },
  { primary: "#16a34a", secondary: "#14532d", accent: "#d4d4d8", text: "#f0fdf4", gradient: "linear-gradient(135deg, #86efac 0%, #15803d 55%, #292524 100%)" },
  { primary: "#34d399", secondary: "#065f46", accent: "#e7e5e4", text: "#ffffff", gradient: "linear-gradient(140deg, #a7f3d0 0%, #10b981 45%, #44403c 100%)" },
];

const FAMILY_PALETTES: ThemePalette[] = [
  { primary: "#1e3a5f", secondary: "#0f172a", accent: "#d4a574", text: "#f8fafc", gradient: "linear-gradient(135deg, #1e40af 0%, #1e3a5f 50%, #0f172a 100%)" },
  { primary: "#334155", secondary: "#0f172a", accent: "#fbbf24", text: "#f1f5f9", gradient: "linear-gradient(145deg, #475569 0%, #1e293b 55%, #020617 100%)" },
  { primary: "#1d4ed8", secondary: "#172554", accent: "#fcd34d", text: "#eff6ff", gradient: "linear-gradient(120deg, #3b82f6 0%, #1e3a8a 50%, #0f172a 100%)" },
  { primary: "#0f766e", secondary: "#134e4a", accent: "#fde68a", text: "#f0fdfa", gradient: "linear-gradient(135deg, #14b8a6 0%, #0f766e 50%, #042f2e 100%)" },
  { primary: "#44403c", secondary: "#1c1917", accent: "#f59e0b", text: "#fafaf9", gradient: "linear-gradient(160deg, #78716c 0%, #44403c 45%, #1c1917 100%)" },
  { primary: "#1e40af", secondary: "#1e1b4b", accent: "#eab308", text: "#ffffff", gradient: "linear-gradient(135deg, #60a5fa 0%, #1d4ed8 50%, #312e81 100%)" },
  { primary: "#0369a1", secondary: "#0c4a6e", accent: "#fbbf24", text: "#f0f9ff", gradient: "linear-gradient(140deg, #38bdf8 0%, #0369a1 55%, #082f49 100%)" },
];

const DREAMY_PALETTES: ThemePalette[] = [
  { primary: "#c084fc", secondary: "#7e22ce", accent: "#fbcfe8", text: "#faf5ff", gradient: "linear-gradient(135deg, #e9d5ff 0%, #a855f7 50%, #581c87 100%)" },
  { primary: "#f0abfc", secondary: "#a21caf", accent: "#ddd6fe", text: "#fdf4ff", gradient: "linear-gradient(145deg, #f5d0fe 0%, #d946ef 45%, #6b21a8 100%)" },
  { primary: "#e879f9", secondary: "#86198f", accent: "#bfdbfe", text: "#ffffff", gradient: "linear-gradient(120deg, #fae8ff 0%, #c026d3 50%, #1e3a8a 100%)" },
  { primary: "#d8b4fe", secondary: "#7c3aed", accent: "#fecdd3", text: "#faf5ff", gradient: "linear-gradient(160deg, #ede9fe 0%, #8b5cf6 55%, #be185d 100%)" },
  { primary: "#a78bfa", secondary: "#5b21b6", accent: "#fce7f3", text: "#f5f3ff", gradient: "linear-gradient(135deg, #c4b5fd 0%, #7c3aed 50%, #831843 100%)" },
  { primary: "#f472b6", secondary: "#9333ea", accent: "#e0e7ff", text: "#ffffff", gradient: "linear-gradient(140deg, #fbcfe8 0%, #a855f7 45%, #3730a3 100%)" },
  { primary: "#c026d3", secondary: "#6b21a8", accent: "#fda4af", text: "#fdf4ff", gradient: "linear-gradient(135deg, #f0abfc 0%, #9333ea 50%, #9f1239 100%)" },
];

const CUSTOM_PALETTES: ThemePalette[] = [
  { primary: "#6366f1", secondary: "#4338ca", accent: "#f472b6", text: "#eef2ff", gradient: "linear-gradient(135deg, #a5b4fc 0%, #6366f1 50%, #312e81 100%)" },
  { primary: "#0ea5e9", secondary: "#0369a1", accent: "#f97316", text: "#f0f9ff", gradient: "linear-gradient(145deg, #7dd3fc 0%, #0284c7 50%, #9a3412 100%)" },
  { primary: "#8b5cf6", secondary: "#6d28d9", accent: "#34d399", text: "#ffffff", gradient: "linear-gradient(120deg, #c4b5fd 0%, #7c3aed 55%, #047857 100%)" },
  { primary: "#14b8a6", secondary: "#0f766e", accent: "#fbbf24", text: "#f0fdfa", gradient: "linear-gradient(135deg, #5eead4 0%, #0d9488 50%, #b45309 100%)" },
  { primary: "#f43f5e", secondary: "#be123c", accent: "#818cf8", text: "#fff1f2", gradient: "linear-gradient(160deg, #fda4af 0%, #e11d48 45%, #4338ca 100%)" },
  { primary: "#64748b", secondary: "#334155", accent: "#fbbf24", text: "#f8fafc", gradient: "linear-gradient(135deg, #94a3b8 0%, #475569 50%, #1e293b 100%)" },
  { primary: "#059669", secondary: "#065f46", accent: "#fcd34d", text: "#ecfdf5", gradient: "linear-gradient(140deg, #6ee7b7 0%, #059669 55%, #78350f 100%)" },
];

const PALETTE_MAP: Record<RelationType, ThemePalette[]> = {
  GIRLFRIEND_BOYFRIEND: ROMANTIC_PALETTES,
  BEST_FRIEND: PLAYFUL_PALETTES,
  CLOSE_FRIEND: WARM_PALETTES,
  FAMILY: FAMILY_PALETTES,
  CRUSH: DREAMY_PALETTES,
  CUSTOM: CUSTOM_PALETTES,
};

const MILESTONE_GRADIENTS: Record<number, string> = {
  30: "linear-gradient(135deg, #fef08a 0%, #f59e0b 40%, #dc2626 100%)",
  7: "linear-gradient(135deg, #fda4af 0%, #f43f5e 50%, #be123c 100%)",
  3: "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 50%, #6d28d9 100%)",
  1: "linear-gradient(135deg, #fde68a 0%, #fbbf24 30%, #f97316 70%, #ef4444 100%)",
};

const CELEBRATION_GRADIENT =
  "linear-gradient(135deg, #fef08a 0%, #f472b6 25%, #a855f7 50%, #38bdf8 75%, #4ade80 100%)";

export function buildThemeSeeds() {
  const themes: Array<{
    relationType: RelationType;
    eventType: EventType;
    name: string;
    colors: ThemePalette;
    bgImageUrl: string;
    overlayEmoji: string;
    kind: "DAILY" | "MILESTONE" | "CELEBRATION";
    milestoneDays?: number;
    sortOrder: number;
    animationType: string;
  }> = [];

  for (const eventType of EVENT_TYPES) {
    const overlayEmoji = EVENT_OVERLAY_EMOJIS[eventType].join(" ");

    for (const [relationType, palettes] of Object.entries(PALETTE_MAP) as [
      RelationType,
      ThemePalette[],
    ][]) {
      palettes.forEach((colors, i) => {
        themes.push({
          relationType,
          eventType,
          name: `${eventType} ${relationType} Daily ${i + 1}`,
          colors,
          bgImageUrl: resolveThemeBgUrl(relationType, "DAILY", i),
          overlayEmoji,
          kind: "DAILY",
          sortOrder: i,
          animationType: ["fade", "float", "pulse"][i % 3],
        });
      });

      for (const days of [30, 7, 3, 1] as const) {
        const base = palettes[0];
        themes.push({
          relationType,
          eventType,
          name: `${eventType} ${relationType} Milestone ${days}d`,
          colors: {
            ...base,
            gradient: MILESTONE_GRADIENTS[days],
            accent: "#ffffff",
          },
          bgImageUrl: resolveThemeBgUrl(
            relationType,
            "MILESTONE",
            0,
            days,
          ),
          overlayEmoji,
          kind: "MILESTONE",
          milestoneDays: days,
          sortOrder: 100 + days,
          animationType: "pulse",
        });
      }

      themes.push({
        relationType,
        eventType,
        name: `${eventType} ${relationType} Celebration`,
        colors: {
          primary: "#fbbf24",
          secondary: "#ec4899",
          accent: "#ffffff",
          text: "#ffffff",
          gradient: CELEBRATION_GRADIENT,
        },
        bgImageUrl: resolveThemeBgUrl(relationType, "CELEBRATION"),
        overlayEmoji,
        kind: "CELEBRATION",
        sortOrder: 200,
        animationType: "confetti",
      });
    }
  }

  return themes;
}
