import { Label } from '@radix-ui/react-label'
import { FileIcon, TrashIcon } from 'lucide-react'
import React, { ChangeEvent, DragEvent, useState } from 'react'

import { Button } from '@/components/ui/button'

import { formatFileSize } from './helperFunction'

interface FileMap {
  [key: string]: File
}

type FileUploadProps = {
  files: FileMap
  setFiles: React.Dispatch<React.SetStateAction<FileMap>>
}

const FileUpload: React.FC<FileUploadProps> = ({ files, setFiles }) => {
  const [dragCounter, setDragCounter] = useState(0)

  const addFile = (file: File) => {
    const objectURL = URL.createObjectURL(file)
    setFiles((prevFiles) => ({ ...prevFiles, [objectURL]: file }))
  }

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    for (const file of e.dataTransfer.files) {
      addFile(file)
    }
    setDragCounter(0)
  }

  const handleDragEnter = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    setDragCounter((prevCounter) => prevCounter + 1)
  }

  const handleDragLeave = () => {
    setDragCounter((prevCounter) => prevCounter - 1)
  }

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      for (const file of e.target.files) {
        addFile(file)
      }
    }
  }

  const handleDelete = (key: string) => {
    setFiles((prevFiles) => {
      const newFiles = { ...prevFiles }
      delete newFiles[key]
      return newFiles
    })
  }

  return (
    <article
      aria-label="File Upload Modal"
      className="relative flex w-full flex-col rounded-md"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnter={handleDragEnter}
    >
      <div className="mt-4 flex">
        <Label className="font-bold">Bilder</Label>
      </div>
      <div
        id="overlay"
        className={`pointer-events-none absolute left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center rounded-md ${
          dragCounter > 0 ? 'draggedover' : ''
        }`}
      >
        {Object.values(files).length == 0 && (
          <>
            {/* <UploadCloudIcon className="mt-[100px] h-16 w-16" />
            <p className="text-lg">Drop files to upload</p> */}
          </>
        )}
      </div>

      <section className="flex h-full w-full flex-col overflow-auto p-8">
        {/* Drag and Drop files */}
        <header className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 py-12">
          <p className="mb-3 hidden flex-wrap justify-center font-semibold sm:block">
            <Label>Ziehe deine Dateien hierher oder</Label>
          </p>
          <input
            id="hidden-input"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            id="button"
            onClick={() => document.getElementById('hidden-input')?.click()}
          >
            Wähle Dateien
          </Button>
        </header>

        <ul id="gallery" className="-m-1 mt-6 flex flex-1 flex-wrap">
          {Object.keys(files).length === 0 ? (
            <li
              id="empty"
              className="flex h-full w-full flex-col items-center justify-center text-center"
            >
              <img
                className="mx-auto w-32"
                src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                alt="no data"
              />
              <span className="text-small text-gray-500">
                Keine Dateien ausgewählt
              </span>
            </li>
          ) : (
            Object.keys(files).map((key) => {
              const file = files[key]
              const isImage = file?.type.match('image.*')
              return (
                <li key={key} className="ml-2 mt-1 block h-40 w-40">
                  <article
                    tabIndex={0}
                    className={`focus:shadow-outline group relative h-full w-full cursor-pointer rounded-md bg-gray-100 shadow-sm focus:outline-none ${
                      isImage ? 'hasImage' : ''
                    }`}
                  >
                    {isImage && file && (
                      <img
                        alt="upload preview"
                        className="img-preview sticky h-full w-full rounded-md bg-fixed object-cover"
                        src={URL.createObjectURL(file)}
                      />
                    )}

                    {/* Filename, File Size, Delete Button*/}
                    <section className="absolute top-0 z-20 flex min-h-[160px] w-full flex-col justify-between break-words rounded-md px-3 py-2 text-xs">
                      {/* File Name */}
                      <h1 className="rounded-md bg-secondary p-1">
                        {file?.name ?? ''}
                      </h1>

                      <div className="flex items-center">
                        {/* File Icon and Fil Size */}
                        <div className="flex rounded-md bg-secondary">
                          <span className="p-1">
                            <FileIcon className="h-4 w-4 " />
                          </span>
                          <p className="size p-1 text-xs">
                            {formatFileSize(file?.size ?? 0)}
                          </p>
                        </div>
                        <button
                          className="delete ml-auto rounded-md bg-secondary p-1 hover:text-primary focus:outline-none"
                          onClick={() => handleDelete(key)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </section>
                  </article>
                </li>
              )
            })
          )}
        </ul>
      </section>
    </article>
  )
}

export default FileUpload
