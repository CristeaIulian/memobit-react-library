import React from 'react';

import { AvatarInitials } from '../../../src';

export const AvatarInitialsPage: React.FC = () => {
    return (
        <div className="component-page">
            <h1>Avatar Initials Component</h1>
            <p>Deterministic initials avatars with size and shape options.</p>

            <section className="page-section">
                <h2>Sizes</h2>
                <div className="showcase-group">
                    <h3>Small, medium, large</h3>
                    <div className="component-group">
                        <AvatarInitials name="Ada Lovelace" size="small" />
                        <AvatarInitials name="Grace Hopper" size="medium" />
                        <AvatarInitials name="Alan Turing" size="large" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Shapes</h2>
                <div className="showcase-group">
                    <h3>Rounded vs squared</h3>
                    <div className="component-group">
                        <AvatarInitials name="Edsger Dijkstra" shape="rounded" />
                        <AvatarInitials name="Barbara Liskov" shape="squared" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Multiple Avatars</h2>
                <div className="showcase-group">
                    <h3>Team list</h3>
                    <div className="component-group">
                        <AvatarInitials name="Linus Torvalds" />
                        <AvatarInitials name="Margaret Hamilton" />
                        <AvatarInitials name="Tim Berners-Lee" />
                        <AvatarInitials name="Katherine Johnson" />
                    </div>
                </div>
            </section>
        </div>
    );
};
