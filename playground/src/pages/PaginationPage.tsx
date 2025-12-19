import React from 'react';

import { Pagination } from '../../../src';

export const PaginationPage: React.FC = () => {
    return (
        <div className="pagination-page">
            <h1>Pagination Component</h1>
            <p>A pagination component for navigating through pages of content.</p>

            <section className="page-section">
                <h2>Basic Pagination</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <Pagination currentPage={3} totalPages={4} onPageChange={() => console.log('page changed')} />
                    </div>
                </div>
            </section>
        </div>
    );
};
