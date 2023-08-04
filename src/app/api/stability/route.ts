import fs from 'fs'
import { NextResponse } from 'next/server'

const engineId = 'stable-diffusion-xl-1024-v1-0'
const apiHost = process.env.API_HOST ?? 'https://api.stability.ai'
const apiKey = process.env.STABILITY_API_KEY

if (!apiKey) throw new Error('Missing Stability API key.')

export async function POST(request: Request) {
    const res = await request.json()
    const img = res.image
    const prompt = res.prompt

    const formData = new FormData()
    formData.append('init_image', await (await fetch(img)).blob())
    Object.entries(prompt).forEach(([key, value]) => {
        formData.append(key, String(value))
    })

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
    })
}


interface GenerationResponse {
    artifacts: Array<{
        base64: string
        seed: number
        finishReason: string
    }>
}