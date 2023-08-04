'use client'

import { use, useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam';
import { BsCameraFill } from "react-icons/bs"
import { MdChangeCircle } from "react-icons/md"

function imageToDataUri(image: string, width: number, height: number, setImage: (image: string) => void) {
  const img = new Image();
  img.src = image
  
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  img.onload = function() {
    const croppedWidth = img.width;
    const croppedHeight = img.height;
    context?.drawImage(img, -(croppedWidth - width) / 2, -(croppedHeight - height) / 2, croppedWidth, croppedHeight);
    setImage(canvas.toDataURL());
  };
}

export default function Home() {
  const [data, setData] = useState<{ prompt: object; url: string, title: string }[]>()
  const [styleIndex, setStyleIndex] = useState(0)
  const [result, setResult] = useState("")
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(false)
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
    imageToDataUri(imageSrc, 1024, 1024, setImage)
    setResult("")
  }, [webcamRef])

  const transfer = useCallback(() => {
    setLoading(true)
    fetch('/api/stability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image,
        prompt: data?.[styleIndex].prompt
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setResult(data.image)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [image, styleIndex])


  return (
    <main className="flex min-h-screen flex-col p-5 gap-5 lg:p-10 lg:gap-10 items-center" >
      <div className="flex flex-row items-center justify-between gap-10 overflow-x-auto w-full">
        {data?.map((item, index) => (
          <div
            className={`flex flex-col items-center gap-2 border-2 ${styleIndex === index ? 'border-lime-300' : 'border-transparent'}`}
            key={index}
            onClick={() => setStyleIndex(index)}
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
          className='border-2 border-lime-300 lg:w-1/2 aspect-square'
          mirrored
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          minScreenshotWidth={1280}
          minScreenshotHeight={720}
          videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: "user"
          }}
        />
        <div className="border-2 border-lime-300 lg:w-1/2 aspect-square">
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
