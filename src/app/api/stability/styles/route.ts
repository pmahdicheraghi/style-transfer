import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json(STYLES);
}

const STYLES = [
    {
        "title": "Pixel Art",
        "prompt": { "init_image_mode": "IMAGE_STRENGTH", "image_strength": 0.6, "samples": 1, "steps": 50, "cfg_scale": 9, "text_prompts[0][text]": "pixel art", "text_prompts[0][weight]": 1 },
        "url": "/images/pixel-art.png"

    },
    {
        "title": "5 year old kid",
        "prompt": { "init_image_mode": "IMAGE_STRENGTH", "image_strength": 0.5, "samples": 1, "steps": 50, "cfg_scale": 10, "style_preset": "photographic", "text_prompts[0][text]": "5 year old person", "text_prompts[0][weight]": 1 },
        "url": "/images/5-year-old.png"
    },
    {
        "title": "50 year old person",
        "prompt": { "init_image_mode": "IMAGE_STRENGTH", "image_strength": 0.5, "samples": 1, "steps": 50, "cfg_scale": 10, "style_preset": "photographic", "text_prompts[0][text]": "50 year old person", "text_prompts[0][weight]": 1 },
        "url": "/images/50-year-old.png"
    },
    {
        "title": "Digital Art",
        "prompt": { "init_image_mode": "IMAGE_STRENGTH", "image_strength": 0.6, "samples": 1, "steps": 50, "cfg_scale": 12, "style_preset": "digital-art", "text_prompts[0][text]": "high quality", "text_prompts[0][weight]": 1 },
        "url": "/images/digital-art.png"
    },
    {
        "title": "Comic Book",
        "prompt": { "init_image_mode": "IMAGE_STRENGTH", "image_strength": 0.6, "samples": 1, "steps": 50, "cfg_scale": 12, "style_preset": "comic-book", "text_prompts[0][text]": "high quality", "text_prompts[0][weight]": 1 },
        "url": "/images/comic-book.png"
    },
    {
        "title": "Fantasy Art",
        "prompt": { "init_image_mode": "IMAGE_STRENGTH", "image_strength": 0.6, "samples": 1, "steps": 50, "cfg_scale": 12, "style_preset": "fantasy-art", "text_prompts[0][text]": "high quality", "text_prompts[0][weight]": 1 },
        "url": "/images/fantasy-art.png"
    },
    {
        "title": "Line Art",
        "prompt": { "init_image_mode": "IMAGE_STRENGTH", "image_strength": 0.6, "samples": 1, "steps": 50, "cfg_scale": 9, "style_preset": "line-art", "text_prompts[0][text]": "high quality", "text_prompts[0][weight]": 1 },
        "url": "/images/line-art.png"
    },
]