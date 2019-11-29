
type ComboboxItem = {
	value: string;
	label: string;
};

interface I_ComboboxStore {
	selectedItem: ComboboxItem | null;

	// items for our combobox
	items: ComboboxItem[];
	
	// the current combobox search query
	query: string;

	setQuery(query: string): void;
	resetQuery: () => void;
	addNewItem(value: string): void;
	setSelectedItem(item: ComboboxItem | null): void;

	isItemExisting(value: string): boolean; 
}

type MousePosition = {
	x: number;
	y: number;
}

interface I_MousePositionStore {
	position: MousePosition;

	setPosition: (val: MousePosition) => void;
}

interface I_TextInputLengthStore {
	value: string;
	length: number;

	setValue: (val: string) => void;
}