import React, { useState } from 'react';

import { Button, FloatingWindow, type FloatingWindowPosition, type FloatingWindowSize, InputTextarea } from '../../../src';

export const FloatingWindowPage: React.FC = () => {
    const [isBasicOpen, setIsBasicOpen] = useState(false);
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [isFixedOpen, setIsFixedOpen] = useState(false);
    const [isBareOpen, setIsBareOpen] = useState(false);
    const [areStackedOpen, setAreStackedOpen] = useState(false);
    const [notes, setNotes] = useState('Drag me around by the title bar. Resize me from any edge or corner.');
    const [geometry, setGeometry] = useState<(FloatingWindowPosition & FloatingWindowSize) | null>(null);

    return (
        <div className="floating-window-page">
            <h1>Floating Window</h1>
            <p>
                A non-modal window: drag it by the title bar, resize it from any edge or corner, collapse it to its header, or maximize it to the viewport.
                Double-clicking the header toggles maximize. It stays out of the way of the page behind it — nothing is locked or dimmed.
            </p>

            <section className="page-section">
                <h2>Basic</h2>

                <div className="showcase-group">
                    <h3>Open a window</h3>
                    <div className="component-group">
                        <Button onClick={() => setIsBasicOpen(true)} variant="info">
                            Open window
                        </Button>
                    </div>

                    <FloatingWindow isOpen={isBasicOpen} onClose={() => setIsBasicOpen(false)} title="Window" titleIcon="information">
                        <p>The page behind stays fully usable — scroll it, click it, open another window on top.</p>
                        <p>Try the three controls in the header: collapse, maximize, close.</p>
                    </FloatingWindow>
                </div>
            </section>

            <section className="page-section">
                <h2>With content and a footer</h2>

                <div className="showcase-group">
                    <h3>A scratch notes window</h3>
                    <div className="component-group">
                        <Button onClick={() => setIsNotesOpen(true)} variant="success">
                            Open notes
                        </Button>
                    </div>

                    <FloatingWindow
                        defaultPosition={{ x: 120, y: 160 }}
                        defaultSize={{ height: 320, width: 420 }}
                        footer={
                            <>
                                <Button onClick={() => setNotes('')} size="small" variant="default">
                                    Clear
                                </Button>
                                <Button onClick={() => setIsNotesOpen(false)} size="small" variant="success">
                                    Done
                                </Button>
                            </>
                        }
                        isOpen={isNotesOpen}
                        onClose={() => setIsNotesOpen(false)}
                        onGeometryChange={setGeometry}
                        title="Notes"
                        titleIcon="notes"
                    >
                        <InputTextarea onChange={setNotes} rows={6} value={notes} />
                    </FloatingWindow>

                    <p>
                        onGeometryChange:{' '}
                        {geometry ? `${Math.round(geometry.x)}, ${Math.round(geometry.y)} — ${Math.round(geometry.width)}×${Math.round(geometry.height)}` : 'move or resize the notes window'}
                    </p>
                </div>
            </section>

            <section className="page-section">
                <h2>Fixed size</h2>

                <div className="showcase-group">
                    <h3>Draggable but not resizable</h3>
                    <p>
                        <code>resizable={'{false}'}</code> drops the edge handles and the maximize control.
                    </p>
                    <div className="component-group">
                        <Button onClick={() => setIsFixedOpen(true)} variant="warning">
                            Open fixed window
                        </Button>
                    </div>

                    <FloatingWindow
                        defaultPosition={{ x: 200, y: 200 }}
                        defaultSize={{ height: 220, width: 320 }}
                        isOpen={isFixedOpen}
                        onClose={() => setIsFixedOpen(false)}
                        resizable={false}
                        title="Fixed size"
                    >
                        <p>Move me, but my size is settled.</p>
                    </FloatingWindow>
                </div>

                <div className="showcase-group">
                    <h3>Close button only</h3>
                    <p>Both the collapse and the maximize controls turned off, and Escape wired up to close.</p>
                    <div className="component-group">
                        <Button onClick={() => setIsBareOpen(true)} variant="default">
                            Open bare window
                        </Button>
                    </div>

                    <FloatingWindow
                        closeOnEscape
                        defaultPosition={{ x: 260, y: 240 }}
                        defaultSize={{ height: 180, width: 300 }}
                        isOpen={isBareOpen}
                        minimizable={false}
                        onClose={() => setIsBareOpen(false)}
                        resizable={false}
                        title="Bare"
                    >
                        <p>Press Escape to close.</p>
                    </FloatingWindow>
                </div>
            </section>

            <section className="page-section">
                <h2>Several at once</h2>

                <div className="showcase-group">
                    <h3>Stacked with explicit z-index</h3>
                    <p>Windows are independent, so a workspace can hold as many as it needs.</p>
                    <div className="component-group">
                        <Button onClick={() => setAreStackedOpen(true)} variant="info">
                            Open three
                        </Button>
                        <Button onClick={() => setAreStackedOpen(false)} variant="default">
                            Close three
                        </Button>
                    </div>

                    <FloatingWindow
                        defaultPosition={{ x: 80, y: 120 }}
                        defaultSize={{ height: 200, width: 300 }}
                        isOpen={areStackedOpen}
                        onClose={() => setAreStackedOpen(false)}
                        title="First"
                        zIndex={900}
                    >
                        <p>zIndex 900</p>
                    </FloatingWindow>

                    <FloatingWindow
                        defaultPosition={{ x: 180, y: 190 }}
                        defaultSize={{ height: 200, width: 300 }}
                        isOpen={areStackedOpen}
                        onClose={() => setAreStackedOpen(false)}
                        title="Second"
                        zIndex={901}
                    >
                        <p>zIndex 901</p>
                    </FloatingWindow>

                    <FloatingWindow
                        defaultPosition={{ x: 280, y: 260 }}
                        defaultSize={{ height: 200, width: 300 }}
                        isOpen={areStackedOpen}
                        onClose={() => setAreStackedOpen(false)}
                        title="Third"
                        zIndex={902}
                    >
                        <p>zIndex 902</p>
                    </FloatingWindow>
                </div>
            </section>
        </div>
    );
};
