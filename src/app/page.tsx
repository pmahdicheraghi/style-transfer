'use client'

import { use, useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam';

export default function Home() {
  const [data, setData] = useState<{ id: string; url: string, title: string }[]>()
  const [result, setResult] = useState("")
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [style, setStyle] = useState("")
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    fetch('/api/styles')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
      })
  }, [])

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot() ?? "";
    setImage(imageSrc)
    setResult("")
  }, [webcamRef])

  const transfer = useCallback(() => {
    setLoading(true)
    fetch('/api/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image,
        style
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setResult(data.image)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [image, style])


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10 gap-10" >
      <div className="flex flex-row items-center justify-between w-full gap-10">
        {data && data.slice(3, 9).map((item, index) => (
          <div
            className={`flex flex-col items-center gap-2 border-2 ${style === item.title ? 'border-lime-300' : 'border-transparent'}`}
            key={index}
            onClick={() => setStyle(item.title)}
          >
            <img
              src={item.url}
              alt={item.title}
            />
            <p>{item.title}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-between w-full gap-10">
        <Webcam
          className='w-1/2 border-2 border-lime-300'
          mirrored
          audio={false}
          height={720}
          ref={webcamRef}
          screenshotFormat="image/png"
          width={1280}
          videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: "user"
          }}
        />
        <div className="w-1/2 border-2 border-lime-300">
          {loading ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <img src='/loading.svg' className='w-1/2' />
            </div>
          )
            : ((image || result) &&
              <img src={result || image} className='w-full h-full' />
            )
          }
        </div>
      </div>
      <div className="flex flex-row items-center gap-5">
        <button
          className='border-2 border-lime-300 rounded p-2'
          onClick={capture}>
          {"ثبت عکس"}
        </button>
        <button
          disabled={!image || !style}
          className='border-2 border-lime-300 rounded p-2'
          onClick={transfer}>
          {"تبدیل عکس"}
        </button>
      </div>
    </main >
  )
}
