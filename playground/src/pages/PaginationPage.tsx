import React from 'react';

import { Pagination } from '../../../src';

export const PaginationPage: React.FC = () => {
    const [page, setPage] = React.useState<number>(1);
    const [pageSize, setPageSize] = React.useState<number>(10);

    const pageChanged = (newPage: number) => {
        setPage(newPage);
    };

    const onPageSizeChange = (newItemsPerPage: number) => {
        setPageSize(newItemsPerPage);
    };

    return (
        <div className="pagination-page">
            <h1>Pagination Component</h1>
            <p>A pagination component for navigating through pages of content.</p>

            <section className="page-section">
                <h2>Basic Pagination</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <Pagination currentPage={page} totalPages={24} onPageChange={pageChanged} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Aligned Left Pagination</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <Pagination horizontalAlign="left" currentPage={page} totalPages={4} onPageChange={pageChanged} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Aligned Left with Page Selector</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <Pagination
                            horizontalAlign="left"
                            currentPage={page}
                            totalPages={4}
                            onPageChange={pageChanged}
                            pageSize={pageSize}
                            pageSizeOptions={[5, 10, 20, 50, 100]}
                            onPageSizeChange={onPageSizeChange}
                            pageSizeLabel="Items per page"
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Aligned Center Pagination</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <Pagination horizontalAlign="center" currentPage={page} totalPages={4} onPageChange={pageChanged} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Aligned Center with Page selector</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <Pagination
                            horizontalAlign="center"
                            currentPage={page}
                            totalPages={4}
                            onPageChange={pageChanged}
                            pageSize={5}
                            pageSizeOptions={[5, 10, 20, 50, 100]}
                            onPageSizeChange={onPageSizeChange}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Aligned Right Pagination</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <Pagination horizontalAlign="right" currentPage={page} totalPages={4} onPageChange={pageChanged} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Aligned Right with Page selector</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <Pagination
                            horizontalAlign="right"
                            currentPage={page}
                            totalPages={4}
                            onPageChange={pageChanged}
                            pageSize={5}
                            pageSizeOptions={[5, 10, 20, 50, 100]}
                            onPageSizeChange={onPageSizeChange}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Show Page number</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <Pagination horizontalAlign="left" currentPage={page} totalPages={4} onPageChange={pageChanged} showPagesNumbers />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Show Page number with Page selector</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <Pagination
                            horizontalAlign="left"
                            currentPage={page}
                            totalPages={4}
                            onPageChange={pageChanged}
                            showPagesNumbers
                            pageSize={5}
                            pageSizeOptions={[5, 10, 20, 50, 100]}
                            onPageSizeChange={onPageSizeChange}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
