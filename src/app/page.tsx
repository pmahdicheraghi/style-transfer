'use client'

import { use, useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam';
import { BsCameraFill } from "react-icons/bs"
import { MdChangeCircle } from "react-icons/md"

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
        setStyle(data[0].title)
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
    <main className="flex min-h-screen flex-col p-5 gap-5 lg:p-10 lg:gap-10 items-center" >
      <div className="flex flex-row items-center justify-between gap-10 overflow-x-auto w-full">
        {data?.map((item, index) => (
          <div
            className={`flex flex-col items-center gap-2 border-2 ${style === item.title ? 'border-lime-300' : 'border-transparent'}`}
            key={index}
            onClick={() => setStyle(item.title)}
          >
            <img
              src={item.url}
              alt={item.title}
              className="max-w-[150px] w-[150px] h-[150px] object-cover"
            />
            <p>{item.title}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-between w-full gap-5 lg:gap-10 lg:flex-row">
        <Webcam
          className='border-2 border-lime-300 lg:w-1/2'
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
        <div className="border-2 border-lime-300 aspect-video lg:w-1/2">
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
      <div className="flex flex-row justify-center border-2 border-lime-300 rounded-full w-fit text-4xl">
        <button
          className='p-3 hover:text-lime-300'
          onClick={capture}>
          <BsCameraFill />
        </button>
        <div className="border-2 border-r border-lime-300" />
        <button
          disabled={!image}
          className={`p-3 ${!image ? "" : "hover:text-lime-300"}`}
          onClick={transfer}>
          <MdChangeCircle />
        </button>
      </div>
    </main >
  )
}
