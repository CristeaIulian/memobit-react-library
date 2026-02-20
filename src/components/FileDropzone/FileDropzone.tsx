import React, { useCallback, useEffect, useRef, useState } from 'react';

import './FileDropzone.scss';

export interface FileDropzoneProps {
    label?: string;
    accept?: string;
    multiple?: boolean;
    showPreview?: boolean;
    onFiles?: (files: File[]) => void;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ label, accept, multiple = false, showPreview = true, onFiles }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        if (!showPreview) return;
        const next = files
            .filter(file => file.type.startsWith('image/'))
            .map(file => URL.createObjectURL(file));
        setPreviews(next);
        return () => {
            next.forEach(url => URL.revokeObjectURL(url));
        };
    }, [files, showPreview]);

    const updateFiles = useCallback(
        (fileList: FileList | null) => {
            if (!fileList) return;
            const nextFiles = multiple ? Array.from(fileList) : [fileList[0]].filter(Boolean) as File[];
            setFiles(nextFiles);
            onFiles?.(nextFiles);
        },
        [multiple, onFiles]
    );

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        updateFiles(event.dataTransfer.files);
    };

    return (
        <div className="file-dropzone">
            {label && <label className="file-dropzone__label">{label}</label>}
            <div
                className={`file-dropzone__area ${isDragging ? 'is-dragging' : ''}`}
                onDragEnter={event => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDragOver={event => event.preventDefault()}
                onDragLeave={event => {
                    event.preventDefault();
                    setIsDragging(false);
                }}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={event => updateFiles(event.target.files)}
                />
                <div className="file-dropzone__content">
                    <strong>Drop files here</strong>
                    <span>or click to browse</span>
                </div>
            </div>

            {files.length > 0 && (
                <div className="file-dropzone__files">
                    <h4>Selected files</h4>
                    <ul>
                        {files.map(file => (
                            <li key={file.name}>
                                {file.name} ({Math.round(file.size / 1024)} KB)
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {showPreview && previews.length > 0 && (
                <div className="file-dropzone__previews">
                    {previews.map((url, index) => (
                        <img key={url} src={url} alt={`Preview ${index + 1}`} />
                    ))}
                </div>
            )}
        </div>
    );
};
