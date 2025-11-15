'use client';

import { createContext, useContext, useState } from 'react';

interface DropdownContextType {
	isAnyDropdownOpen: boolean;
	setDropdownOpen: (open: boolean) => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export function DropdownProvider({ children }: { children: React.ReactNode }) {
	const [isAnyDropdownOpen, setIsAnyDropdownOpen] = useState(false);

	return (
		<DropdownContext.Provider value={{ isAnyDropdownOpen, setDropdownOpen: setIsAnyDropdownOpen }}>
			{children}
		</DropdownContext.Provider>
	);
}

export function useDropdownState() {
	const context = useContext(DropdownContext);
	if (!context) throw new Error('useDropdownState must be used within DropdownProvider');
	return context;
}
