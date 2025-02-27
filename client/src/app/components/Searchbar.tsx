import React, { useState, useEffect } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { useDocumentStore } from '../store/useDocumentStore';

const Searchbar = () => {
  const [search, setSearch] = useState('');
  const setSearchInStore = useDocumentStore((state) => state.setSearch);
  const filterDocuments = useDocumentStore((state) => state.filterDocuments);

  const handleClear = () => {
    setSearch('');
    setSearchInStore('');
    filterDocuments();
  };

  useEffect(() => {
    setSearchInStore(search);
    filterDocuments();
  }, [search, setSearchInStore, filterDocuments]);

  return (
    <div className='relative'>
      <input
        className='bg-[#005d87] text-white px-4 py-2 rounded-lg w-[300px]'
        type="text"
        placeholder='Search Document By Name'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <IoCloseCircle
          className='absolute right-2 top-1/2 transform -translate-y-1/2 text-white cursor-pointer'
          onClick={handleClear}
          size={20}
        />
      )}
    </div>
  );
};

export default Searchbar;