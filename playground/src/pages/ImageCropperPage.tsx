import React, { useState } from 'react';

import { Button, type EncodedImage, ImageCropper, InputFile } from '../../../src';

const CARD_ASPECT = 85.6 / 54;

interface CropMode {
    label: string;
    aspect?: number;
    aspectLabel?: string;
}

const MODES: CropMode[] = [
    { label: 'Card shape (85.6 × 54)', aspect: CARD_ASPECT, aspectLabel: 'Card shape' },
    { label: 'Square', aspect: 1, aspectLabel: 'Square' },
    { label: 'Free crop' },
];

/** A stand-in photo so the demo works without picking a file: a tilted "card" on a busy background. */
const makeSamplePhoto = (): Promise<Blob | null> => {
    const canvas = document.createElement('canvas');
    canvas.width = 2400;
    canvas.height = 1800;
    const context = canvas.getContext('2d');
    if (!context) return Promise.resolve(null);
    for (let index = 0; index < 400; index++) {
        context.fillStyle = `hsl(${(index * 47) % 360}, 25%, ${20 + (index % 30)}%)`;
        context.fillRect((index * 137) % 2400, (index * 89) % 1800, 220, 160);
    }
    context.save();
    context.translate(1200, 900);
    context.rotate(-0.06);
    context.fillStyle = '#3b5bdb';
    context.fillRect(-640, -400, 1280, 800);
    context.fillStyle = '#ffffff';
    context.font = 'bold 110px sans-serif';
    context.fillText('LOYALTY CARD', -560, -220);
    context.restore();
    return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
};

export const ImageCropperPage: React.FC = () => {
    const [source, setSource] = useState<Blob | null>(null);
    const [mode, setMode] = useState<CropMode | null>(null);
    const [result, setResult] = useState<EncodedImage | null>(null);

    const open = async (nextMode: CropMode) => {
        const photo = source ?? (await makeSamplePhoto());
        if (!photo) return;
        setSource(photo);
        setMode(nextMode);
    };

    return (
        <div className="image-cropper-page">
            <h1>Image Cropper</h1>
            <p>
                Crop and rotate a photo before upload. The result comes back downscaled (1600px longest edge by default) and encoded as WebP, or JPEG where WebP
                cannot be encoded, with EXIF metadata dropped. The same pipeline is available without the UI as <code>cropImage()</code>.
            </p>

            <section className="page-section">
                <h2>Try it</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <InputFile
                            label="Your own photo (optional, a sample is used otherwise)"
                            accept="image/*"
                            onChange={files => {
                                setSource(files?.[0] ?? null);
                                setResult(null);
                            }}
                        />
                    </div>
                    <div className="component-group">
                        {MODES.map(cropMode => (
                            <Button key={cropMode.label} variant="info" icon="image" onClick={() => void open(cropMode)}>
                                {cropMode.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {result && (
                <section className="page-section">
                    <h2>Result</h2>
                    <p>
                        {result.width} × {result.height}px · {result.mimeType} · {Math.round((result.base64.length * 0.75) / 1024)} KB
                    </p>
                    <img src={result.dataUrl} alt="Cropped result" style={{ maxWidth: '100%', maxHeight: '50vh' }} />
                </section>
            )}

            <ImageCropper
                isOpen={mode !== null}
                source={source}
                title="Crop the photo"
                aspect={mode?.aspect}
                aspectLabel={mode?.aspectLabel}
                onCancel={() => setMode(null)}
                onApply={image => {
                    setResult(image);
                    setMode(null);
                }}
            />
        </div>
    );
};
