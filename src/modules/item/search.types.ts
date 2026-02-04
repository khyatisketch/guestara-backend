export type SearchQueryDTO = {
    q?: string;
    category?: string;
    subcategory?: string;
    active?: boolean;
    minPrice?: number;
    maxPrice?: number;
    time?: string;
    durationHours?: number;
    sort?: 'name' | 'price' | 'createdAt';
    page?: number;
    limit?: number;
};

export type SearchResultItem = {
    item: unknown;
    price: number;
};

export type SearchResult = {
    data: SearchResultItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
};
