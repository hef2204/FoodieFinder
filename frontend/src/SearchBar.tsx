import React, { useState } from 'react';

interface SearchBarProps {
    onSearchChange: (searchQuery: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange }) => {
    const [search, setSearch] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchQuery = e.target.value;
        setSearch(newSearchQuery);
        onSearchChange(newSearchQuery); // Call the onSearchChange function with the new search query
    };

    return (
        <div className="search">
            <input
                type="search"
                placeholder="Search..."
                value={search}
                onChange={handleSearchChange}
            />
        </div>
    );
};

export default SearchBar;
