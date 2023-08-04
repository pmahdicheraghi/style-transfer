import fs from 'fs'
import { NextResponse } from 'next/server'

const engineId = 'stable-diffusion-xl-1024-v1-0'
const apiHost = process.env.API_HOST ?? 'https://api.stability.ai'
const apiKey = process.env.STABILITY_API_KEY

if (!apiKey) throw new Error('Missing Stability API key.')

export async function POST(request: Request) {
    const res = await request.json()
    const img = res.image
    const style = res.style

    const formData = new FormData()
    formData.append('init_image', await (await fetch(img)).blob())
    formData.append('init_image_mode', 'IMAGE_STRENGTH')
    formData.append('image_strength', "0.30")
    formData.append('text_prompts[0][text]', 'a 5 year old boy')
    formData.append('style_preset', "photographic")
    formData.append('cfg_scale', "7")
    formData.append('samples', "1")
    formData.append('steps', "30")
    const response = await fetch(
        `${apiHost}/v1/generation/${engineId}/image-to-image`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: formData,
        }
    )

    if (!response.ok) {
        return NextResponse.json({
            error: 'Failed to generate image.',
            reason: await response.text(),
        })
    }

    const responseJSON = (await response.json()) as GenerationResponse

    return NextResponse.json({
        image: "data:image/png;base64," + responseJSON.artifacts[0].base64,
        style: style,
    })
}


interface GenerationResponse {
    artifacts: Array<{
        base64: string
        seed: number
        finishReason: string
    }>
}