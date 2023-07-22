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
    const outputPath = `images/output/${fileName}`
    fs.writeFile(inputPath, buf, () => {});

    const { stdout, stderr } = await exec(`src\\modules\\deep-art-effect\\DeepArtEffectsCli.exe artfilter -input "${inputPath}" -output "public/${outputPath}" -stylename "${style}"`)

    return NextResponse.json({
        image: outputPath,
        style: style,
        stdout: stdout,
        stderr: stderr,
    })
}