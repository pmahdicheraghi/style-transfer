import { NextResponse } from "next/server";
import util from 'util';
import fs from 'fs';

const exec = util.promisify(require('child_process').exec);

export async function POST(request: Request) {
    const res = await request.json()
    const img = res.image
    const style = res.style
    const data = img.replace(/^data:image\/\w+;base64,/, "");
    const buf = Buffer.from(data, 'base64');
    const fileName = `${Date.now()}.png`
    const inputPath = `public/images/input/${fileName}`
    const outputPath = `public/images/output/${fileName}`
    fs.writeFileSync(inputPath, buf);

    const { stdout, stderr } = await exec(`src\\modules\\deep-art-effect\\DeepArtEffectsCli.exe artfilter -input "${inputPath}" -output "${outputPath}" -stylename "${style}"`)

    const outImage = fs.readFileSync(outputPath, 'base64');

    return NextResponse.json({
        image: "data:image/png;base64," + outImage,
        style: style,
        stdout: stdout,
        stderr: stderr,
    })
}